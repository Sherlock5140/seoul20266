(function attachSeoul2026Storage(global) {
  const STORAGE_KEYS = {
    activeTripId: 'activeTripId',
    legacyTripData: 'seoul2026_data',
    tripIndex: 'travelguide_trip_index'
  };

  const getTripStorageKey = (tripId) => `${tripId}_data`;

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
    country: meta?.country || 'KR',
    schemaVersion: meta?.schemaVersion || 1
  });

  const loadTripState = (tripId) => {
    const storedTrip = localStorage.getItem(getTripStorageKey(tripId));
    const legacyTrip = !storedTrip && tripId === 'SEOUL_2026'
      ? localStorage.getItem(STORAGE_KEYS.legacyTripData)
      : '';
    const stored = readJson(storedTrip || legacyTrip);

    return {
      notes: stored?.notes || '',
      schedule: stored?.schedule,
      meta: {
        title: stored?.meta?.title || '',
        country: stored?.meta?.country || '',
        schemaVersion: stored?.meta?.schemaVersion || 1
      }
    };
  };

  const readTripIndex = () => {
    const index = readJson(localStorage.getItem(STORAGE_KEYS.tripIndex), []);
    return Array.isArray(index) ? index : [];
  };

  const writeTripIndex = (entries) => {
    localStorage.setItem(STORAGE_KEYS.tripIndex, JSON.stringify(entries));
  };

  const upsertTripIndexEntry = ({ tripId, meta, updatedAt }) => {
    const entry = {
      tripId,
      title: meta?.title || tripId,
      country: meta?.country || 'KR',
      updatedAt: updatedAt || new Date().toISOString()
    };

    const nextEntries = readTripIndex().filter((item) => item.tripId !== tripId);
    nextEntries.push(entry);
    writeTripIndex(nextEntries);
  };

  const listTrips = (catalogTrips = {}) => {
    const catalogEntries = Object.entries(catalogTrips).map(([tripId, trip]) => ({
      tripId,
      title: trip?.meta?.title || tripId,
      country: trip?.meta?.country || 'KR',
      updatedAt: '',
      source: 'catalog'
    }));

    const merged = [...catalogEntries];
    readTripIndex().forEach((entry) => {
      const existingIndex = merged.findIndex((item) => item.tripId === entry.tripId);
      const normalizedEntry = {
        tripId: entry.tripId,
        title: entry.title || entry.tripId,
        country: entry.country || 'KR',
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
    localStorage.setItem(getTripStorageKey(tripId), JSON.stringify({
      notes,
      schedule,
      meta: normalizedMeta
    }));
    localStorage.setItem(STORAGE_KEYS.activeTripId, tripId);
    upsertTripIndexEntry({ tripId, meta: normalizedMeta, updatedAt });
  };

  const createTripState = ({ tripId, notes = '', schedule = [], meta = {} }) => {
    saveTripState({
      tripId,
      notes,
      schedule,
      meta
    });
  };

  const renameTrip = (tripId, title) => {
    const current = loadTripState(tripId);
    saveTripState({
      tripId,
      notes: current.notes,
      schedule: current.schedule || [],
      meta: {
        ...current.meta,
        title
      }
    });
  };

  const deleteTripState = (tripId) => {
    localStorage.removeItem(getTripStorageKey(tripId));
    writeTripIndex(readTripIndex().filter((entry) => entry.tripId !== tripId));
  };

  const setActiveTripId = (tripId) => {
    localStorage.setItem(STORAGE_KEYS.activeTripId, tripId);
  };

  const getActiveTripId = (fallbackTripId) => (
    localStorage.getItem(STORAGE_KEYS.activeTripId) || fallbackTripId
  );

  global.Seoul2026Storage = {
    createTripState,
    deleteTripState,
    getActiveTripId,
    listTrips,
    loadTripState,
    renameTrip,
    saveTripState,
    setActiveTripId
  };
})(window);
