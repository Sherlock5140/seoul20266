(function attachSeoul2026Map(global) {
  const createMapService = ({
    categoryConfig,
    countrySettingRef,
    escapeHtml,
    focusEvent,
    getDisplayEvents,
    getSchedule
  }) => {
    let map = null;
    let markersMap = new Map();
    let resizeObserver = null;
    let resizeRaf = 0;
    let retryCount = 0;
    let tileErrorTimestamps = [];

    const getVisibleMarkers = () => Array.from(markersMap.values()).filter((marker) => map && map.hasLayer(marker));

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

      getSchedule().forEach((day) => {
        day.events.forEach((event) => {
          if (!event.coords || markersMap.has(event.id)) return;

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
          marker.bindPopup(`
            <div class="font-sans p-1 min-w-[120px]">
              <div class="text-[9px] uppercase font-bold text-gray-400 mb-1 tracking-widest">${escapeHtml(event.category)}</div>
              <div class="font-bold text-sm leading-tight text-[#2F2F2D]">${escapeHtml(event.location)}</div>
            </div>
          `, { closeButton: false, className: 'rounded-xl shadow-lg border-none', offset: [0, -5] });
          marker.on('click', () => focusEvent(event.id));
          markersMap.set(event.id, marker);
        });
      });
    };

    const renderMarkers = () => {
      if (!map) return;

      ensureMarkers();
      const visibleIds = new Set(
        getDisplayEvents()
          .filter((event) => event.coords)
          .map((event) => event.id)
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
        map = L.map('map', { zoomControl: false, zoomAnimation: true, fadeAnimation: true }).setView([37.5665, 126.9780], 13);
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
        markersMap.clear();
      }
      requestAnimationFrame(() => initMap(setMapError));
    };

    const highlightEvent = (eventId, event) => {
      if (!map) return;
      markersMap.forEach((marker, markerId) => {
        const icon = marker.getElement();
        if (!icon) return;
        if (event && event.coords && markerId === eventId) {
          icon.classList.add('active');
          marker.openPopup();
        } else {
          icon.classList.remove('active');
          marker.closePopup();
        }
      });
      if (event?.coords) {
        map.flyTo(event.coords, 16, { animate: true, duration: 1.2, easeLinearity: 0.25 });
      }
    };

    const resetMap = (clearActiveEvent) => {
      if (!map) return;

      if (getVisibleMarkers().length > 0) {
        fitBounds();
      } else {
        map.flyTo([37.5665, 126.9780], 13, { animate: true, duration: 1 });
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

      if (countrySettingRef.value === 'KR') {
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
      const url = countrySettingRef.value === 'KR'
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
