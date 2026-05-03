(function attachTravelGuideStorage(global) {
  const normalizeCountryCode = (countryCode) => {
    if (countryCode === 'GLOBAL') return 'HK';
    return countryCode || 'KR';
  };

  const STORAGE_KEYS = {
    activeTripId: 'travelguide_active_trip_id',
    legacyActiveTripId: 'activeTripId',
    legacyTripData: 'seoul2026_data',
    tripIndex: 'travelguide_trip_index'
  };

  const getTripStorageKey = (tripId) => `${tripId}_data`;

  const safeLocalStorageGet = (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage read failed', key, error);
      return null;
    }
  };

  const safeLocalStorageSet = (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('localStorage write failed', key, error);
      return false;
    }
  };

  const safeLocalStorageRemove = (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('localStorage remove failed', key, error);
      return false;
    }
  };

  const readJson = (rawValue, fallback = {}) => {
    if (!rawValue) return fallback;
    try {
      return JSON.parse(rawValue);
    } catch (error) {
      console.warn('Load saved trip data failed', error);
      return fallback;
    }
  };

  const normalizeTripMeta = (tripId, meta = {}) => ({
    title: meta?.title || tripId,
    country: normalizeCountryCode(meta?.country),
    schemaVersion: meta?.schemaVersion || 1,
    catalogVersion: meta?.catalogVersion || ''
  });

  const loadTripState = (tripId) => {
    const storedTrip = safeLocalStorageGet(getTripStorageKey(tripId));
    const legacyTrip = !storedTrip && tripId === 'SEOUL_2026'
      ? safeLocalStorageGet(STORAGE_KEYS.legacyTripData)
      : '';
    const stored = readJson(storedTrip || legacyTrip);

    return {
      notes: stored?.notes || '',
      schedule: stored?.schedule,
      meta: {
        title: stored?.meta?.title || '',
        country: normalizeCountryCode(stored?.meta?.country || ''),
        schemaVersion: stored?.meta?.schemaVersion || 1,
        catalogVersion: stored?.meta?.catalogVersion || ''
      }
    };
  };

  const readTripIndex = () => {
    const index = readJson(safeLocalStorageGet(STORAGE_KEYS.tripIndex), []);
    return Array.isArray(index) ? index : [];
  };

  const writeTripIndex = (entries) => {
    return safeLocalStorageSet(STORAGE_KEYS.tripIndex, JSON.stringify(entries));
  };

  const upsertTripIndexEntry = ({ tripId, meta, updatedAt }) => {
    const entry = {
      tripId,
      title: meta?.title || tripId,
      country: normalizeCountryCode(meta?.country),
      updatedAt: updatedAt || new Date().toISOString()
    };

    const nextEntries = readTripIndex().filter((item) => item.tripId !== tripId);
    nextEntries.push(entry);
    return writeTripIndex(nextEntries);
  };

  const listTrips = (catalogTrips = {}) => {
    const catalogEntries = Object.entries(catalogTrips).map(([tripId, trip]) => ({
      tripId,
      title: trip?.meta?.title || tripId,
      country: normalizeCountryCode(trip?.meta?.country),
      updatedAt: '',
      source: 'catalog'
    }));

    const merged = [...catalogEntries];
    readTripIndex().forEach((entry) => {
      const existingIndex = merged.findIndex((item) => item.tripId === entry.tripId);
      const normalizedEntry = {
        tripId: entry.tripId,
        title: entry.title || entry.tripId,
        country: normalizeCountryCode(entry.country),
        updatedAt: entry.updatedAt || '',
        source: 'local'
      };
      if (existingIndex >= 0) {
        merged[existingIndex] = { ...merged[existingIndex], ...normalizedEntry };
      } else {
        merged.push(normalizedEntry);
      }
    });

    return merged.sort((a, b) => {
      if (a.updatedAt && b.updatedAt) return String(b.updatedAt).localeCompare(String(a.updatedAt));
      if (a.updatedAt) return -1;
      if (b.updatedAt) return 1;
      return a.title.localeCompare(b.title, 'zh-Hant');
    });
  };

  const saveTripState = ({ tripId, notes, schedule, meta }) => {
    const normalizedMeta = normalizeTripMeta(tripId, meta);
    const updatedAt = new Date().toISOString();
    const wroteTripData = safeLocalStorageSet(getTripStorageKey(tripId), JSON.stringify({
      notes,
      schedule,
      meta: normalizedMeta
    }));
    const wroteActiveTrip = safeLocalStorageSet(STORAGE_KEYS.activeTripId, tripId);
    const wroteTripIndex = upsertTripIndexEntry({ tripId, meta: normalizedMeta, updatedAt });
    return wroteTripData && wroteActiveTrip && wroteTripIndex;
  };

  const createTripState = ({ tripId, notes = '', schedule = [], meta = {} }) => {
    return saveTripState({
      tripId,
      notes,
      schedule,
      meta
    });
  };

  const deleteTripState = (tripId) => {
    const removedTripData = safeLocalStorageRemove(getTripStorageKey(tripId));
    const wroteTripIndex = writeTripIndex(readTripIndex().filter((entry) => entry.tripId !== tripId));
    return removedTripData && wroteTripIndex;
  };

  const setActiveTripId = (tripId) => {
    return safeLocalStorageSet(STORAGE_KEYS.activeTripId, tripId);
  };

  const getActiveTripId = (fallbackTripId) => {
    const scopedValue = safeLocalStorageGet(STORAGE_KEYS.activeTripId);
    if (scopedValue) return scopedValue;

    const legacyValue = safeLocalStorageGet(STORAGE_KEYS.legacyActiveTripId);
    if (legacyValue) {
      safeLocalStorageSet(STORAGE_KEYS.activeTripId, legacyValue);
      return legacyValue;
    }

    return fallbackTripId;
  };

  const storage = {
    createTripState,
    deleteTripState,
    getActiveTripId,
    listTrips,
    loadTripState,
    saveTripState,
    setActiveTripId
  };
  global.TravelGuideStorage = storage;
  global.Seoul2026Storage = storage;
})(window);
