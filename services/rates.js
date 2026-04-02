(function attachSeoul2026Rates(global) {
  const RATE_KEYS = {
    direction: 'travelguide_rate_direction',
    exchangeRates: 'travelguide_exchange_rates',
    krwToTwd: 'travelguide_krw_to_twd',
    hkdToTwd: 'travelguide_hkd_to_twd',
    usdToTwd: 'travelguide_usd_to_twd',
    updatedAt: 'travelguide_rate_updated_at'
  };

  const DEFAULT_RATES = {
    USD: 32.5,
    KRW: 0.023,
    HKD: 4.16,
    JPY: 0.22,
    THB: 0.96
  };

  const normalizeRates = (rates = {}) => ({
    ...DEFAULT_RATES,
    ...Object.fromEntries(
      Object.entries(rates || {})
        .map(([currency, value]) => [String(currency || '').toUpperCase(), Number(value)])
        .filter(([, value]) => Number.isFinite(value) && value > 0)
    )
  });

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

    const storedRates = (() => {
      try {
        return JSON.parse(localStorage.getItem(RATE_KEYS.exchangeRates) || '{}');
      } catch (error) {
        console.warn('Load stored exchange rates failed', error);
        return {};
      }
    })();

    const legacyRates = {
      KRW: Number(localStorage.getItem(RATE_KEYS.krwToTwd)) || DEFAULT_RATES.KRW,
      HKD: Number(localStorage.getItem(RATE_KEYS.hkdToTwd)) || DEFAULT_RATES.HKD,
      USD: Number(localStorage.getItem(RATE_KEYS.usdToTwd)) || DEFAULT_RATES.USD
    };

    return {
      rateDirection: normalizedDirection || 'twd_to_local',
      exchangeRates: normalizeRates({ ...legacyRates, ...storedRates }),
      rateUpdatedAt: localStorage.getItem(RATE_KEYS.updatedAt) || ''
    };
  };

  const persistRates = (exchangeRates, rateUpdatedAt) => {
    const normalizedRates = normalizeRates(exchangeRates);
    localStorage.setItem(RATE_KEYS.exchangeRates, JSON.stringify(normalizedRates));
    localStorage.setItem(RATE_KEYS.krwToTwd, String(normalizedRates.KRW || ''));
    localStorage.setItem(RATE_KEYS.hkdToTwd, String(normalizedRates.HKD || ''));
    localStorage.setItem(RATE_KEYS.usdToTwd, String(normalizedRates.USD || ''));
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
      if (!data?.rates?.JPY || !data?.rates?.THB || !data?.rates?.USD) {
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
        const twdRate = Number(data.rates.TWD);
        return {
          currencyToTwd: {
            USD: twdRate / Number(data.rates.USD),
            KRW: twdRate / Number(data.rates.KRW),
            HKD: twdRate / Number(data.rates.HKD),
            JPY: twdRate / Number(data.rates.JPY),
            THB: twdRate / Number(data.rates.THB)
          },
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
