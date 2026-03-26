/**
 * IDX Supercomputer Dashboard - Express Server
 * Serves API endpoints and static frontend
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const { fetchAllStockData, getRankedStocks, getMarketSummary, getLastSourceMeta } = require('./services/stockDataService');
const { generateNews, getNewsByTimeframe, getNewsByTicker, getNewsByCategory } = require('./services/newsService');
const { generateKoneksiKulturData } = require('./services/koneksiKulturService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Data Cache ---
let stockData = [];
let newsData = [];
let marketSummary = {};
let koneksiKulturData = {};
let refreshPromise = null;

async function refreshData() {
  console.log(`[${new Date().toISOString()}] Refreshing IDX data...`);
  stockData = await fetchAllStockData();
  newsData = generateNews(stockData);
  marketSummary = getMarketSummary(stockData);
  marketSummary.dataSource = getLastSourceMeta();
  koneksiKulturData = generateKoneksiKulturData(stockData);
  console.log(`[${new Date().toISOString()}] Data refreshed: ${stockData.length} stocks, ${newsData.length} news items, source=${marketSummary.dataSource?.provider || 'unknown'}`);
}

async function ensureDataLoaded() {
  if (stockData.length > 0) return;

  if (!refreshPromise) {
    refreshPromise = refreshData().finally(() => {
      refreshPromise = null;
    });
  }

  await refreshPromise;
}

const isVercel = process.env.VERCEL === '1';

// Refresh schedules only for long-running server process (not serverless runtime)
if (!isVercel) {
  cron.schedule('0 2 * * 1-5', () => refreshData().catch(err => console.error('[CRON] refresh failed:', err.message))); // Market open refresh
  cron.schedule('*/30 9-15 * * 1-5', () => refreshData().catch(err => console.error('[CRON] refresh failed:', err.message))); // Intraday refresh (WIB approx)
}

// --- API Routes ---

app.use('/api', async (req, res, next) => {
  try {
    await ensureDataLoaded();
    next();
  } catch (err) {
    res.status(503).json({
      success: false,
      message: `Data initialization failed: ${err.message}`,
      source: getLastSourceMeta(),
      timestamp: new Date().toISOString(),
    });
  }
});

// Market summary / IHSG overview
app.get('/api/market-summary', (req, res) => {
  res.json({
    success: true,
    data: marketSummary,
    source: getLastSourceMeta(),
    timestamp: new Date().toISOString(),
  });
});

// All stocks data
app.get('/api/stocks', (req, res) => {
  const { sector, sort, order, limit } = req.query;
  let result = [...stockData];

  // Filter by sector
  if (sector && sector !== 'all') {
    result = result.filter(s => s.sector.toLowerCase() === sector.toLowerCase());
  }

  // Sort - use whitelist approach
  const ALLOWED_SORT_FIELDS = new Set([
    'ticker', 'changePercent', 'volume', 'value', 'open', 'high', 'low', 'currentPrice',
    'prevClose', 'bidPrice', 'askPrice', 'hakaScore', 'hakiScore',
    'bandarScore', 'foreignNet', 'dayTradeScore', 'investScore', 'per',
    'pbv', 'roe', 'dividendYield', 'marketCap', 'weeklyChange',
    'monthlyChange', 'quarterlyChange', 'yearlyChange', 'rsi', 'volumeRatio',
  ]);

  if (sort && ALLOWED_SORT_FIELDS.has(sort)) {
    const dir = order === 'asc' ? 1 : -1;
    result.sort((a, b) => (a[sort] - b[sort]) * dir);
  }

  // Limit
  if (limit) {
    const parsedLimit = parseInt(limit, 10);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      result = result.slice(0, parsedLimit);
    }
  }

  // Strip intraday data for list view (too heavy)
  result = result.map(({ intradayData, topBuyBrokers, topSellBrokers, ...rest }) => rest);

  res.json({
    success: true,
    count: result.length,
    source: getLastSourceMeta(),
    data: result,
    timestamp: new Date().toISOString(),
  });
});

// Single stock detail
app.get('/api/stocks/:ticker', (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const stock = stockData.find(s => s.ticker === ticker);
  if (!stock) {
    return res.status(404).json({ success: false, message: 'Stock not found' });
  }
  res.json({ success: true, source: getLastSourceMeta(), data: stock });
});

