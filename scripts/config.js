(function attachTravelGuideConfig(global) {
  const hostname = window.location.hostname;
  const isLocalPreview = hostname === 'localhost'
    || hostname === '127.0.0.1'
    || /^192\.168\./.test(hostname)
    || /^10\./.test(hostname)
    || /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);

  const config = {
    APP_NAME: 'Travel Guide',
    IS_LOCAL_PREVIEW: isLocalPreview,
    DEBUG_ENABLED: isLocalPreview || new URLSearchParams(window.location.search).get('debug') === '1',
    APP_VERSION: '2026-04-02-multi-country-foundation',
    COUNTRY_CODE_ALIASES: {
      GLOBAL: 'HK'
    },
    COUNTRY_CONFIG: {
      KR: {
        label: 'Korea',
        currency: 'KRW',
        center: [37.5665, 126.9780],
        zoom: 13,
        mapProvider: 'naver',
        optionLabel: '韓國（NAVER Map / KRW）',
        defaultAmount: '10000',
        ratePrecision: 5
      },
      HK: {
        label: 'Hong Kong',
        currency: 'HKD',
        center: [22.3193, 114.1694],
        zoom: 12,
        mapProvider: 'google',
        optionLabel: '香港（Google Maps / HKD）',
        defaultAmount: '100',
        ratePrecision: 3
      },
      JP: {
        label: 'Japan',
        currency: 'JPY',
        center: [35.6762, 139.6503],
        zoom: 12,
        mapProvider: 'google',
        optionLabel: '日本（Google Maps / JPY）',
        defaultAmount: '1000',
        ratePrecision: 4
      },
      TH: {
        label: 'Thailand',
        currency: 'THB',
        center: [13.7563, 100.5018],
        zoom: 12,
        mapProvider: 'google',
        optionLabel: '泰國（Google Maps / THB）',
        defaultAmount: '100',
        ratePrecision: 3
      },
      INTL: {
        label: 'International',
        currency: 'USD',
        center: [20, 0],
        zoom: 2,
        mapProvider: 'google',
        optionLabel: '其他國家（Google Maps / USD）',
        defaultAmount: '10',
        ratePrecision: 3
      }
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
  global.TravelGuideConfig = config;
  global.Seoul2026Config = config;
})(window);
