(function attachTravelGuideTripCatalog(global) {
  const catalog = global.TravelGuideTripData || global.Seoul2026TripData || {
    defaultTripId: 'SEOUL_2026',
    trips: {}
  };

  catalog.defaultTripId = catalog.defaultTripId || 'SEOUL_2026';
  catalog.trips = catalog.trips || {};

  global.TravelGuideTripData = catalog;
  global.Seoul2026TripData = catalog;
  global.registerTravelGuideTrip = (tripId, tripData) => {
    if (!tripId || !tripData) return;
    catalog.trips[tripId] = tripData;
  };
})(window);