// Ranked stocks (best/worst 20) for each timeframe
app.get('/api/rankings/:timeframe', (req, res) => {
  const validTimeframes = new Set(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']);
  const timeframe = req.params.timeframe.toLowerCase();

  if (!validTimeframes.has(timeframe)) {
    return res.status(400).json({ success: false, message: 'Invalid timeframe. Use: daily, weekly, monthly, quarterly, yearly' });
  }

  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 60);
  const ranked = getRankedStocks(stockData, timeframe, limit);

  // Strip heavy data
  const strip = (arr) => arr.map(({ intradayData, topBuyBrokers, topSellBrokers, ...rest }) => rest);

  res.json({
    success: true,
    timeframe,
    data: {
      best: strip(ranked.best),
      worst: strip(ranked.worst),
    },
    timestamp: new Date().toISOString(),
  });
});

// News endpoints
app.get('/api/news', (req, res) => {
  const { timeframe, ticker, category, limit } = req.query;
  let result = [...newsData];

  if (timeframe && timeframe !== 'all') {
    result = getNewsByTimeframe(result, timeframe);
  }
  if (ticker) {
    result = getNewsByTicker(result, ticker.toUpperCase());
  }
  if (category) {
    result = getNewsByCategory(result, category);
  }

  const parsedLimit = parseInt(limit, 10);
  if (!isNaN(parsedLimit) && parsedLimit > 0) {
    result = result.slice(0, parsedLimit);
  }

  res.json({
    success: true,
    count: result.length,
    data: result,
    timestamp: new Date().toISOString(),
  });
});

// Sectors list
app.get('/api/sectors', (req, res) => {
  const sectors = [...new Set(stockData.map(s => s.sector))].sort();
  res.json({ success: true, data: sectors });
});

// ======= KONEKSI & KULTUR INTELLIGENCE API =======

// Full Koneksi & Kultur data
app.get('/api/koneksi-kultur', (req, res) => {
  res.json({ success: true, data: koneksiKulturData, timestamp: new Date().toISOString() });
});

// Political Risk Radar
app.get('/api/koneksi-kultur/political', (req, res) => {
  res.json({ success: true, data: koneksiKulturData.politicalRisk, timestamp: new Date().toISOString() });
});

// Social Sentiment Fusion
app.get('/api/koneksi-kultur/social', (req, res) => {
  res.json({ success: true, data: koneksiKulturData.socialSentiment, timestamp: new Date().toISOString() });
});

// Supply Chain Intelligence
app.get('/api/koneksi-kultur/supply-chain', (req, res) => {
  res.json({ success: true, data: koneksiKulturData.supplyChain, timestamp: new Date().toISOString() });
});

// Cultural Catalysts
app.get('/api/koneksi-kultur/cultural', (req, res) => {
  res.json({ success: true, data: koneksiKulturData.culturalCatalysts, timestamp: new Date().toISOString() });
});

// Informal Economy
app.get('/api/koneksi-kultur/informal', (req, res) => {
  res.json({ success: true, data: koneksiKulturData.informalEconomy, timestamp: new Date().toISOString() });
});

// Wealth Transfer
app.get('/api/koneksi-kultur/wealth', (req, res) => {
  res.json({ success: true, data: koneksiKulturData.wealthTransfer, timestamp: new Date().toISOString() });
});

// Conglomerates
app.get('/api/koneksi-kultur/conglomerates', (req, res) => {
  res.json({ success: true, data: koneksiKulturData.conglomerates, timestamp: new Date().toISOString() });
});

// Force refresh endpoint
app.post('/api/refresh', async (req, res) => {
  try {
    await refreshData();
    res.json({ success: true, message: 'Data refreshed', source: getLastSourceMeta(), timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ success: false, message: `Refresh failed: ${err.message}` });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (!isVercel) {
  (async () => {
    try {
      await ensureDataLoaded();
    } catch (err) {
      console.error('Initial data load failed, server will continue and retry on next API request:', err.message);
    }

    app.listen(PORT, () => {
      console.log(`\n╔══════════════════════════════════════════════════════╗`);
      console.log(`║  IDX SUPERCOMPUTER DASHBOARD                         ║`);
      console.log(`║  Indonesian Stock Exchange Analytics Terminal          ║`);
      console.log(`║  Running on http://localhost:${PORT}                     ║`);
      console.log(`║  ${stockData.length} stocks loaded | ${newsData.length} news items                ║`);
      console.log(`║  Source: ${getLastSourceMeta()?.provider || 'Unknown'}                         ║`);
      console.log(`╚══════════════════════════════════════════════════════╝\n`);
    });
  })();
}

module.exports = app;
