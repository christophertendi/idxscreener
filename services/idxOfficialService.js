const axios = require('axios');
const AdmZip = require('adm-zip');
const { DBFFile } = require('dbffile');
const fs = require('fs');
const os = require('os');
const path = require('path');

const IDX_MIRRORS = [
  'https://idxdata3.co.id',
  'https://idxdata2.co.id',
];
const STOCK_SUMMARY_LISTING_PATH = '/?directory=.%2FDownload_Data%2FDaily%2FStock_Summary%2F';

function parseLatestStockSummaryZipName(html) {
  const matches = [...html.matchAll(/SS(\d{6})\.zip/g)].map((m) => m[0]);
  if (!matches.length) return null;

  // YYMMDD lexicographical max works for same century format in IDX file names
  return matches.sort().pop();
}

async function downloadLatestStockSummaryZip() {
  let lastErr = null;

  for (const baseUrl of IDX_MIRRORS) {
    try {
      const listingUrl = `${baseUrl}${STOCK_SUMMARY_LISTING_PATH}`;
      const listingRes = await axios.get(listingUrl, {
        timeout: 45000,
        headers: {
          'User-Agent': 'Mozilla/5.0 IDX-Supercomputer/1.0',
          Accept: 'text/html,*/*',
        },
      });

      const latestZip = parseLatestStockSummaryZipName(listingRes.data || '');
      if (!latestZip) {
        throw new Error(`No SS*.zip file discovered from ${baseUrl}`);
      }

      const zipUrl = `${baseUrl}/Download_Data/Daily/Stock_Summary/${latestZip}`;
      const zipRes = await axios.get(zipUrl, {
        responseType: 'arraybuffer',
        timeout: 45000,
        headers: {
          'User-Agent': 'Mozilla/5.0 IDX-Supercomputer/1.0',
          Accept: '*/*',
        },
      });

      return {
        latestZip,
        zipUrl,
        listingUrl,
        zipBuffer: Buffer.from(zipRes.data),
      };
    } catch (err) {
      lastErr = err;
    }
  }

  throw new Error(`All IDX mirrors failed: ${lastErr ? lastErr.message : 'unknown error'}`);
}

async function parseStockSummaryDbfFromZip(zipBuffer) {
  const zip = new AdmZip(zipBuffer);
  const dbfEntry = zip.getEntries().find((e) => e.entryName.toUpperCase().endsWith('.DBF'));

  if (!dbfEntry) {
    throw new Error('IDX Stock_Summary zip does not contain DBF file.');
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'idx-ss-'));
  const dbfPath = path.join(tmpDir, path.basename(dbfEntry.entryName));

  try {
    fs.writeFileSync(dbfPath, dbfEntry.getData());
    const dbf = await DBFFile.open(dbfPath);
    const records = await dbf.readRecords(dbf.recordCount);
    return records;
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (_) {
      // ignore cleanup failure
    }
  }
}

function normalizeIdxRecord(record, sourceMeta) {
  const ticker = String(record.STK_CODE || '').trim();
  if (!ticker) return null;

  const currentPrice = Number(record.STK_CLOS || 0);
  const prevClose = Number(record.STK_PREV || 0);
  const change = currentPrice - prevClose;
  const rawPct = Number(record.STK_FCLO);
  const changePercent = Number.isFinite(rawPct) ? rawPct : (prevClose ? (change / prevClose) * 100 : 0);

  return {
    ticker,
    name: String(record.STK_NAME || '').trim(),
    prevClose,
    open: Number(record.STK_OPEN || 0),
    high: Number(record.STK_HIGH || 0),
    low: Number(record.STK_LOW || 0),
    currentPrice,
    change,
    changePercent,
    volume: Number(record.STK_VOLM || 0),
    value: Math.round(Number(record.STK_AMNT || 0) / 1_000_000), // millions IDR
    askPrice: Number(record.STK_ASKP || 0),
    askVol: Number(record.STK_ASKV || 0),
    bidPrice: Number(record.STK_BIDP || 0),
    bidVol: Number(record.STK_BIDV || 0),
    idxDate: record.STK_DATE ? new Date(record.STK_DATE).toISOString() : null,
    referenceUrl: sourceMeta.fileUrl,
  };
}

async function fetchLatestIdxStockSummary() {
  const { latestZip, zipUrl, listingUrl, zipBuffer } = await downloadLatestStockSummaryZip();
  const records = await parseStockSummaryDbfFromZip(zipBuffer);

  const sourceMeta = {
    provider: 'IDX Daily Stock Summary',
    listingUrl,
    fileName: latestZip,
    fileUrl: zipUrl,
    fetchedAt: new Date().toISOString(),
  };

  const byTicker = new Map();
  for (const r of records) {
    const normalized = normalizeIdxRecord(r, sourceMeta);
    if (normalized) byTicker.set(normalized.ticker, normalized);
  }

  return {
    sourceMeta,
    byTicker,
  };
}

module.exports = {
  fetchLatestIdxStockSummary,
};