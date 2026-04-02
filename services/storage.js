(function attachSeoul2026Storage(global) {
  const STORAGE_KEYS = {
    activeTripId: 'activeTripId',
    legacyTripData: 'seoul2026_data'
  };

  const getTripStorageKey = (tripId) => `${tripId}_data`;

  const readJson = (rawValue) => {
    if (!rawValue) return {};
    try {
      return JSON.parse(rawValue);
    } catch (error) {
      console.warn('Load saved trip data failed', error);
      return {};
    }
  };

  const loadTripState = (tripId) => {
    const stored = readJson(
      localStorage.getItem(getTripStorageKey(tripId))
      || localStorage.getItem(STORAGE_KEYS.legacyTripData)
    );

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

  const saveTripState = ({ tripId, notes, schedule, meta }) => {
    localStorage.setItem(getTripStorageKey(tripId), JSON.stringify({
      notes,
      schedule,
      meta: {
        title: meta?.title || tripId,
        country: meta?.country || 'KR',
        schemaVersion: 1
      }
    }));
    localStorage.setItem(STORAGE_KEYS.activeTripId, tripId);
  };

  const getActiveTripId = (fallbackTripId) => (
    localStorage.getItem(STORAGE_KEYS.activeTripId) || fallbackTripId
  );

  global.Seoul2026Storage = {
    getActiveTripId,
    loadTripState,
    saveTripState
  };
})(window);
