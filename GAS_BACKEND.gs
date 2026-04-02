const SHEET_NAME = 'Trips';
const SPREADSHEET_ID = '1kVooE-_Y4h6IuGdfNI2-265Ii2DLxCtMX_KzHzp9MYc';

function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const action = params.action || 'list';

    if (action === 'list') {
      return jsonOutput({
        status: 'success',
        trips: listTrips_()
      });
    }

    if (action === 'load') {
      const tripId = (params.tripId || '').trim();
      if (!tripId) {
        return jsonOutput({ status: 'error', message: 'Missing tripId' });
      }

      const row = findTripRow_(tripId);
      if (!row) {
        return jsonOutput({ status: 'error', message: 'Trip not found' });
      }

      return jsonOutput({
        status: 'success',
        tripId: row.tripId,
        title: row.title,
        updatedAt: row.updatedAt,
        data: row.data
      });
    }

    return jsonOutput({ status: 'error', message: 'Unsupported action' });
  } catch (error) {
    return jsonOutput({ status: 'error', message: String(error) });
  }
}

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const action = String(payload.action || 'save');
    const tripId = String(payload.tripId || '').trim();

    if (!tripId) {
      return jsonOutput({ status: 'error', message: 'Missing tripId' });
    }

    if (action === 'delete') {
      deleteTrip_(tripId);
      return jsonOutput({
        status: 'success',
        message: 'Deleted',
        tripId: tripId
      });
    }

    const meta = payload.meta || {};
    const data = typeof payload.data === 'string' ? payload.data : JSON.stringify(payload.data || {});

    upsertTrip_(tripId, meta, data);

    return jsonOutput({
      status: 'success',
      message: 'Saved',
      tripId: tripId
    });
  } catch (error) {
    return jsonOutput({ status: 'error', message: String(error) });
  }
}

function listTrips_() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const values = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
  return values
    .filter((row) => row[0])
    .map((row) => ({
      tripId: row[0],
      title: row[1] || row[0],
      dateRange: row[2] || '',
      updatedAt: row[3] || ''
    }))
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

function findTripRow_(tripId) {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const values = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
  for (let index = 0; index < values.length; index += 1) {
    const row = values[index];
    if (String(row[0]).trim() === tripId) {
      return {
        rowNumber: index + 2,
        tripId: row[0],
        title: row[1],
        dateRange: row[2],
        updatedAt: row[3],
        data: row[4]
      };
    }
  }
  return null;
}

function upsertTrip_(tripId, meta, data) {
  const sheet = getSheet_();
  const existing = findTripRow_(tripId);
  const title = String(meta.title || tripId);
  const dateRange = String(meta.dateRange || '');
  const updatedAt = new Date().toISOString();
  const rowValues = [[tripId, title, dateRange, updatedAt, data]];

  if (existing) {
    sheet.getRange(existing.rowNumber, 1, 1, 5).setValues(rowValues);
  } else {
    sheet.appendRow(rowValues[0]);
  }
}

function deleteTrip_(tripId) {
  const existing = findTripRow_(tripId);
  if (!existing) {
    throw new Error('Trip not found');
  }
  getSheet_().deleteRow(existing.rowNumber);
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, 5).setValues([[
      'tripId',
      'title',
      'dateRange',
      'updatedAt',
      'data'
    ]]);
  }

  return sheet;
}

function parsePayload_(e) {
  const formPayload = e && e.parameter && e.parameter.payload;
  if (formPayload) {
    return JSON.parse(formPayload);
  }
  if (e && e.postData && e.postData.contents) {
    return JSON.parse(e.postData.contents);
  }
  throw new Error('Missing request body');
}

function jsonOutput(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
