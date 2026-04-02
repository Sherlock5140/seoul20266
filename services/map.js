(function attachSeoul2026Map(global) {
  const createMapService = ({
    categoryConfig,
    escapeHtml,
    focusEvent,
    getCountryConfig,
    getActiveTripId,
    getDisplayEvents,
    getSchedule
  }) => {
    let map = null;
    let markersMap = new Map();
    let resizeObserver = null;
    let resizeRaf = 0;
    let retryCount = 0;
    let tileErrorTimestamps = [];
    const getMarkerKey = (eventId) => `${String(getActiveTripId?.() || 'TRIP')}::${String(eventId || '')}`;
    const getDefaultCenter = () => {
      const countryConfig = getCountryConfig?.() || {};
      return {
        coords: countryConfig.center || [37.5665, 126.9780],
        zoom: countryConfig.zoom || 13
      };
    };

    const getVisibleMarkers = () => Array.from(markersMap.values()).filter((marker) => map && map.hasLayer(marker));
    const isAirportEvent = (event) => /機場|airport/i.test(`${event?.location || ''} ${event?.note || ''}`);
    const getOverviewEvents = () => {
      const events = (getDisplayEvents?.() || []).filter((event) => event.coords);
      const nonAirportEvents = events.filter((event) => !isAirportEvent(event));
      return nonAirportEvents.length >= 2 ? nonAirportEvents : events;
    };
    const getHighlightOffset = () => {
      const isMobile = window.innerWidth < 768;
      return isMobile ? 220 : 130;
    };
    const getPopupPadding = () => {
      const isMobile = window.innerWidth < 768;
      return {
        topLeft: isMobile ? [20, 180] : [24, 112],
        bottomRight: isMobile ? [20, 24] : [24, 32]
      };
    };

    const fitBounds = () => {
      const visibleMarkers = getVisibleMarkers();
      if (!visibleMarkers.length || !map) return;

      if (visibleMarkers.length === 1) {
        map.setView(visibleMarkers[0].getLatLng(), 14, { animate: true });
        return;
      }

      const group = L.featureGroup(visibleMarkers);
      const isMobile = window.innerWidth < 768;
      const paddingBottom = isMobile ? 20 : 50;
      map.fitBounds(group.getBounds(), {
        paddingTopLeft: [50, 50],
        paddingBottomRight: [50, paddingBottom],
        maxZoom: 14,
        animate: true
      });
    };

    const ensureMarkers = () => {
      if (!map) return;

      const scheduleKeys = new Set();
      getSchedule().forEach((day) => {
        day.events.forEach((event) => {
          const markerKey = getMarkerKey(event.id);
          scheduleKeys.add(markerKey);
          if (!event.coords || markersMap.has(markerKey)) return;

          const config = categoryConfig[event.category] || categoryConfig.default;
          const iconHtml = `<div class="custom-marker-pin" style="background-color: ${config.markerColor};"><div class="marker-icon-inner"></div></div>`;
          const icon = L.divIcon({
            className: 'custom-marker',
            html: iconHtml,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -36]
          });

          const marker = L.marker(event.coords, { icon });
          marker.eventId = event.id;
          marker.tripScopedId = markerKey;
          const popupPadding = getPopupPadding();
          marker.bindPopup(`
            <div class="font-sans p-1 min-w-[120px]">
              <div class="text-[9px] uppercase font-bold text-gray-400 mb-1 tracking-widest">${escapeHtml(event.category)}</div>
              <div class="font-bold text-sm leading-tight text-[#2F2F2D]">${escapeHtml(event.location)}</div>
            </div>
          `, {
            closeButton: false,
            className: 'rounded-xl shadow-lg border-none',
            offset: [0, -5],
            autoPan: true,
            autoPanPaddingTopLeft: popupPadding.topLeft,
            autoPanPaddingBottomRight: popupPadding.bottomRight
          });
          marker.on('click', () => focusEvent(event.id));
          markersMap.set(markerKey, marker);
        });
      });

      markersMap.forEach((marker, markerKey) => {
        if (scheduleKeys.has(markerKey)) return;
        if (map.hasLayer(marker)) {
          marker.closePopup();
          map.removeLayer(marker);
        }
        markersMap.delete(markerKey);
      });
    };

    const renderMarkers = () => {
      if (!map) return;

      ensureMarkers();
      const visibleIds = new Set(
        getOverviewEvents()
          .map((event) => getMarkerKey(event.id))
      );

      markersMap.forEach((marker, markerId) => {
        const shouldBeVisible = visibleIds.has(markerId);
        const isVisible = map.hasLayer(marker);

        if (shouldBeVisible && !isVisible) {
          marker.addTo(map);
        } else if (!shouldBeVisible && isVisible) {
          marker.closePopup();
          map.removeLayer(marker);
        }
      });

      fitBounds();
    };

    const clearMarkers = () => {
      if (!map) {
        markersMap.clear();
        return;
      }

      markersMap.forEach((marker) => {
        if (map.hasLayer(marker)) {
          marker.closePopup();
          map.removeLayer(marker);
        }
      });
      markersMap.clear();
    };

    const initMap = (setMapError) => {
      if (typeof L === 'undefined') {
        if (retryCount < 20) {
          retryCount += 1;
          setTimeout(() => initMap(setMapError), 500);
        } else {
          setMapError(true);
        }
        return;
      }

      if (map) return;

      const mapDiv = document.getElementById('map');
      if (!mapDiv) {
        setTimeout(() => initMap(setMapError), 300);
        return;
      }

      try {
        const defaultView = getDefaultCenter();
        map = L.map('map', { zoomControl: false, zoomAnimation: true, fadeAnimation: true }).setView(defaultView.coords, defaultView.zoom);
        const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 20,
          subdomains: 'abcd'
        }).addTo(map);

        tileLayer.on('tileerror', () => {
          const now = Date.now();
          tileErrorTimestamps = tileErrorTimestamps.filter((timestamp) => now - timestamp < 15000);
          tileErrorTimestamps.push(now);
          if (tileErrorTimestamps.length >= 20) setMapError(true);
        });
        tileLayer.on('load', () => {
          tileErrorTimestamps = [];
        });

        ensureMarkers();
        renderMarkers();

        resizeObserver = new ResizeObserver(() => {
          if (resizeRaf) cancelAnimationFrame(resizeRaf);
          resizeRaf = requestAnimationFrame(() => {
            if (map) map.invalidateSize();
          });
        });
        resizeObserver.observe(mapDiv);
      } catch (error) {
        console.error('Map init error:', error);
        setMapError(true);
      }
    };

    const retryMap = (setMapError) => {
      setMapError(false);
      retryCount = 0;
      if (map) {
        map.remove();
        map = null;
      }
      markersMap.clear();
      requestAnimationFrame(() => initMap(setMapError));
    };

    const highlightEvent = (eventId, event) => {
      if (!map) return;
      const targetMarker = markersMap.get(getMarkerKey(eventId));
      if (targetMarker && !map.hasLayer(targetMarker)) {
        targetMarker.addTo(map);
      }
      markersMap.forEach((marker, markerId) => {
        const icon = marker.getElement();
        if (!icon) return;
        if (event && event.coords && markerId === getMarkerKey(eventId)) {
          icon.classList.add('active');
          marker.openPopup();
        } else {
          icon.classList.remove('active');
          marker.closePopup();
        }
      });
      if (event?.coords) {
        const targetZoom = Math.max(map.getZoom() || 0, 16);
        const targetPoint = map.project(event.coords, targetZoom).subtract([0, getHighlightOffset()]);
        const targetLatLng = map.unproject(targetPoint, targetZoom);
        map.flyTo(targetLatLng, targetZoom, { animate: true, duration: 1.2, easeLinearity: 0.25 });
      }
    };

    const resetMap = (clearActiveEvent) => {
      if (!map) return;

      if (getVisibleMarkers().length > 0) {
        fitBounds();
      } else {
        const defaultView = getDefaultCenter();
        map.flyTo(defaultView.coords, defaultView.zoom, { animate: true, duration: 1 });
      }

      markersMap.forEach((marker) => {
        const icon = marker.getElement();
        if (icon) icon.classList.remove('active');
        marker.closePopup();
      });

      clearActiveEvent();
    };

    const getCleanQuery = (rawLocation) => {
      if (!rawLocation) return '';

      let temp = rawLocation;
      if (temp.includes('➔')) temp = temp.split('➔').pop().trim();

      if ((getCountryConfig?.().currency || 'KRW') === 'KRW') {
        const hangulRegex = /[\uAC00-\uD7A3\u3131-\u314E\u314F-\u3163]+/g;
        const hangulMatches = temp.match(hangulRegex);
        if (hangulMatches?.length) return hangulMatches.join(' ');
      }

      temp = temp.replace(/^(交通|Transport|午餐|Lunch|晚餐|Dinner|午茶|Tea|住宿|Hotel)[：:]\s*/i, '');
      temp = temp.replace(/\s*\((計程車|Taxi|地鐵|Subway|公車|Bus|步行|Walk|機台|Kiosk|外帶|Takeout|Take-out|25分鐘|.*分鐘).*?\)/gi, '');
      temp = temp.replace(/[【】]/g, ' ');
      return temp.trim();
    };

    const openMap = (query) => {
      const clean = getCleanQuery(query);
      const url = (getCountryConfig?.().mapProvider || 'google') === 'naver'
        ? `https://map.naver.com/p/search/${encodeURIComponent(clean)}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clean)}`;

      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      if (isStandalone) {
        window.location.href = url;
        return;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    };

    const destroy = () => {
      if (map) {
        map.remove();
        map = null;
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
    };

    return {
      destroy,
      clearMarkers,
      highlightEvent,
      initMap,
      openMap,
      renderMarkers,
      resetMap,
      retryMap
    };
  };

  global.Seoul2026Map = { createMapService };
})(window);
