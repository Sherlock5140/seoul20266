(function attachSeoul2026Rates(global) {
  const RATE_KEYS = {
    direction: 'travelguide_rate_direction',
    krwToTwd: 'travelguide_krw_to_twd',
    hkdToTwd: 'travelguide_hkd_to_twd',
    usdToTwd: 'travelguide_usd_to_twd',
    updatedAt: 'travelguide_rate_updated_at'
  };

  const getStoredRateState = () => {
    const storedDirection = localStorage.getItem(RATE_KEYS.direction) || 'twd_to_local';
    const normalizedDirection = storedDirection === 'krw_to_twd'
      ? 'local_to_twd'
      : storedDirection === 'twd_to_krw'
        ? 'twd_to_local'
        : storedDirection;

    if (normalizedDirection && normalizedDirection !== storedDirection) {
      localStorage.setItem(RATE_KEYS.direction, normalizedDirection);
    }

    return {
      rateDirection: normalizedDirection || 'twd_to_local',
      exchangeRates: {
        krwToTwd: Number(localStorage.getItem(RATE_KEYS.krwToTwd)) || 0.023,
        hkdToTwd: Number(localStorage.getItem(RATE_KEYS.hkdToTwd)) || 4.16,
        usdToTwd: Number(localStorage.getItem(RATE_KEYS.usdToTwd)) || 32.5
      },
      rateUpdatedAt: localStorage.getItem(RATE_KEYS.updatedAt) || ''
    };
  };

  const persistRates = (exchangeRates, rateUpdatedAt) => {
    localStorage.setItem(RATE_KEYS.krwToTwd, String(exchangeRates.krwToTwd || ''));
    localStorage.setItem(RATE_KEYS.hkdToTwd, String(exchangeRates.hkdToTwd || ''));
    localStorage.setItem(RATE_KEYS.usdToTwd, String(exchangeRates.usdToTwd || ''));
    localStorage.setItem(RATE_KEYS.updatedAt, rateUpdatedAt || '');
  };

  const persistRateDirection = (direction) => {
    localStorage.setItem(RATE_KEYS.direction, direction);
  };

  const formatConvertedValue = (value) => {
    if (!Number.isFinite(value)) return '';
    if (Math.abs(value) >= 1000) return String(Math.round(value));
    return value.toFixed(2).replace(/\.?0+$/, '');
  };

  const fetchRatesOnce = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD', { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!data?.rates?.TWD || !data?.rates?.KRW || !data?.rates?.HKD) {
        throw new Error('Invalid rate payload');
      }
      return data;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const refreshRates = async () => {
    let lastError;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const data = await fetchRatesOnce();
        return {
          usdToTwd: Number(data.rates.TWD),
          krwToTwd: Number(data.rates.TWD) / Number(data.rates.KRW),
          hkdToTwd: Number(data.rates.TWD) / Number(data.rates.HKD),
          updatedAt: new Date().toISOString()
        };
      } catch (err) {
        lastError = err;
        if (attempt < 1) await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
    throw lastError;
  };

  global.Seoul2026Rates = {
    formatConvertedValue,
    getStoredRateState,
    persistRateDirection,
    persistRates,
    refreshRates
  };
})(window);
