(function attachSeoul2026Rates(global) {
  const RATE_KEYS = {
    direction: 'travelguide_rate_direction',
    krwToTwd: 'travelguide_krw_to_twd',
    usdToTwd: 'travelguide_usd_to_twd',
    updatedAt: 'travelguide_rate_updated_at'
  };

  const getStoredRateState = () => ({
    rateDirection: localStorage.getItem(RATE_KEYS.direction) || 'twd_to_krw',
    exchangeRates: {
      krwToTwd: Number(localStorage.getItem(RATE_KEYS.krwToTwd)) || 0.023,
      usdToTwd: Number(localStorage.getItem(RATE_KEYS.usdToTwd)) || 32.5
    },
    rateUpdatedAt: localStorage.getItem(RATE_KEYS.updatedAt) || ''
  });

  const persistRates = (exchangeRates, rateUpdatedAt) => {
    localStorage.setItem(RATE_KEYS.krwToTwd, String(exchangeRates.krwToTwd || ''));
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

  const refreshRates = async () => {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (!data?.rates?.TWD || !data?.rates?.KRW) {
      throw new Error('Invalid rate payload');
    }

    return {
      usdToTwd: Number(data.rates.TWD),
      krwToTwd: Number(data.rates.TWD) / Number(data.rates.KRW),
      updatedAt: new Date().toISOString()
    };
  };

  global.Seoul2026Rates = {
    formatConvertedValue,
    getStoredRateState,
    persistRateDirection,
    persistRates,
    refreshRates
  };
})(window);
