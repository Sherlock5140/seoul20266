(function attachSeoul2026Config(global) {
  const hostname = window.location.hostname;
  const isLocalPreview = hostname === 'localhost'
    || hostname === '127.0.0.1'
    || /^192\.168\./.test(hostname)
    || /^10\./.test(hostname)
    || /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);

  global.Seoul2026Config = {
    APP_NAME: 'Travel Guide',
    IS_LOCAL_PREVIEW: isLocalPreview,
    DEBUG_ENABLED: isLocalPreview || new URLSearchParams(window.location.search).get('debug') === '1',
    APP_VERSION: '2026-04-02-hong-kong-share-fix',
    COUNTRY_CONFIG: {
      KR: { label: 'Korea', currency: 'KRW', center: [37.5665, 126.9780], zoom: 13 },
      GLOBAL: { label: 'Hong Kong', currency: 'HKD', center: [22.3193, 114.1694], zoom: 12 }
    },
    CATEGORY_CONFIG: {
      transport: { color: '#8FA39D', icon: 'bg-s-green', label: 'Transport', markerColor: '#8FA39D' },
      food: { color: '#D6C0B3', icon: 'bg-s-sand', label: 'Food', markerColor: '#D6C0B3' },
      shopping: { color: '#8E9AAF', icon: 'bg-s-blue', label: 'Shopping', markerColor: '#8E9AAF' },
      activity: { color: '#C8A7A1', icon: 'bg-s-pin', label: 'Activity', markerColor: '#C8A7A1' },
      hotel: { color: '#2F2F2D', icon: 'bg-typo-title', label: 'Hotel', markerColor: '#2F2F2D' },
      flight: { color: '#D6C0B3', icon: 'bg-s-sand', label: 'Flight', markerColor: '#D6C0B3' },
      alert: { color: '#B0726B', icon: 'bg-s-alert', label: 'Important', markerColor: '#B0726B' },
      default: { color: '#757573', icon: 'bg-m-sub', label: 'Other', markerColor: '#8E8E8C' }
    },
    DOUBLE_TAP_THRESHOLD_MS: 320,
    REGEX_NEWLINE: /\n/g,
    REGEX_KEYWORDS: /(死線|風險|關鍵動作|Plan A|Plan B|SOP)/g
  };
})(window);
