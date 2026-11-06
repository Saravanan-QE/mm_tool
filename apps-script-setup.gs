/**
 * Google Apps Script — paste this into Extensions > Apps Script
 * on the "Digicreature Leads" Google Sheet.
 *
 * After pasting:
 *   1. Click "Deploy" > "New deployment"
 *   2. Type = "Web app"
 *   3. Execute as = "Me"
 *   4. Who has access = "Anyone"
 *   5. Click "Deploy" and authorize
 *   6. Copy the Web app URL
 *   7. Paste it into contact.html as the APPS_SCRIPT_URL value
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Form Leads');
    if (!sheet) sheet = ss.getSheets()[0];

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.company || '',
      data.phone || '',
      data.message || '',
      data.source || 'MM-tool - Website Contact Form'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Digicreature Leads API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
