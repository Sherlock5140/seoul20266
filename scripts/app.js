(function bootSeoul2026App(global) {
  const { createApp, ref, computed, onMounted, onUnmounted, nextTick, watch } = Vue;
  const { DEBUG_ENABLED, APP_VERSION, CATEGORY_CONFIG, REGEX_NEWLINE, REGEX_KEYWORDS } = global.Seoul2026Config;
  const { clone, copyText, debounce, escapeHtml } = global.Seoul2026Utils;
  const { getActiveTripId, loadTripState, saveTripState } = global.Seoul2026Storage;
  const { formatConvertedValue, getStoredRateState, persistRateDirection, persistRates, refreshRates } = global.Seoul2026Rates;
  const { createMapService } = global.Seoul2026Map;
  const tripCatalog = global.Seoul2026TripData;

  const showDebugOverlay = (payload) => {
    if (!DEBUG_ENABLED) return;
    const existing = document.getElementById('debug-error-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'debug-error-overlay';
    overlay.style.cssText = 'position:fixed;inset:auto 16px 16px 16px;z-index:99999;padding:18px;background:rgba(255,255,255,0.96);color:#2E2E2E;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;border-radius:18px;border:1px solid rgba(0,0,0,0.08);box-shadow:0 20px 40px rgba(0,0,0,0.12);max-height:45vh;';

    const title = document.createElement('div');
    title.style.cssText = 'font:700 16px/1.4 -apple-system,BlinkMacSystemFont,sans-serif;margin-bottom:10px;';
    title.textContent = 'Debug Error';

    const body = document.createElement('pre');
    body.style.cssText = 'white-space:pre-wrap;word-break:break-word;font-size:12px;line-height:1.55;margin:0;';
    body.textContent = typeof payload === 'string'
      ? payload
      : [
          payload?.name ? `name: ${payload.name}` : '',
          payload?.message ? `message: ${payload.message}` : '',
          payload?.stack ? `stack:\n${payload.stack}` : String(payload)
        ].filter(Boolean).join('\n\n');

    overlay.append(title, body);
    document.body.appendChild(overlay);
  };

  if (DEBUG_ENABLED) {
    console.info(`[Seoul 2026] debug enabled (${APP_VERSION})`);
    window.addEventListener('error', (event) => {
      showDebugOverlay(event.error || event.message);
    });
    window.addEventListener('unhandledrejection', (event) => {
      showDebugOverlay(event.reason || 'Unhandled promise rejection');
    });
  }

  const getTripTemplate = (tripId) => tripCatalog.trips[tripId] || tripCatalog.trips[tripCatalog.defaultTripId];

  const app = createApp({
    setup() {
      const showNotebook = ref(false);
      const showSync = ref(false);
      const showRates = ref(false);
      const saveStatus = ref('Ready');
      const currentDayIndex = ref(0);
      const activeEventId = ref(null);
      const mapError = ref(false);
      const ratesLoading = ref(false);
      const rateError = ref(false);
      const { rateDirection: initialRateDirection, exchangeRates: initialExchangeRates, rateUpdatedAt: initialRateUpdatedAt } = getStoredRateState();
      const rateDirection = ref(initialRateDirection);
      const exchangeRates = ref(initialExchangeRates);
      const rateUpdatedAt = ref(initialRateUpdatedAt);
      const krwInput = ref('10000');
      const twdInput = ref('');
      const lastRateInput = ref('krw');

      const activeTripId = ref(getActiveTripId(tripCatalog.defaultTripId));
      const template = getTripTemplate(activeTripId.value);
      const savedTripData = loadTripState(activeTripId.value);

      const currentTripTitle = ref(savedTripData.meta.title || template.meta.title);
      const countrySetting = ref(savedTripData.meta.country || template.meta.country);
      const schedule = ref(clone(savedTripData.schedule || template.schedule));
      const userNotes = ref(savedTripData.notes || '');
      const currentTripDisplayName = computed(() => {
        const raw = activeTripId.value?.split('_')[0] || 'SEOUL';
        return raw === 'SEOUL' ? 'SEOUL' : raw;
      });

      const timelineContainerRef = ref(null);
      const dayRefs = ref({});
      const openNoteBtn = ref(null);
      const noteTextarea = ref(null);
      const closeNoteBtn = ref(null);

      let isHydrating = true;
      let saveStatusTimer = null;
      let rateErrorTimer = null;
      let lastItineraryTapAt = 0;

      const currentDay = computed(() => schedule.value[currentDayIndex.value] || { date: '', title: '', events: [] });
      const displayEvents = computed(() => currentDay.value.events || []);
      const rateDirectionLabel = computed(() => rateDirection.value === 'krw_to_twd' ? 'KRW → TWD' : 'TWD → KRW');
      const displayKrwRate = computed(() => {
        const rate = exchangeRates.value.krwToTwd || 0;
        if (!rate) return '--';
        return rateDirection.value === 'krw_to_twd' ? rate.toFixed(5) : (1 / rate).toFixed(2);
      });
      const displayUsdRate = computed(() => {
        const rate = exchangeRates.value.usdToTwd || 0;
        return rate ? rate.toFixed(2) : '--';
      });
      const rateHintText = computed(() => {
        const rate = exchangeRates.value.krwToTwd || 0;
        if (!rate) return '匯率資料尚未更新';
        return rateDirection.value === 'krw_to_twd'
          ? `1 KRW ≈ ${rate.toFixed(5)} TWD`
          : `1 TWD ≈ ${(1 / rate).toFixed(2)} KRW`;
      });
      const rateUpdatedLabel = computed(() => {
        if (!rateUpdatedAt.value) return '尚未更新';
        const parsedDate = new Date(rateUpdatedAt.value);
        if (Number.isNaN(parsedDate.getTime())) return rateUpdatedAt.value;
        const now = new Date();
        const timeLabel = parsedDate.toLocaleTimeString('zh-TW', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        return parsedDate.toDateString() === now.toDateString()
          ? `今日 ${timeLabel}`
          : `${parsedDate.getMonth() + 1}/${parsedDate.getDate()} ${timeLabel}`;
      });
      const mapLegendItems = computed(() => {
        const items = {};
        Object.values(CATEGORY_CONFIG).forEach((config) => {
          if (config.label !== 'Other') items[config.label] = config;
        });
        return items;
      });

      const persistTrip = debounce(() => {
        saveStatus.value = 'Saving...';
        try {
          saveTripState({
            tripId: activeTripId.value,
            notes: userNotes.value,
            schedule: schedule.value,
            meta: {
              title: currentTripTitle.value,
              country: countrySetting.value
            }
          });
          saveStatus.value = 'Saved';
          clearTimeout(saveStatusTimer);
          saveStatusTimer = setTimeout(() => {
            if (saveStatus.value === 'Saved') saveStatus.value = 'Ready';
          }, 1800);
        } catch (error) {
          console.error('Save failed', error);
          saveStatus.value = error?.name === 'QuotaExceededError' ? '儲存空間已滿' : '儲存失敗';
          clearTimeout(saveStatusTimer);
          saveStatusTimer = setTimeout(() => {
            if (!['Ready', 'Saving...', 'Saved'].includes(saveStatus.value)) {
              saveStatus.value = 'Ready';
            }
          }, 4000);
        }
      }, 600);

      const formatNote = (note) => {
        if (!note) return '';
        let processed = escapeHtml(note);
        processed = processed.replace(REGEX_NEWLINE, '<br>');
        processed = processed.replace(REGEX_KEYWORDS, '<span class="font-bold text-typo-title bg-yellow-100 px-1 rounded">$1</span>');
        processed = processed.replace(/([0-9,]+)\s*(韓元|元|KRW)/g, '<span class="font-mono font-bold text-s-green">$1 $2</span>');
        processed = processed.replace(/\b([01]\d|2[0-3]):([0-5]\d)\b/g, '<span class="font-mono font-bold text-typo-title bg-gray-100 px-1 rounded">$&</span>');
        return processed;
      };

      const formatNoticeInline = (line) => {
        let processed = escapeHtml(line || '');
        processed = processed.replace(REGEX_KEYWORDS, '<span class="font-bold text-typo-title bg-yellow-100 px-1 rounded">$1</span>');
        processed = processed.replace(/([0-9,]+)\s*(韓元|元|KRW)/g, '<span class="font-mono font-bold text-s-green">$1 $2</span>');
        processed = processed.replace(/\b([01]\d|2[0-3]):([0-5]\d)\b/g, '<span class="font-mono font-bold text-typo-title bg-gray-100 px-1 rounded">$&</span>');
        return processed;
      };

      const formatDayNotice = (note) => {
        if (!note) return '';
        const lines = String(note).split('\n');
        const sections = [];
        let current = { title: '', lines: [] };

        const pushCurrent = () => {
          if (current.title || current.lines.length) sections.push(current);
          current = { title: '', lines: [] };
        };

        lines.forEach((rawLine) => {
          const line = rawLine.trim();
          if (!line) return;
          if (/^=+$/.test(line) || /^[-_]{4,}$/.test(line)) {
            pushCurrent();
            return;
          }
          if (/^=+.*[^=].*=+$/.test(line)) {
            pushCurrent();
            current.title = line.replace(/^=+/, '').replace(/=+$/, '').trim();
            return;
          }
          current.lines.push(line);
        });
        pushCurrent();

        return sections.map((section) => {
          const titleHtml = section.title
            ? `<div class="notice-section-title">${formatNoticeInline(section.title)}</div>`
            : '';
          const bodyHtml = section.lines.map((line) => {
            if (/^▼/.test(line)) {
              return `<div class="notice-line notice-decision-line">${formatNoticeInline(line)}</div>`;
            }
            if (/^[*＊]/.test(line)) {
              return `<div class="notice-line">${formatNoticeInline(line)}</div>`;
            }
            const scheduleMatch = line.match(/^([0-9]{1,2}:[0-9]{2})\s*｜\s*(.+)$/);
            if (scheduleMatch) {
              return `<div class="notice-line notice-schedule-line"><div class="notice-schedule-time">${escapeHtml(scheduleMatch[1])}</div><div>${formatNoticeInline(scheduleMatch[2])}</div></div>`;
            }
            return `<div class="notice-line">${formatNoticeInline(line)}</div>`;
          }).join('');
          return `<div class="notice-section-card">${titleHtml}${bodyHtml}</div>`;
        }).join('<div class="notice-divider-line"></div>');
      };

      const getDotColor = (category) => (CATEGORY_CONFIG[category] || CATEGORY_CONFIG.default).icon;
      const getCategoryBadge = (category) => (CATEGORY_CONFIG[category] || CATEGORY_CONFIG.default).icon;
      const getTagStyle = (tag) => {
        if (tag === '死線' || tag === '風險') return 'bg-s-alert/20 text-s-alert';
        if (tag === '關鍵') return 'bg-s-warn/20 text-s-warn';
        if (tag === '現金') return 'bg-s-green/20 text-s-green';
        return 'bg-m-border text-m-sub';
      };
      const extractCrowdBadge = (title) => {
        const match = String(title || '').match(/(👥\s*.+)$/);
        return match ? match[1] : '';
      };
      const cleanDayTitle = (title) => String(title || '').replace(/\s*👥\s*.+$/, '').trim();

      const setMapError = (value) => {
        mapError.value = value;
      };

      const clearActiveEvent = () => {
        activeEventId.value = null;
      };

      const mapService = createMapService({
        categoryConfig: CATEGORY_CONFIG,
        countrySettingRef: countrySetting,
        escapeHtml,
        focusEvent: (eventId) => focusEvent(eventId),
        getDisplayEvents: () => displayEvents.value,
        getSchedule: () => schedule.value
      });

      const handleKrwInput = () => {
        const rate = exchangeRates.value.krwToTwd || 0;
        const value = Number(krwInput.value);
        if (!krwInput.value || !Number.isFinite(value) || !rate) {
          twdInput.value = '';
          return;
        }
        twdInput.value = formatConvertedValue(value * rate);
      };

      const handleTwdInput = () => {
        const rate = exchangeRates.value.krwToTwd || 0;
        const value = Number(twdInput.value);
        if (!twdInput.value || !Number.isFinite(value) || !rate) {
          krwInput.value = '';
          return;
        }
        krwInput.value = formatConvertedValue(value / rate);
      };

      const toggleRateDirection = () => {
        rateDirection.value = rateDirection.value === 'krw_to_twd' ? 'twd_to_krw' : 'krw_to_twd';
        persistRateDirection(rateDirection.value);
      };

      const refreshRateData = async () => {
        ratesLoading.value = true;
        rateError.value = false;
        clearTimeout(rateErrorTimer);
        try {
          const nextRates = await refreshRates();
          exchangeRates.value = {
            usdToTwd: nextRates.usdToTwd,
            krwToTwd: nextRates.krwToTwd
          };
          rateUpdatedAt.value = nextRates.updatedAt;
          persistRates(exchangeRates.value, rateUpdatedAt.value);
        } catch (error) {
          console.warn('Rate refresh failed', error);
          rateError.value = true;
          clearTimeout(rateErrorTimer);
          rateErrorTimer = setTimeout(() => {
            rateError.value = false;
          }, 3000);
        } finally {
          ratesLoading.value = false;
        }
      };

      const selectDay = (index) => {
        currentDayIndex.value = index;
        activeEventId.value = null;
        if (timelineContainerRef.value) timelineContainerRef.value.scrollTop = 0;
        nextTick(() => {
          const btn = dayRefs.value[index];
          if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          mapService.renderMarkers();
        });
      };

      function focusEvent(id) {
        const event = displayEvents.value.find((item) => item.id === id);
        if (!event) return;
        activeEventId.value = id;
        mapService.highlightEvent(id, event);
        nextTick(() => {
          const element = document.getElementById(`event-${id}`);
          if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }

      const openMealMap = (type) => {
        const day = currentDay.value;
        const name = day[type];
        const id = day[`${type}Id`];
        if (!name || name.includes('_______')) return;

        const blocklist = ['機上', '自理', '外送', '泡麵', '超商', '機場'];
        if (!id && blocklist.some((keyword) => name.includes(keyword))) return;

        if (id) {
          focusEvent(id);
          return;
        }
        mapService.openMap(name);
      };

      const openNotebook = () => {
        showNotebook.value = true;
        nextTick(() => {
          if (noteTextarea.value) noteTextarea.value.focus();
        });
      };

      const closeNotebook = () => {
        showNotebook.value = false;
        nextTick(() => {
          if (openNoteBtn.value) openNoteBtn.value.focus();
        });
      };

      const trapFocus = (event) => {
        if (!showNotebook.value) return;
        const focusable = [noteTextarea.value, closeNoteBtn.value].filter(Boolean);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            event.preventDefault();
          }
        } else if (document.activeElement === last) {
          first.focus();
          event.preventDefault();
        }
      };

      const handleGlobalKeydown = (event) => {
        if (event.key !== 'Escape') return;
        if (showNotebook.value) closeNotebook();
        else if (showSync.value) showSync.value = false;
        else if (showRates.value) showRates.value = false;
      };

      const handleItineraryTouchEnd = (event) => {
        if (window.innerWidth >= 768) return;
        const target = event.target;
        if (!(target instanceof Element)) return;
        if (target.closest('#map')) return;
        if (target.closest('input, textarea, select, option, button[label], [contenteditable="true"]')) return;

        const now = Date.now();
        if (now - lastItineraryTapAt < 320) {
          event.preventDefault();
        }
        lastItineraryTapAt = now;
      };

      const resetMap = () => {
        mapService.resetMap(clearActiveEvent);
      };

      const retryMap = () => {
        mapService.retryMap(setMapError);
      };

      const validateSchedule = () => {
        schedule.value.forEach((day) => {
          ['lunch', 'tea', 'dinner'].forEach((type) => {
            const idKey = `${type}Id`;
            const eventId = day[idKey];
            if (!eventId) return;
            const event = day.events.find((item) => item.id === eventId);
            if (!event || !['food', 'shopping', 'activity'].includes(event.category)) {
              day[idKey] = null;
            }
          });
        });
      };

      watch(countrySetting, () => {
        if (isHydrating) return;
        persistTrip();
      });

      onMounted(() => {
        try {
          validateSchedule();
          isHydrating = false;
          if (!savedTripData.schedule || !savedTripData.meta.title) {
            persistTrip();
          }
          handleKrwInput();
          refreshRateData();
          nextTick(() => {
            if (document.getElementById('map')) {
              mapService.initMap(setMapError);
            }
          });
          window.addEventListener('keydown', handleGlobalKeydown);
          const itineraryPanel = document.getElementById('itinerary-panel');
          if (itineraryPanel) {
            itineraryPanel.addEventListener('touchend', handleItineraryTouchEnd, { passive: false });
          }

          if ('serviceWorker' in navigator) {
            const hostname = window.location.hostname;
            const isLocalPreview = hostname === 'localhost'
              || hostname === '127.0.0.1'
              || /^192\.168\./.test(hostname)
              || /^10\./.test(hostname)
              || /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);

            if (isLocalPreview) {
              navigator.serviceWorker.getRegistrations()
                .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
                .then(() => {
                  if (!('caches' in window)) return;
                  return caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
                })
                .catch((error) => {
                  console.warn('Local service worker cleanup failed', error);
                });
            } else {
              navigator.serviceWorker.register('./sw.js').catch((error) => {
                console.warn('Service worker registration failed', error);
              });
            }
          }
        } catch (error) {
          isHydrating = false;
          console.error('App mount failed:', error);
        }
      });

      onUnmounted(() => {
        persistTrip.flush?.();
        clearTimeout(saveStatusTimer);
        clearTimeout(rateErrorTimer);
        mapService.destroy();
        window.removeEventListener('keydown', handleGlobalKeydown);
        const itineraryPanel = document.getElementById('itinerary-panel');
        if (itineraryPanel) {
          itineraryPanel.removeEventListener('touchend', handleItineraryTouchEnd);
        }
      });

      return {
        schedule,
        currentDay,
        currentDayIndex,
        activeEventId,
        showNotebook,
        showSync,
        showRates,
        userNotes,
        saveStatus,
        displayEvents,
        mapError,
        timelineContainerRef,
        dayRefs,
        mapLegendItems,
        openNoteBtn,
        noteTextarea,
        closeNoteBtn,
        currentTripTitle,
        currentTripDisplayName,
        activeTripId,
        countrySetting,
        ratesLoading,
        rateError,
        krwInput,
        twdInput,
        lastRateInput,
        rateDirectionLabel,
        displayKrwRate,
        displayUsdRate,
        rateHintText,
        rateUpdatedLabel,
        selectDay,
        focusEvent,
        openNotebook,
        closeNotebook,
        saveNotes: persistTrip,
        resetMap,
        retryMap,
        copyText,
        getDotColor,
        getCategoryBadge,
        getTagStyle,
        extractCrowdBadge,
        cleanDayTitle,
        formatNote,
        formatDayNotice,
        trapFocus,
        openMealMap,
        handleKrwInput,
        handleTwdInput,
        toggleRateDirection,
        refreshRates: refreshRateData
      };
    }
  });

  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    document.documentElement.classList.add('standalone-mode');
    document.body.classList.add('standalone-mode');
  }

  if (DEBUG_ENABLED) {
    app.config.errorHandler = (error) => {
      console.error('[Vue error]', error);
      showDebugOverlay(error);
    };
  }

  app.mount('#app');
})(window);
