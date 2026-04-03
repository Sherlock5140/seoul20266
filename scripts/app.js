(async function bootSeoul2026App(global) {
  const { createApp, ref, computed, onMounted, onUnmounted, nextTick, watch } = Vue;
  const { APP_NAME, DEBUG_ENABLED, APP_VERSION, CATEGORY_CONFIG, COUNTRY_CONFIG, COUNTRY_CODE_ALIASES, DOUBLE_TAP_THRESHOLD_MS, IS_LOCAL_PREVIEW, REGEX_NEWLINE, REGEX_KEYWORDS } = global.Seoul2026Config;
  const { clone, copyText, debounce, decodeBase64Url, encodeBase64Url, escapeHtml, compressToBase64Url, decompressFromBase64Url } = global.Seoul2026Utils;
  const {
    createTripState,
    deleteTripState,
    getActiveTripId,
    listTrips,
    loadTripState,
    saveTripState,
    setActiveTripId
  } = global.Seoul2026Storage;
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
    console.info(`[${APP_NAME}] debug enabled (${APP_VERSION})`);
    window.addEventListener('error', (event) => {
      showDebugOverlay(event.error || event.message);
    });
    window.addEventListener('unhandledrejection', (event) => {
      showDebugOverlay(event.reason || 'Unhandled promise rejection');
    });
  } else {
    window.addEventListener('unhandledrejection', (event) => {
      console.warn(`[${APP_NAME}] unhandled rejection`, event.reason);
    });
  }

  const normalizeCountryCode = (countryCode) => {
    const normalized = String(countryCode || '').trim().toUpperCase();
    if (normalized && COUNTRY_CODE_ALIASES[normalized]) return COUNTRY_CODE_ALIASES[normalized];
    return normalized || 'KR';
  };

  const getTripTemplate = (tripId) => tripCatalog.trips[tripId] || tripCatalog.trips[tripCatalog.defaultTripId];
  const urlParams = new URLSearchParams(window.location.search);
  const readShareSnapshot = async () => {
    const match = String(window.location.hash || '').match(/(?:^#|&)share=([^&]+)/);
    if (!match?.[1]) return null;

    try {
      const decoded = await decompressFromBase64Url(match[1]);
      const parsed = JSON.parse(decoded);
      if (!parsed?.tripId || !Array.isArray(parsed?.schedule)) return null;
      if (!parsed.meta || typeof parsed.meta !== 'object') {
        parsed.meta = { title: parsed.tripId, country: 'KR', schemaVersion: 1 };
      }
      parsed.meta.country = normalizeCountryCode(parsed.meta.country);
      return parsed;
    } catch (error) {
      console.warn('Share snapshot decode failed', error);
      return null;
    }
  };

  const sharedTripSnapshot = await readShareSnapshot();
  const sharedTripId = String(sharedTripSnapshot?.tripId || '').trim().toUpperCase();
  const requestedTripId = String(urlParams.get('trip') || '').trim().toUpperCase();
  const requestedShareDaysRaw = String(urlParams.get('days') || '').trim();
  const RATE_REFRESH_MAX_AGE_MS = 1000 * 60 * 60 * 6;
  const SHARE_VIEW_ENABLED = urlParams.get('view') === 'share'
    || urlParams.get('readonly') === '1'
    || urlParams.get('share') === '1';
  const createBlankSchedule = () => ([{
    date: '',
    title: 'New Trip',
    lunch: '_______',
    lunchId: null,
    tea: '_______',
    teaId: null,
    dinner: '_______',
    dinnerId: null,
    events: []
  }]);
  const getCountryMeta = (countryCode) => COUNTRY_CONFIG[normalizeCountryCode(countryCode)] || COUNTRY_CONFIG.KR;
  const getLocalCurrencyDefaultAmount = (countryCode) => getCountryMeta(countryCode).defaultAmount || '100';
  const scheduleBackgroundTask = (callback, timeout = 450) => {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => callback(), { timeout });
      return;
    }
    window.setTimeout(callback, 0);
  };
  const resolveTripId = (candidateTripId) => {
    const candidate = String(candidateTripId || '').trim().toUpperCase();
    if (!candidate) return tripCatalog.defaultTripId;
    if (tripCatalog.trips[candidate]) return candidate;

    const saved = loadTripState(candidate);
    const hasSavedState = Boolean(
      saved?.notes
      || Array.isArray(saved?.schedule)
      || saved?.meta?.title
    );
    return hasSavedState ? candidate : tripCatalog.defaultTripId;
  };
  const parseDayIndexesParam = (rawValue) => {
    if (!rawValue) return [];
    return Array.from(new Set(
      String(rawValue)
        .split(',')
        .map((value) => Number.parseInt(value.trim(), 10))
        .filter((value) => Number.isInteger(value) && value > 0)
        .map((value) => value - 1)
    )).sort((a, b) => a - b);
  };
  const normalizeDayIndexes = (dayIndexes, totalDays) => (
    Array.from(new Set(
      (Array.isArray(dayIndexes) ? dayIndexes : [])
        .filter((value) => Number.isInteger(value) && value >= 0 && value < totalDays)
    )).sort((a, b) => a - b)
  );
  const schedulesMatch = (left, right) => JSON.stringify(left || []) === JSON.stringify(right || []);
  const shouldRestoreTemplateMeta = (tripId, state, templateTrip) => {
    if (!tripCatalog.trips[tripId] || !templateTrip) return false;
    const normalizedSavedCountry = normalizeCountryCode(state?.meta?.country || '');
    const normalizedTemplateCountry = normalizeCountryCode(templateTrip?.meta?.country || 'KR');
    if (!normalizedSavedCountry || normalizedSavedCountry === normalizedTemplateCountry) return false;
    const normalizedSavedTitle = String(state?.meta?.title || '').trim();
    const normalizedTemplateTitle = String(templateTrip?.meta?.title || tripId).trim();
    const titleMatchesTemplate = !normalizedSavedTitle || normalizedSavedTitle === normalizedTemplateTitle;
    const notesEmpty = !String(state?.notes || '').trim();
    const scheduleMatchesTemplate = !Array.isArray(state?.schedule)
      || schedulesMatch(stripScheduleShareMeta(state.schedule), templateTrip?.schedule || []);
    return titleMatchesTemplate && notesEmpty && scheduleMatchesTemplate;
  };
  const normalizeCatalogTripState = (tripId, state = {}) => {
    const templateTrip = getTripTemplate(tripId);
    if (!shouldRestoreTemplateMeta(tripId, state, templateTrip)) return state;
    return {
      ...state,
      meta: {
        ...state.meta,
        title: templateTrip?.meta?.title || tripId,
        country: normalizeCountryCode(templateTrip?.meta?.country || 'KR'),
        schemaVersion: state?.meta?.schemaVersion || 1
      }
    };
  };
  const normalizeTripSummary = (summary) => {
    const tripId = String(summary?.tripId || '').trim().toUpperCase();
    const templateTrip = tripCatalog.trips[tripId];
    if (!templateTrip) return summary;
    const fullState = loadTripState(tripId);
    if (!shouldRestoreTemplateMeta(tripId, fullState, templateTrip)) return summary;
    return {
      ...summary,
      title: String(templateTrip?.meta?.title || tripId).trim(),
      country: normalizeCountryCode(templateTrip?.meta?.country || 'KR')
    };
  };
  const cloneScheduleForView = (sourceSchedule = [], dayIndexes = []) => {
    const safeSchedule = Array.isArray(sourceSchedule) ? sourceSchedule : [];
    const normalizedIndexes = normalizeDayIndexes(dayIndexes, safeSchedule.length);
    const targetIndexes = normalizedIndexes.length ? normalizedIndexes : safeSchedule.map((_, index) => index);
    return targetIndexes.map((index) => ({
      ...clone(safeSchedule[index]),
      shareDayNumber: index + 1
    }));
  };
  const stripScheduleShareMeta = (sourceSchedule = []) => (
    clone(sourceSchedule).map((day) => {
      if (!day || typeof day !== 'object') return day;
      const { shareDayNumber, ...rest } = day;
      return rest;
    })
  );
  const formatDaySelectionParam = (dayIndexes = []) => (
    dayIndexes.map((index) => index + 1).join(',')
  );
  const requestedShareDayIndexes = parseDayIndexesParam(requestedShareDaysRaw);

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
      const shareLoading = ref(false);
      const shareCopied = ref(false);
      const shareLinkValue = ref('');
      const shareStatusLabel = ref('');
      const shareSelectedDays = ref([]);
      const copiedEventId = ref(null);
      const { rateDirection: initialRateDirection, exchangeRates: initialExchangeRates, rateUpdatedAt: initialRateUpdatedAt } = getStoredRateState();
      const rateDirection = ref(initialRateDirection);
      const exchangeRates = ref(initialExchangeRates);
      const rateUpdatedAt = ref(initialRateUpdatedAt);
      const localCurrencyInput = ref('');
      const twdInput = ref('');
      const lastRateInput = ref('local');

      const initialTripId = sharedTripId || resolveTripId(requestedTripId || getActiveTripId(tripCatalog.defaultTripId));
      const activeTripId = ref(initialTripId);
      const template = getTripTemplate(activeTripId.value);
      const savedTripData = sharedTripSnapshot || normalizeCatalogTripState(activeTripId.value, loadTripState(activeTripId.value));
      const isShareMode = ref(Boolean(SHARE_VIEW_ENABLED && (requestedTripId || sharedTripSnapshot?.tripId)));
      const isReadOnlyMode = computed(() => isShareMode.value);

      const currentTripTitle = ref(savedTripData.meta.title || template.meta.title);
      const countrySetting = ref(savedTripData.meta.country || template.meta.country);
      localCurrencyInput.value = getLocalCurrencyDefaultAmount(countrySetting.value);
      const schedule = ref(cloneScheduleForView(savedTripData.schedule || template.schedule, (isShareMode.value && !sharedTripSnapshot) ? requestedShareDayIndexes : []));
      const userNotes = ref(savedTripData.notes || '');
      const tripSummaries = ref(listTrips(tripCatalog.trips).map(normalizeTripSummary));
      const tripManagerNotice = ref({ tone: '', text: '' });
      const showCreateTripForm = ref(false);
      const newTripTitle = ref('');
      const newTripYear = ref(String((activeTripId.value.match(/(20\d{2})$/) || [])[1] || new Date().getFullYear()));
      const newTripCountry = ref(countrySetting.value || 'KR');
      const newTripStarter = ref('clone_current');
      const renamingTripId = ref('');
      const renameTitle = ref('');
      const currentTripDisplayName = computed(() => {
        const titleSource = String(currentTripTitle.value || '').replace(/\s*travel guide\s*$/i, '').trim();
        if (titleSource) return titleSource.toUpperCase();
        return String(activeTripId.value || 'SEOUL').replace(/_(20\d{2})$/, '').replace(/_/g, ' ');
      });
      const modeLabel = computed(() => (isShareMode.value ? '分享檢視' : '管理模式'));
      const currentTripYear = computed(() => {
        const match = String(activeTripId.value || '').match(/(20\d{2})$/);
        return match ? match[1] : String(new Date().getFullYear());
      });
      const activeTripSummary = computed(() => (
        tripSummaries.value.find((trip) => trip.tripId === activeTripId.value)
        || (isShareMode.value ? {
          tripId: activeTripId.value,
          title: currentTripTitle.value || activeTripId.value,
          country: countrySetting.value || 'KR',
          updatedAt: '',
          source: 'share'
        } : null)
      ));
      const shareDayOptions = computed(() => (
        schedule.value.map((day, index) => ({
          index,
          label: `Day ${day.shareDayNumber || index + 1}`,
          date: String(day.date || '').trim()
        }))
      ));
      const normalizedSelectedShareDays = computed(() => normalizeDayIndexes(shareSelectedDays.value, schedule.value.length));
      const hasShareDaySelection = computed(() => normalizedSelectedShareDays.value.length > 0);
      const hasPartialShareSelection = computed(() => (
        hasShareDaySelection.value
        && normalizedSelectedShareDays.value.length < schedule.value.length
      ));
      const shareSelectionSummary = computed(() => {
        if (!hasShareDaySelection.value) return '尚未選擇日期';
        return normalizedSelectedShareDays.value
          .map((index) => shareDayOptions.value[index]?.label)
          .filter(Boolean)
          .join('、');
      });
      const shareSelectionStateLabel = computed(() => {
        if (!hasShareDaySelection.value) return '尚未選擇日期';
        if (!hasPartialShareSelection.value) {
          return `目前已選全部 ${schedule.value.length} 天，等同分享整個行程`;
        }
        return `目前選擇：${shareSelectionSummary.value}`;
      });
      const shareDayGridCols = computed(() => {
        const totalDays = shareDayOptions.value.length;
        return (totalDays > 0 && totalDays <= 3) ? String(totalDays) : null;
      });
      const shareModeDaySummary = computed(() => {
        if (!isShareMode.value) return '';
        const fullLength = (getTripTemplate(activeTripId.value)?.schedule || []).length;
        if (!schedule.value.length || schedule.value.length === fullLength) return '';
        return schedule.value
          .map((day, index) => `Day ${day.shareDayNumber || index + 1}`)
          .join('、');
      });
      const visibleTripSummaries = computed(() => (
        isShareMode.value
          ? (activeTripSummary.value ? [activeTripSummary.value] : [])
          : tripSummaries.value
      ));

      const timelineContainerRef = ref(null);
      const dayRefs = ref({});
      const openNoteBtn = ref(null);
      const noteTextarea = ref(null);
      const closeNoteBtn = ref(null);

      let isHydrating = true;
      let isApplyingTripState = false;
      let saveStatusTimer = null;
      let rateErrorTimer = null;
      let tripNoticeTimer = null;
      let shareCopiedTimer = null;
      let lastItineraryTapAt = 0;
      const shareLinkCache = new Map();
      const shareLinkPending = new Map();

      const currentDay = computed(() => schedule.value[currentDayIndex.value] || { date: '', title: '', events: [] });
      const displayEvents = computed(() => currentDay.value.events || []);
      const countryMeta = computed(() => getCountryMeta(countrySetting.value));
      const primaryCurrencyCode = computed(() => countryMeta.value.currency);
      const primaryCountryLabel = computed(() => countryMeta.value.label);
      const primaryRatePrecision = computed(() => countryMeta.value.ratePrecision || 3);
      const primaryRate = computed(() => exchangeRates.value[primaryCurrencyCode.value] || 0);
      const rateDirectionLabel = computed(() => (
        rateDirection.value === 'local_to_twd'
          ? `${primaryCurrencyCode.value} → TWD`
          : `TWD → ${primaryCurrencyCode.value}`
      ));
      const displayPrimaryRate = computed(() => {
        const rate = primaryRate.value || 0;
        if (!rate) return '--';
        return rateDirection.value === 'local_to_twd' ? rate.toFixed(primaryRatePrecision.value) : (1 / rate).toFixed(2);
      });
      const displayUsdRate = computed(() => {
        const rate = exchangeRates.value.USD || 0;
        return rate ? rate.toFixed(2) : '--';
      });
      const rateHintText = computed(() => {
        const rate = primaryRate.value || 0;
        if (!rate) return '匯率資料尚未更新';
        return rateDirection.value === 'local_to_twd'
          ? `1 ${primaryCurrencyCode.value} ≈ ${rate.toFixed(primaryRatePrecision.value)} TWD`
          : `1 TWD ≈ ${(1 / rate).toFixed(2)} ${primaryCurrencyCode.value}`;
      });
      const cashRateSource = computed(() => {
        if (primaryCurrencyCode.value === 'KRW') {
          return {
            badge: 'Cash Rate',
            title: '韓國當地現鈔匯率',
            sourceLabel: 'Creatrip',
            url: 'https://creatrip.com/exchange'
          };
        }
        return null;
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
      const tripNoticeClass = computed(() => {
        if (tripManagerNotice.value.tone === 'success') return 'text-s-green bg-s-green/10';
        if (tripManagerNotice.value.tone === 'error') return 'text-s-alert bg-s-alert/10';
        return 'text-m-sub bg-black/5';
      });
      const countryOptions = computed(() => (
        Object.entries(COUNTRY_CONFIG).map(([code, meta]) => ({
          code,
          label: meta.optionLabel || meta.label
        }))
      ));
      const shareModeLabel = computed(() => isShareMode.value ? 'Scoped trip view' : '');
      const persistTrip = debounce(() => {
        if (isReadOnlyMode.value) return;
        saveStatus.value = 'Saving...';
        try {
          const didPersist = saveTripState({
            tripId: activeTripId.value,
            notes: userNotes.value,
            schedule: stripScheduleShareMeta(schedule.value),
            meta: {
              title: currentTripTitle.value,
              country: countrySetting.value
            }
          });
          if (!didPersist) throw new Error('Trip state persistence failed');
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

      const refreshTripSummaries = () => {
        tripSummaries.value = listTrips(tripCatalog.trips).map(normalizeTripSummary);
      };

      const setTripNotice = (tone, text) => {
        tripManagerNotice.value = { tone, text };
        clearTimeout(tripNoticeTimer);
        tripNoticeTimer = setTimeout(() => {
          if (tripManagerNotice.value.text === text) {
            tripManagerNotice.value = { tone: '', text: '' };
          }
        }, 2600);
      };

      const formatTripUpdatedAt = (updatedAt) => {
        if (!updatedAt) return 'Template';
        const parsedDate = new Date(updatedAt);
        if (Number.isNaN(parsedDate.getTime())) return updatedAt;
        return parsedDate.toLocaleString('zh-TW', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      };

      const resetShareFeedback = () => {
        shareCopied.value = false;
        shareStatusLabel.value = '';
        clearTimeout(shareCopiedTimer);
      };
      const resetShareDaySelection = () => {
        shareSelectedDays.value = schedule.value.map((_, index) => index);
      };

      const invalidateShareLink = (tripId = activeTripId.value) => {
        const prefix = `${tripId}::`;
        if (tripId) {
          Array.from(shareLinkCache.keys()).forEach((key) => {
            if (key.startsWith(prefix)) shareLinkCache.delete(key);
          });
          Array.from(shareLinkPending.keys()).forEach((key) => {
            if (key.startsWith(prefix)) shareLinkPending.delete(key);
          });
        } else {
          shareLinkCache.clear();
          shareLinkPending.clear();
        }
        shareLinkValue.value = '';
        resetShareFeedback();
      };

      const waitForUiPaint = async () => {
        await nextTick();
        await new Promise((resolve) => {
          if (typeof window.requestAnimationFrame === 'function') {
            window.requestAnimationFrame(() => resolve());
            return;
          }
          window.setTimeout(resolve, 0);
        });
      };

      const getShareCacheKey = (tripId, dayIndexes = []) => `${tripId}::${formatDaySelectionParam(dayIndexes) || 'all'}`;

      const canUseDirectTripShare = (tripId, state, templateTrip) => {
        if (!tripCatalog.trips[tripId]) return false;
        const normalizedTitle = String(state?.meta?.title || '').trim();
        const normalizedCountry = normalizeCountryCode(state?.meta?.country || '');
        const templateTitle = String(templateTrip?.meta?.title || tripId).trim();
        const templateCountry = normalizeCountryCode(templateTrip?.meta?.country || 'KR');
        const titleMatches = !normalizedTitle || normalizedTitle === templateTitle;
        const countryMatches = !normalizedCountry || normalizedCountry === templateCountry;
        const scheduleMatches = !state?.schedule || schedulesMatch(stripScheduleShareMeta(state.schedule), templateTrip?.schedule || []);
        return titleMatches && countryMatches && scheduleMatches;
      };

      const buildShareUrl = async (tripId, { useCache = true, dayIndexes = [] } = {}) => {
        const shareKey = getShareCacheKey(tripId, dayIndexes);
        if (useCache && shareLinkCache.has(shareKey)) {
          return shareLinkCache.get(shareKey);
        }
        if (shareLinkPending.has(shareKey)) {
          return shareLinkPending.get(shareKey);
        }
        const pending = (async () => {
          const url = new URL(window.location.origin + window.location.pathname);
          const sourceTemplate = getTripTemplate(tripId);
          const sourceState = tripId === activeTripId.value
            ? {
                tripId,
                schedule: stripScheduleShareMeta(schedule.value),
                meta: {
                  title: currentTripTitle.value,
                  country: countrySetting.value
                }
              }
            : normalizeCatalogTripState(tripId, loadTripState(tripId));
          const sourceSchedule = sourceState.schedule || sourceTemplate.schedule || createBlankSchedule();
          const filteredDayIndexes = normalizeDayIndexes(dayIndexes, sourceSchedule.length);
          if (canUseDirectTripShare(tripId, sourceState, sourceTemplate)) {
            url.searchParams.set('trip', tripId);
            url.searchParams.set('view', 'share');
            url.searchParams.set('readonly', '1');
            if (filteredDayIndexes.length && filteredDayIndexes.length < sourceSchedule.length) {
              url.searchParams.set('days', formatDaySelectionParam(filteredDayIndexes));
            } else {
              url.searchParams.delete('days');
            }
            url.hash = '';
            const directUrl = url.toString();
            shareLinkCache.set(shareKey, directUrl);
            return directUrl;
          }
          const sharePayload = {
            tripId,
            schedule: cloneScheduleForView(sourceSchedule, filteredDayIndexes),
            meta: {
              title: sourceState.meta?.title || sourceTemplate.meta?.title || tripId,
              country: sourceState.meta?.country || sourceTemplate.meta?.country || 'KR',
              schemaVersion: sourceState.meta?.schemaVersion || 1
            }
          };

          url.searchParams.set('trip', tripId);
          url.searchParams.set('view', 'share');
          url.searchParams.set('readonly', '1');
          if (filteredDayIndexes.length && filteredDayIndexes.length < sourceSchedule.length) {
            url.searchParams.set('days', formatDaySelectionParam(filteredDayIndexes));
          } else {
            url.searchParams.delete('days');
          }
          url.hash = `share=${await compressToBase64Url(sharePayload)}`;
          const nextUrl = url.toString();
          shareLinkCache.set(shareKey, nextUrl);
          return nextUrl;
        })();
        shareLinkPending.set(shareKey, pending);
        return pending.finally(() => {
          shareLinkPending.delete(shareKey);
        });
      };

      const warmShareLink = (tripId = activeTripId.value, dayIndexes = []) => {
        const shareKey = getShareCacheKey(tripId, dayIndexes);
        if (!tripId || shareLinkCache.has(shareKey)) return;
        scheduleBackgroundTask(() => {
          buildShareUrl(tripId, { useCache: false, dayIndexes }).catch((error) => {
            console.warn('Share link warmup failed', error);
          });
        }, 800);
      };

      const tryNativeShare = async (shareUrl) => {
        if (typeof navigator.share !== 'function') return false;
        try {
          await navigator.share({
            title: currentTripTitle.value || activeTripId.value,
            text: 'Travel Guide 行程分享',
            url: shareUrl
          });
          shareStatusLabel.value = '已開啟分享';
          setTripNotice('success', '已開啟分享選單');
          return true;
        } catch (error) {
          if (error?.name === 'AbortError') {
            setTripNotice('error', '已取消分享，可改用複製連結');
            return false;
          }
          console.warn('Native share failed', error);
          return false;
        }
      };

      const copyShareLink = async (tripId, {
        dayIndexes = [],
        preferNativeShare = true,
        successLabel = '已複製',
        successNotice = '已複製分享連結',
        manualCopyNotice = '連結已建立，請手動複製'
      } = {}) => {
        if (shareLoading.value) return;
        shareLoading.value = true;
        resetShareFeedback();
        const timeout = setTimeout(() => { shareLoading.value = false; }, 8000);
        try {
          await waitForUiPaint();
          const shareUrl = await buildShareUrl(tripId, { dayIndexes });
          shareLinkValue.value = shareUrl;
          const copied = await copyText(shareUrl);
          if (copied) {
            shareCopied.value = true;
            shareStatusLabel.value = successLabel;
            clearTimeout(shareCopiedTimer);
            shareCopiedTimer = setTimeout(() => {
              shareCopied.value = false;
              shareStatusLabel.value = '';
            }, 1800);
            setTripNotice('success', successNotice);
          }
          if (preferNativeShare) {
            const shared = await tryNativeShare(shareUrl);
            if (shared) return;
          }
          if (!copied) {
            shareStatusLabel.value = '可手動複製';
            setTripNotice('error', manualCopyNotice);
            return;
          }
        } catch (error) {
          console.warn('Share link build failed', error);
          setTripNotice('error', '分享連結產生失敗');
        } finally {
          clearTimeout(timeout);
          shareLoading.value = false;
        }
      };
      const toggleShareDay = (index) => {
        const selected = new Set(normalizedSelectedShareDays.value);
        if (selected.has(index)) selected.delete(index);
        else selected.add(index);
        shareSelectedDays.value = Array.from(selected).sort((a, b) => a - b);
      };
      const selectAllShareDays = () => {
        resetShareDaySelection();
      };
      const shareSelectedDayRange = async () => {
        if (!hasShareDaySelection.value) {
          setTripNotice('error', '請先選擇要分享的日期');
          return;
        }
        await copyShareLink(activeTripId.value, {
          dayIndexes: normalizedSelectedShareDays.value,
          preferNativeShare: false,
          successLabel: '已複製可貼上',
          successNotice: '已複製所選日期連結，可直接貼上分享',
          manualCopyNotice: '日期連結已建立，請手動複製'
        });
      };

      let copiedEventTimer = null;
      const copyEventLocation = async (location) => {
        const copied = await copyText(location);
        if (!copied) return;
        copiedEventId.value = location;
        clearTimeout(copiedEventTimer);
        copiedEventTimer = setTimeout(() => {
          copiedEventId.value = null;
        }, 1800);
      };

      const copyGeneratedShareLink = async () => {
        if (!shareLinkValue.value) return;
        const copied = await copyText(shareLinkValue.value);
        if (!copied) {
          shareStatusLabel.value = '可手動複製';
          setTripNotice('error', '請長按連結欄位手動複製');
          return;
        }
        shareCopied.value = true;
        shareStatusLabel.value = '已複製';
        clearTimeout(shareCopiedTimer);
        shareCopiedTimer = setTimeout(() => {
          shareCopied.value = false;
          shareStatusLabel.value = '';
        }, 1800);
        setTripNotice('success', '已複製分享連結');
      };

      const applyTripState = (tripId) => {
        if (isReadOnlyMode.value) return;
        isApplyingTripState = true;
        invalidateShareLink(tripId);
        const nextTemplate = getTripTemplate(tripId);
        const nextSaved = normalizeCatalogTripState(tripId, loadTripState(tripId));
        activeTripId.value = tripId;
        setActiveTripId(tripId);
        currentTripTitle.value = nextSaved.meta.title || nextTemplate.meta.title;
        countrySetting.value = nextSaved.meta.country || nextTemplate.meta.country;
        schedule.value = cloneScheduleForView(nextSaved.schedule || nextTemplate.schedule || createBlankSchedule());
        userNotes.value = nextSaved.notes || '';
        localCurrencyInput.value = getLocalCurrencyDefaultAmount(countrySetting.value);
        lastRateInput.value = 'local';
        handleLocalCurrencyInput();
        currentDayIndex.value = 0;
        activeEventId.value = null;
        resetShareDaySelection();
        validateSchedule();
        refreshTripSummaries();
        nextTick(() => {
          if (timelineContainerRef.value) timelineContainerRef.value.scrollTop = 0;
          mapService.clearMarkers();
          mapService.renderMarkers();
          resetMap();
          isApplyingTripState = false;
          warmShareLink(tripId);
        });
      };

      const slugifyTripName = (title) => String(title || '')
        .trim()
        .replace(/[\s\-]+/g, '_')
        .replace(/[^\p{L}\p{N}_]+/gu, '')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .toUpperCase();

      const buildTripId = (title, year) => {
        const slug = slugifyTripName(title);
        return slug && year ? `${slug}_${year}` : '';
      };

      const openCreateTripForm = () => {
        if (isReadOnlyMode.value) return;
        showCreateTripForm.value = true;
        newTripTitle.value = '';
        newTripYear.value = currentTripYear.value;
        newTripCountry.value = countrySetting.value || 'KR';
        newTripStarter.value = 'clone_current';
      };

      const cancelCreateTrip = () => {
        showCreateTripForm.value = false;
      };

      const switchTrip = (tripId) => {
        if (isReadOnlyMode.value) return;
        if (!tripId || tripId === activeTripId.value) return;
        persistTrip.flush?.();
        applyTripState(tripId);
        setTripNotice('success', '已切換行程');
      };

      const createTrip = () => {
        if (isReadOnlyMode.value) return;
        const title = newTripTitle.value.trim();
        const year = String(newTripYear.value || '').trim();
        const tripId = buildTripId(title, year);

        if (!title) {
          setTripNotice('error', '請先輸入行程名稱');
          return;
        }
        if (!/^\d{4}$/.test(year)) {
          setTripNotice('error', '年份請使用 4 位數');
          return;
        }
        if (!tripId) {
          setTripNotice('error', '行程代碼無法建立，請調整名稱');
          return;
        }
        if (tripSummaries.value.some((trip) => trip.tripId === tripId)) {
          setTripNotice('error', '此行程已存在，請更換名稱或年份');
          return;
        }

        persistTrip.flush?.();

        const starterSchedule = newTripStarter.value === 'blank'
          ? createBlankSchedule()
          : newTripStarter.value === 'seoul_template'
            ? clone(getTripTemplate(tripCatalog.defaultTripId).schedule || createBlankSchedule())
            : stripScheduleShareMeta(schedule.value);

        const created = createTripState({
          tripId,
          notes: '',
          schedule: starterSchedule,
          meta: {
            title,
            country: newTripCountry.value
          }
        });
        if (!created) {
          setTripNotice('error', '建立行程失敗，請確認儲存權限');
          return;
        }

        refreshTripSummaries();
        applyTripState(tripId);
        showCreateTripForm.value = false;
        setTripNotice('success', '已建立新行程');
      };

      const startRenameTrip = (trip) => {
        if (isReadOnlyMode.value) return;
        renamingTripId.value = trip.tripId;
        renameTitle.value = trip.title;
      };

      const cancelRenameTrip = () => {
        renamingTripId.value = '';
        renameTitle.value = '';
      };

      const saveTripRename = (tripId) => {
        if (isReadOnlyMode.value) return;
        const title = renameTitle.value.trim();
        if (!title) {
          setTripNotice('error', '行程名稱不可空白');
          return;
        }

        const existing = loadTripState(tripId);
        const templateTrip = getTripTemplate(tripId);
        const renamed = saveTripState({
          tripId,
          notes: existing.notes || '',
          schedule: clone(existing.schedule ?? templateTrip.schedule ?? createBlankSchedule()),
          meta: {
            title,
            country: existing.meta?.country || templateTrip.meta?.country || 'KR',
            schemaVersion: existing.meta?.schemaVersion || templateTrip.meta?.schemaVersion || 1
          }
        });
        if (!renamed) {
          setTripNotice('error', '更新名稱失敗，請確認儲存權限');
          return;
        }

        if (tripId === activeTripId.value) {
          currentTripTitle.value = title;
        }
        refreshTripSummaries();
        cancelRenameTrip();
        setTripNotice('success', '已更新行程名稱');
      };

      const isCatalogTrip = (tripId) => Boolean(tripCatalog.trips[tripId]);

      const deleteTrip = (trip) => {
        if (isReadOnlyMode.value) return;
        if (!trip || trip.tripId === tripCatalog.defaultTripId || isCatalogTrip(trip.tripId)) {
          setTripNotice('error', '預設行程不可刪除');
          return;
        }
        if (!window.confirm(`確定要刪除「${trip.title}」嗎？`)) return;

        const fallbackTrip = tripSummaries.value.find((item) => item.tripId !== trip.tripId);
        const deleted = deleteTripState(trip.tripId);
        if (!deleted) {
          setTripNotice('error', '刪除行程失敗，請確認儲存權限');
          return;
        }
        invalidateShareLink(trip.tripId);
        refreshTripSummaries();

        if (trip.tripId === activeTripId.value && fallbackTrip) {
          applyTripState(fallbackTrip.tripId);
        }

        setTripNotice('success', '已刪除行程');
      };

      const highlightCurrency = (text) => (
        text
          .replace(/((?:HKD|HK\$|TWD|KRW|JPY|THB|USD|US\$)\$?)\s*([0-9,]+(?:\.[0-9]+)?)/gi, '<span class="font-mono font-bold text-s-green">$1 $2</span>')
          .replace(/([0-9,]+(?:\.[0-9]+)?)\s*(韓元|港幣|台幣|日圓|日元|泰銖|美金|美元|元|KRW|HKD|TWD|JPY|THB|USD|HK\$|US\$)/gi, '<span class="font-mono font-bold text-s-green">$1 $2</span>')
      );

      const formatNote = (note) => {
        if (!note) return '';
        let processed = escapeHtml(note);
        processed = processed.replace(REGEX_NEWLINE, '<br>');
        processed = processed.replace(REGEX_KEYWORDS, '<span class="font-bold text-typo-title bg-yellow-100 px-1 rounded">$1</span>');
        processed = highlightCurrency(processed);
        processed = processed.replace(/\b([01]\d|2[0-3]):([0-5]\d)\b/g, '<span class="font-mono font-bold text-typo-title bg-gray-100 px-1 rounded">$&</span>');
        return processed;
      };

      const formatNoticeInline = (line) => {
        let processed = escapeHtml(line || '');
        processed = processed.replace(REGEX_KEYWORDS, '<span class="font-bold text-typo-title bg-yellow-100 px-1 rounded">$1</span>');
        processed = highlightCurrency(processed);
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

      const getDotColor = (category) => ({ backgroundColor: (CATEGORY_CONFIG[category] || CATEGORY_CONFIG.default).color });
      const getCategoryBadge = (category) => (CATEGORY_CONFIG[category] || CATEGORY_CONFIG.default).icon;
      const getCountryLabel = (countryCode) => getCountryMeta(countryCode).label;
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
        escapeHtml,
        focusEvent: (eventId) => focusEvent(eventId),
        getCountryConfig: () => getCountryMeta(countrySetting.value),
        getActiveTripId: () => activeTripId.value,
        getDisplayEvents: () => displayEvents.value,
        getSchedule: () => schedule.value
      });

      const handleLocalCurrencyInput = () => {
        const rate = primaryRate.value || 0;
        const value = Number(localCurrencyInput.value);
        if (!localCurrencyInput.value || !Number.isFinite(value) || !rate) {
          twdInput.value = '';
          return;
        }
        twdInput.value = formatConvertedValue(value * rate);
      };

      const handleTwdInput = () => {
        const rate = primaryRate.value || 0;
        const value = Number(twdInput.value);
        if (!twdInput.value || !Number.isFinite(value) || !rate) {
          localCurrencyInput.value = '';
          return;
        }
        localCurrencyInput.value = formatConvertedValue(value / rate);
      };

      const toggleRateDirection = () => {
        rateDirection.value = rateDirection.value === 'local_to_twd' ? 'twd_to_local' : 'local_to_twd';
        persistRateDirection(rateDirection.value);
      };

      const openRatesPanel = () => {
        showRates.value = true;
        lastRateInput.value = 'local';
        if (!localCurrencyInput.value) {
          localCurrencyInput.value = getLocalCurrencyDefaultAmount(countrySetting.value);
        }
        handleLocalCurrencyInput();
      };

      const openSettingsPanel = () => {
        showSync.value = true;
        renamingTripId.value = '';
        renameTitle.value = '';
        warmShareLink(activeTripId.value);
        if (isShareMode.value) return;
        showCreateTripForm.value = false;
      };

      const closeSettings = () => {
        showSync.value = false;
        renamingTripId.value = '';
        renameTitle.value = '';
      };

      const refreshRateData = async () => {
        ratesLoading.value = true;
        rateError.value = false;
        clearTimeout(rateErrorTimer);
        try {
          const nextRates = await refreshRates();
          exchangeRates.value = nextRates.currencyToTwd;
          rateUpdatedAt.value = nextRates.updatedAt;
          persistRates(exchangeRates.value, rateUpdatedAt.value);
          if (lastRateInput.value === 'twd') {
            handleTwdInput();
          } else {
            handleLocalCurrencyInput();
          }
        } catch (error) {
          console.warn('Rate refresh failed', error);
          rateError.value = true;
          rateErrorTimer = setTimeout(() => {
            rateError.value = false;
          }, 3000);
        } finally {
          ratesLoading.value = false;
        }
      };

      const shouldRefreshRatesOnLaunch = () => {
        if (!rateUpdatedAt.value) return true;
        const updatedAtMs = new Date(rateUpdatedAt.value).getTime();
        if (Number.isNaN(updatedAtMs)) return true;
        return Date.now() - updatedAtMs > RATE_REFRESH_MAX_AGE_MS;
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

      const openCashRateSource = () => {
        const url = cashRateSource.value?.url;
        if (!url) return;
        window.open(url, '_blank', 'noopener,noreferrer');
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
        if (focusable.length === 0) return;
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
        else if (activeEventId.value) resetMap();
      };

      const handleItineraryTouchEnd = (event) => {
        if (window.innerWidth >= 768) return;
        const target = event.target;
        if (!(target instanceof Element)) return;
        if (target.closest('#map')) return;
        if (target.closest('input, textarea, select, option, button[aria-label], [contenteditable="true"]')) return;

        const now = Date.now();
        if (now - lastItineraryTapAt < DOUBLE_TAP_THRESHOLD_MS) {
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
        if (isHydrating || isReadOnlyMode.value || isApplyingTripState) return;
        invalidateShareLink(activeTripId.value);
        if (!localCurrencyInput.value) {
          localCurrencyInput.value = getLocalCurrencyDefaultAmount(countrySetting.value);
        }
        persistTrip();
        warmShareLink(activeTripId.value);
      });

      watch(currentTripTitle, () => {
        if (isHydrating || isReadOnlyMode.value || isApplyingTripState) return;
        invalidateShareLink(activeTripId.value);
        warmShareLink(activeTripId.value);
      });

      watch(schedule, () => {
        if (isHydrating || isReadOnlyMode.value || isApplyingTripState) return;
        invalidateShareLink(activeTripId.value);
        resetShareDaySelection();
        warmShareLink(activeTripId.value);
      }, { deep: true });

      onMounted(() => {
        try {
          validateSchedule();
          isHydrating = false;
          if (!isReadOnlyMode.value && (!savedTripData.schedule || !savedTripData.meta.title)) {
            persistTrip();
          }
          refreshTripSummaries();
          handleLocalCurrencyInput();
          resetShareDaySelection();
          warmShareLink(activeTripId.value);
          if (shouldRefreshRatesOnLaunch()) {
            scheduleBackgroundTask(() => {
              refreshRateData();
            }, 1200);
          }
          nextTick(() => {
            scheduleBackgroundTask(() => {
              if (document.getElementById('map')) {
                mapService.initMap(setMapError);
              }
            }, 700);
          });
          window.addEventListener('keydown', handleGlobalKeydown);
          const itineraryPanel = document.getElementById('itinerary-panel');
          if (itineraryPanel) {
            itineraryPanel.addEventListener('touchend', handleItineraryTouchEnd, { passive: false });
          }

          if ('serviceWorker' in navigator && navigator.serviceWorker) {
            if (IS_LOCAL_PREVIEW) {
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
              navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' })
                .then((registration) => {
                  const requestUpdate = () => {
                    registration.update().catch((error) => {
                      console.warn('Service worker update check failed', error);
                    });
                  };

                  requestUpdate();

                  document.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'visible') requestUpdate();
                  });

                  if (navigator.serviceWorker.controller) {
                    navigator.serviceWorker.addEventListener('controllerchange', () => {
                      window.location.reload();
                    }, { once: true });
                  }
                })
                .catch((error) => {
                  console.warn('Service worker registration failed', error);
                });
            }
          }
        } catch (error) {
          isHydrating = false;
          console.error('App mount failed:', error);
        }
      });

      const formattedNotes = computed(() => {
        const result = {};
        displayEvents.value.forEach((e) => {
          if (e.note) result[e.id] = formatNote(e.note);
        });
        return result;
      });

      const formattedDayNotice = computed(() => formatDayNotice(currentDay.value.notice || ''));

      onUnmounted(() => {
        persistTrip.flush?.();
        clearTimeout(saveStatusTimer);
        clearTimeout(rateErrorTimer);
        clearTimeout(tripNoticeTimer);
        clearTimeout(shareCopiedTimer);
        clearTimeout(copiedEventTimer);
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
        modeLabel,
        currentTripYear,
        activeTripId,
        activeTripSummary,
        isShareMode,
        isReadOnlyMode,
        shareModeLabel,
        countrySetting,
        tripSummaries: visibleTripSummaries,
        tripManagerNotice,
        tripNoticeClass,
        countryOptions,
        formatTripUpdatedAt,
        buildShareUrl,
        copyShareLink,
        showCreateTripForm,
        newTripTitle,
        newTripYear,
        newTripCountry,
        newTripStarter,
        renamingTripId,
        renameTitle,
        openCreateTripForm,
        cancelCreateTrip,
        createTrip,
        switchTrip,
        startRenameTrip,
        cancelRenameTrip,
        saveTripRename,
        deleteTrip,
        ratesLoading,
        rateError,
        localCurrencyInput,
        twdInput,
        lastRateInput,
        rateDirectionLabel,
        displayPrimaryRate,
        displayUsdRate,
        rateHintText,
        cashRateSource,
        rateUpdatedLabel,
        primaryCurrencyCode,
        primaryCountryLabel,
        selectDay,
        focusEvent,
        openNotebook,
        closeNotebook,
        saveNotes: persistTrip,
        resetMap,
        retryMap,
        copyText,
        copyEventLocation,
        copiedEventId,
        shareLoading,
        shareCopied,
        shareLinkValue,
        shareStatusLabel,
        shareDayOptions,
        shareDayGridCols,
        shareSelectedDays,
        shareSelectionSummary,
        shareSelectionStateLabel,
        shareModeDaySummary,
        hasShareDaySelection,
        hasPartialShareSelection,
        toggleShareDay,
        selectAllShareDays,
        shareSelectedDayRange,
        copyGeneratedShareLink,
        closeSettings,
        getDotColor,
        getCategoryBadge,
        getCountryLabel,
        isCatalogTrip,
        getTagStyle,
        extractCrowdBadge,
        cleanDayTitle,
        formattedNotes,
        formattedDayNotice,
        trapFocus,
        openMealMap,
        handleLocalCurrencyInput,
        handleTwdInput,
        toggleRateDirection,
        openCashRateSource,
        openRatesPanel,
        openSettingsPanel,
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
})(window).catch((error) => {
  console.error('[Travel Guide] boot failed', error);
});
