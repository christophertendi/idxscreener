/**
 * IDX Stock Data Service
 * Generates and manages Indonesian stock market data with all key metrics:
 * - HAKA (Hajar Kanan): Aggressive buying at offer price
 * - HAKI (Hajar Kiri): Aggressive selling at bid price
 * - ARA (Auto Rejection Atas): Upper auto-rejection limit (+25% for most stocks)
 * - ARB (Auto Rejection Bawah): Lower auto-rejection limit (-7% standard)
 * - Partisipasi Bandar: Market maker/big player participation
 * - Foreign Flow: International investor net buy/sell
 * - Broker Summary: Top broker activity
 * - Bid-Ask Spread, Volume, Market Cap, PER, PBV
 */

const { fetchLatestIdxStockSummary } = require('./idxOfficialService');

// Complete list of actively traded IDX stocks with realistic data
const IDX_STOCKS = [
  { ticker: 'BBCA', name: 'Bank Central Asia', sector: 'Finance', basePrice: 9875, marketCap: 1213000 },
  { ticker: 'BBRI', name: 'Bank Rakyat Indonesia', sector: 'Finance', basePrice: 4650, marketCap: 703000 },
  { ticker: 'BMRI', name: 'Bank Mandiri', sector: 'Finance', basePrice: 6325, marketCap: 590000 },
  { ticker: 'TLKM', name: 'Telkom Indonesia', sector: 'Telecom', basePrice: 3840, marketCap: 380000 },
  { ticker: 'ASII', name: 'Astra International', sector: 'Industrial', basePrice: 5275, marketCap: 213000 },
  { ticker: 'UNVR', name: 'Unilever Indonesia', sector: 'Consumer', basePrice: 2830, marketCap: 108000 },
  { ticker: 'GOTO', name: 'GoTo Gojek Tokopedia', sector: 'Technology', basePrice: 74, marketCap: 87000 },
  { ticker: 'BREN', name: 'Barito Renewables', sector: 'Energy', basePrice: 6950, marketCap: 520000 },
  { ticker: 'AMMN', name: 'Amman Mineral', sector: 'Mining', basePrice: 9050, marketCap: 380000 },
  { ticker: 'EMTK', name: 'Elang Mahkota Teknologi', sector: 'Technology', basePrice: 540, marketCap: 32000 },
  { ticker: 'ADRO', name: 'Adaro Energy', sector: 'Mining', basePrice: 2780, marketCap: 89000 },
  { ticker: 'ANTM', name: 'Aneka Tambang', sector: 'Mining', basePrice: 1595, marketCap: 38000 },
  { ticker: 'INCO', name: 'Vale Indonesia', sector: 'Mining', basePrice: 4280, marketCap: 42000 },
  { ticker: 'MDKA', name: 'Merdeka Copper Gold', sector: 'Mining', basePrice: 2450, marketCap: 56000 },
  { ticker: 'CPIN', name: 'Charoen Pokphand', sector: 'Consumer', basePrice: 5100, marketCap: 83000 },
  { ticker: 'ICBP', name: 'Indofood CBP', sector: 'Consumer', basePrice: 11825, marketCap: 138000 },
  { ticker: 'INDF', name: 'Indofood Sukses Makmur', sector: 'Consumer', basePrice: 6600, marketCap: 58000 },
  { ticker: 'KLBF', name: 'Kalbe Farma', sector: 'Healthcare', basePrice: 1620, marketCap: 76000 },
  { ticker: 'PGAS', name: 'Perusahaan Gas Negara', sector: 'Energy', basePrice: 1525, marketCap: 37000 },
  { ticker: 'PTBA', name: 'Bukit Asam', sector: 'Mining', basePrice: 2730, marketCap: 31000 },
  { ticker: 'SMGR', name: 'Semen Indonesia', sector: 'Industrial', basePrice: 3950, marketCap: 23000 },
  { ticker: 'UNTR', name: 'United Tractors', sector: 'Industrial', basePrice: 26400, marketCap: 98000 },
  { ticker: 'ITMG', name: 'Indo Tambangraya', sector: 'Mining', basePrice: 26950, marketCap: 30000 },
  { ticker: 'ESSA', name: 'Surya Esa Perkasa', sector: 'Energy', basePrice: 780, marketCap: 19000 },
  { ticker: 'BUKA', name: 'Bukalapak', sector: 'Technology', basePrice: 124, marketCap: 12700 },
  { ticker: 'ACES', name: 'Ace Hardware Indonesia', sector: 'Retail', basePrice: 720, marketCap: 12300 },
  { ticker: 'MAPI', name: 'Mitra Adiperkasa', sector: 'Retail', basePrice: 1665, marketCap: 28000 },
  { ticker: 'BRIS', name: 'Bank Syariah Indonesia', sector: 'Finance', basePrice: 2680, marketCap: 53000 },
  { ticker: 'ARTO', name: 'Bank Jago', sector: 'Finance', basePrice: 2410, marketCap: 39000 },
  { ticker: 'BBTN', name: 'Bank Tabungan Negara', sector: 'Finance', basePrice: 1310, marketCap: 18000 },
  { ticker: 'ERAA', name: 'Erajaya Swasembada', sector: 'Retail', basePrice: 378, marketCap: 9500 },
  { ticker: 'SCMA', name: 'Surya Citra Media', sector: 'Media', basePrice: 166, marketCap: 2400 },
  { ticker: 'MEDC', name: 'Medco Energi', sector: 'Energy', basePrice: 1350, marketCap: 32000 },
  { ticker: 'PGEO', name: 'Pertamina Geothermal', sector: 'Energy', basePrice: 1385, marketCap: 48000 },
  { ticker: 'BRPT', name: 'Barito Pacific', sector: 'Industrial', basePrice: 990, marketCap: 23000 },
  { ticker: 'TOWR', name: 'Sarana Menara Nusantara', sector: 'Telecom', basePrice: 780, marketCap: 40000 },
  { ticker: 'TBIG', name: 'Tower Bersama', sector: 'Telecom', basePrice: 1760, marketCap: 39000 },
  { ticker: 'EXCL', name: 'XL Axiata', sector: 'Telecom', basePrice: 2360, marketCap: 32000 },
  { ticker: 'ISAT', name: 'Indosat Ooredoo', sector: 'Telecom', basePrice: 10175, marketCap: 54000 },
  { ticker: 'GGRM', name: 'Gudang Garam', sector: 'Consumer', basePrice: 14000, marketCap: 27000 },
  { ticker: 'HMSP', name: 'HM Sampoerna', sector: 'Consumer', basePrice: 800, marketCap: 93000 },
  { ticker: 'MYOR', name: 'Mayora Indah', sector: 'Consumer', basePrice: 2530, marketCap: 57000 },
  { ticker: 'INKP', name: 'Indah Kiat Pulp', sector: 'Industrial', basePrice: 8575, marketCap: 47000 },
  { ticker: 'TKIM', name: 'Pabrik Kertas Tjiwi', sector: 'Industrial', basePrice: 7025, marketCap: 22000 },
  { ticker: 'JPFA', name: 'Japfa Comfeed', sector: 'Consumer', basePrice: 1440, marketCap: 16000 },
  { ticker: 'SMRA', name: 'Summarecon Agung', sector: 'Property', basePrice: 580, marketCap: 8400 },
  { ticker: 'BSDE', name: 'Bumi Serpong Damai', sector: 'Property', basePrice: 1065, marketCap: 20000 },
  { ticker: 'CTRA', name: 'Ciputra Development', sector: 'Property', basePrice: 1145, marketCap: 21000 },
  { ticker: 'PWON', name: 'Pakuwon Jati', sector: 'Property', basePrice: 388, marketCap: 18600 },
  { ticker: 'HEAL', name: 'Medikaloka Hermina', sector: 'Healthcare', basePrice: 1370, marketCap: 19000 },
  { ticker: 'SIDO', name: 'Industri Jamu Sido Muncul', sector: 'Healthcare', basePrice: 680, marketCap: 20400 },
  { ticker: 'AKRA', name: 'AKR Corporindo', sector: 'Energy', basePrice: 1385, marketCap: 11000 },
  { ticker: 'SRTG', name: 'Saratoga Investama', sector: 'Finance', basePrice: 1440, marketCap: 19600 },
  { ticker: 'TPIA', name: 'Chandra Asri Pacific', sector: 'Industrial', basePrice: 7050, marketCap: 56000 },
  { ticker: 'MBMA', name: 'Merdeka Battery Materials', sector: 'Mining', basePrice: 470, marketCap: 57000 },
  { ticker: 'NCKL', name: 'Trimegah Bangun Persada', sector: 'Mining', basePrice: 735, marketCap: 55000 },
  { ticker: 'HRUM', name: 'Harum Energy', sector: 'Mining', basePrice: 1260, marketCap: 10000 },
  { ticker: 'TAPG', name: 'Triputra Agro Persada', sector: 'Agriculture', basePrice: 780, marketCap: 15000 },
  { ticker: 'DSNG', name: 'Dharma Satya Nusantara', sector: 'Agriculture', basePrice: 570, marketCap: 4200 },
  { ticker: 'LSIP', name: 'London Sumatra', sector: 'Agriculture', basePrice: 1035, marketCap: 7000 },
];

// Indonesian broker codes commonly seen in broker summary
const BROKER_CODES = [
  { code: 'YP', name: 'Mirae Asset Sekuritas' },
  { code: 'CC', name: 'Mandiri Sekuritas' },
  { code: 'ZP', name: 'BCA Sekuritas' },
  { code: 'AK', name: 'CGS-CIMB Sekuritas' },
  { code: 'KS', name: 'Kresna Sekuritas' },
  { code: 'MS', name: 'Morgan Stanley Sekuritas' },
  { code: 'RX', name: 'Macquarie Sekuritas' },
  { code: 'GR', name: 'Bahana Sekuritas' },
  { code: 'PD', name: 'Indo Premier Sekuritas' },
  { code: 'DX', name: 'Jasa Utama Capital' },
  { code: 'EP', name: 'MNC Sekuritas' },
  { code: 'AI', name: 'Ajaib Sekuritas' },
  { code: 'TP', name: 'Stockbit Sekuritas' },
  { code: 'BK', name: 'BNI Sekuritas' },
  { code: 'NI', name: 'BRI Danareksa Sekuritas' },
  { code: 'OD', name: 'Sinarmas Sekuritas' },
  { code: 'KZ', name: 'KGI Sekuritas' },
  { code: 'DB', name: 'Deutsche Bank AG' },
  { code: 'JP', name: 'JP Morgan Sekuritas' },
  { code: 'CG', name: 'Credit Suisse Sekuritas' },
];

let cachedStockData = null;
let lastUpdateTime = null;
let historicalData = {};
let lastSourceMeta = {
  provider: 'IDX Daily Stock Summary',
  fileName: null,
  fileUrl: null,
  listingUrl: 'https://idxdata3.co.id/?directory=.%2FDownload_Data%2FDaily%2FStock_Summary%2F',
  fetchedAt: new Date().toISOString(),
};

/**
 * Seed-based pseudo-random for consistent daily data
 */
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getDaySeed() {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

/**
 * Generate realistic tick size based on IDX rules
 */
function getTickSize(price) {
  if (price < 200) return 1;
  if (price < 500) return 2;
  if (price < 2000) return 5;
  if (price < 5000) return 10;
  return 25;
}

/**
 * Calculate ARA (Auto Rejection Atas - Upper Limit)
 * Standard: +20-25% for most stocks
 */
function calculateARA(price) {
  if (price < 200) return Math.round(price * 1.35);
  if (price < 5000) return Math.round(price * 1.25);
  return Math.round(price * 1.20);
}

/**
 * Calculate ARB (Auto Rejection Bawah - Lower Limit)
 * Standard: -7% (can be asymmetric)
 */
function calculateARB(price) {
  return Math.round(price * 0.93);
}

/**
 * Generate comprehensive stock data for a single stock
 */
function generateStockData(stock, daySeed, index) {
  const seed = daySeed + index * 137;
  const rand = (offset) => seededRandom(seed + offset);

  // Price movement (-7% to +10% daily realistic range)
  const changePct = (rand(1) - 0.45) * 15; // slight bullish bias
  const priceChange = stock.basePrice * (changePct / 100);
  const currentPrice = Math.round((stock.basePrice + priceChange) / getTickSize(stock.basePrice)) * getTickSize(stock.basePrice);
  const prevClose = stock.basePrice;
  const change = currentPrice - prevClose;
  const changePercent = ((change / prevClose) * 100);

  // Volume data
  const avgVolume = Math.round(50000000 * (rand(2) + 0.1));
  const todayVolume = Math.round(avgVolume * (0.5 + rand(3) * 2));
  const volumeRatio = todayVolume / avgVolume;

  // Bid-Ask spread
  const tick = getTickSize(currentPrice);
  const bidPrice = currentPrice - tick;
  const askPrice = currentPrice + tick;
  const bidVol = Math.round(rand(4) * 5000) * 100;
  const askVol = Math.round(rand(5) * 5000) * 100;

  // HAKA Score (aggressive buying pressure 0-100)
  // Based on: volume at offer side, frequency of market buys
  const hakaScore = Math.round(Math.max(0, Math.min(100,
    50 + changePct * 3 + (rand(6) - 0.5) * 30
  )));

  // HAKI Score (aggressive selling pressure 0-100)
  const hakiScore = Math.round(Math.max(0, Math.min(100,
    50 - changePct * 3 + (rand(7) - 0.5) * 30
  )));

  // ARA/ARB levels
  const araPrice = calculateARA(prevClose);
  const arbPrice = calculateARB(prevClose);
  const isARA = currentPrice >= araPrice;
  const isARB = currentPrice <= arbPrice;
  const distanceToARA = ((araPrice - currentPrice) / currentPrice * 100);
  const distanceToARB = ((currentPrice - arbPrice) / currentPrice * 100);

  // Foreign flow (net buy/sell in millions IDR)
  const foreignBuy = Math.round(rand(8) * 200) * 100; // in millions
  const foreignSell = Math.round(rand(9) * 200) * 100;
  const foreignNet = foreignBuy - foreignSell;
  const foreignPctOfVolume = Math.round((foreignBuy + foreignSell) / (todayVolume * currentPrice / 1000000) * 100);

  // Bandar (market maker) activity
  const bandarAccumulation = Math.round((rand(10) - 0.4) * 100); // -60 to +60
  const bandarScore = Math.round(Math.max(0, Math.min(100,
    50 + bandarAccumulation * 0.8 + foreignNet / 500
  )));

  // Top brokers
  const topBuyBrokers = [];
  const topSellBrokers = [];
  const usedBrokers = new Set();

  for (let i = 0; i < 5; i++) {
    let buyIdx = Math.floor(rand(20 + i) * BROKER_CODES.length);
    while (usedBrokers.has(buyIdx)) buyIdx = (buyIdx + 1) % BROKER_CODES.length;
    usedBrokers.add(buyIdx);

    topBuyBrokers.push({
      ...BROKER_CODES[buyIdx],
      volume: Math.round(rand(30 + i) * todayVolume * 0.15),
      value: Math.round(rand(40 + i) * todayVolume * currentPrice * 0.15 / 1000000),
    });

    let sellIdx = Math.floor(rand(50 + i) * BROKER_CODES.length);
    while (usedBrokers.has(sellIdx)) sellIdx = (sellIdx + 1) % BROKER_CODES.length;
    usedBrokers.add(sellIdx);

    topSellBrokers.push({
      ...BROKER_CODES[sellIdx],
      volume: Math.round(rand(60 + i) * todayVolume * 0.15),
      value: Math.round(rand(70 + i) * todayVolume * currentPrice * 0.15 / 1000000),
    });
  }

  // Fundamental metrics
  const per = Math.round((5 + rand(11) * 50) * 10) / 10;
  const pbv = Math.round((0.3 + rand(12) * 8) * 100) / 100;
  const roe = Math.round((2 + rand(13) * 35) * 10) / 10;
  const der = Math.round((0.1 + rand(14) * 3) * 100) / 100;
  const dividendYield = Math.round(rand(15) * 10 * 100) / 100;

  // Technical indicators
  const rsi = Math.round(30 + rand(16) * 40);
  const macd = Math.round((rand(17) - 0.5) * 200) / 100;
  const sma20 = Math.round(currentPrice * (1 + (rand(18) - 0.5) * 0.1));
  const sma50 = Math.round(currentPrice * (1 + (rand(19) - 0.5) * 0.15));
  const sma200 = Math.round(currentPrice * (1 + (rand(20) - 0.5) * 0.25));

  // Weekly/Monthly/Quarterly/Yearly change
  const weeklyChange = Math.round((rand(21) - 0.45) * 15 * 100) / 100;
  const monthlyChange = Math.round((rand(22) - 0.4) * 30 * 100) / 100;
  const quarterlyChange = Math.round((rand(23) - 0.35) * 50 * 100) / 100;
  const yearlyChange = Math.round((rand(24) - 0.3) * 80 * 100) / 100;

  // Composite score for ranking (combines all factors)
  const dayTradeScore = Math.round(
    hakaScore * 0.25 +
    bandarScore * 0.20 +
    (foreignNet > 0 ? 20 : -10) +
    volumeRatio * 10 +
    changePercent * 2 +
    (100 - Math.abs(50 - rsi)) * 0.15
  );

  const investScore = Math.round(
    (per < 15 ? 20 : per < 25 ? 10 : 0) +
    (pbv < 2 ? 15 : pbv < 4 ? 8 : 0) +
    roe * 0.5 +
    dividendYield * 3 +
    (foreignNet > 0 ? 15 : -5) +
    yearlyChange * 0.2 +
    bandarScore * 0.15
  );

  return {
    ticker: stock.ticker,
    name: stock.name,
    sector: stock.sector,
    marketCap: stock.marketCap,

    // Price data
    currentPrice,
    prevClose,
    change,
    changePercent: Math.round(changePercent * 100) / 100,
    open: Math.round((prevClose + change * rand(25)) / tick) * tick,
    high: Math.round(Math.max(currentPrice, prevClose) * (1 + rand(26) * 0.02) / tick) * tick,
    low: Math.round(Math.min(currentPrice, prevClose) * (1 - rand(27) * 0.02) / tick) * tick,

    // Volume
    volume: todayVolume,
    avgVolume,
    volumeRatio: Math.round(volumeRatio * 100) / 100,
    value: Math.round(todayVolume * currentPrice / 1000000), // in millions IDR

    // Bid-Ask
    bidPrice,
    askPrice,
    bidVol,
    askVol,
    spread: Math.round((askPrice - bidPrice) / currentPrice * 10000) / 100, // in bps

    // HAKA/HAKI
    hakaScore,
    hakiScore,
    hakaHakiRatio: Math.round(hakaScore / Math.max(hakiScore, 1) * 100) / 100,

    // ARA/ARB
    araPrice,
    arbPrice,
    isARA,
    isARB,
    distanceToARA: Math.round(distanceToARA * 100) / 100,
    distanceToARB: Math.round(distanceToARB * 100) / 100,

    // Foreign flow
    foreignBuy,
    foreignSell,
    foreignNet,
    foreignPctOfVolume: Math.min(foreignPctOfVolume, 100),

    // Bandar activity
    bandarAccumulation,
    bandarScore,

    // Top brokers
    topBuyBrokers,
    topSellBrokers,

    // Fundamentals
    per,
    pbv,
    roe,
    der,
    dividendYield,

    // Technical
    rsi,
    macd,
    sma20,
    sma50,
    sma200,

    // Multi-timeframe performance
    dailyChange: Math.round(changePercent * 100) / 100,
    weeklyChange,
    monthlyChange,
    quarterlyChange,
    yearlyChange,

    // Composite scores
    dayTradeScore: Math.max(0, Math.min(100, dayTradeScore)),
    investScore: Math.max(0, Math.min(100, investScore)),

    // Timestamps
    lastUpdate: new Date().toISOString(),
  };
}

/**
 * Generate intraday price chart data (5-minute intervals)
 */
function generateIntradayData(stock, daySeed) {
  const data = [];
  const intervals = 78; // 09:00 to 15:30 in 5-min intervals
  let price = stock.prevClose;
  const seed = daySeed + stock.ticker.charCodeAt(0) * 100;

  for (let i = 0; i < intervals; i++) {
    const hour = 9 + Math.floor((i * 5) / 60);
    const minute = (i * 5) % 60;
    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

    const trend = (stock.currentPrice - stock.prevClose) / intervals;
    const noise = (seededRandom(seed + i * 7) - 0.5) * stock.prevClose * 0.005;
    price = price + trend + noise;

    const tick = getTickSize(price);
    price = Math.round(price / tick) * tick;

    data.push({
      time,
      price: Math.max(price, stock.arbPrice),
      volume: Math.round(seededRandom(seed + i * 13) * stock.volume / intervals * 2),
    });
  }

  return data;
}

function applyIdxOfficialOverrides(stocks, idxPayload) {
  if (!idxPayload || !idxPayload.byTicker) {
    stocks.forEach((stock) => {
      stock.dataQuality = 'missing_official';
      stock.referenceUrl = lastSourceMeta.listingUrl;
    });
    return stocks;
  }

  stocks.forEach((stock) => {
    const idx = idxPayload.byTicker.get(stock.ticker);
    if (!idx) {
      stock.dataQuality = 'missing_official';
      stock.referenceUrl = idxPayload.sourceMeta?.listingUrl || null;
      return;
    }

    stock.prevClose = idx.prevClose;
    stock.open = idx.open;
    stock.high = idx.high;
    stock.low = idx.low;
    stock.currentPrice = idx.currentPrice;
    stock.change = idx.change;
    stock.changePercent = Math.round(idx.changePercent * 100) / 100;
    stock.dailyChange = stock.changePercent;

    stock.volume = idx.volume;
    stock.value = idx.value;
    stock.volumeRatio = stock.avgVolume > 0 ? Math.round((stock.volume / stock.avgVolume) * 100) / 100 : 0;

    stock.bidPrice = idx.bidPrice;
    stock.bidVol = idx.bidVol;
    stock.askPrice = idx.askPrice;
    stock.askVol = idx.askVol;

    stock.spread = stock.currentPrice > 0
      ? Math.round(((stock.askPrice - stock.bidPrice) / stock.currentPrice) * 10000) / 100
      : 0;

    stock.araPrice = calculateARA(stock.prevClose);
    stock.arbPrice = calculateARB(stock.prevClose);
    stock.isARA = stock.currentPrice >= stock.araPrice;
    stock.isARB = stock.currentPrice <= stock.arbPrice;
    stock.distanceToARA = Math.round(((stock.araPrice - stock.currentPrice) / Math.max(stock.currentPrice, 1)) * 10000) / 100;
    stock.distanceToARB = Math.round(((stock.currentPrice - stock.arbPrice) / Math.max(stock.currentPrice, 1)) * 10000) / 100;

    stock.referenceUrl = idx.referenceUrl;
    stock.idxDate = idx.idxDate;
    stock.dataQuality = 'official_idx';
  });

  return stocks;
}

/**
 * Build bootstrap data without external network calls.
 */
function getBootstrapSnapshot() {
  const daySeed = getDaySeed();
  const stocks = IDX_STOCKS.map((stock, index) =>
    generateStockData(stock, daySeed, index)
  );

  stocks.forEach(stock => {
    stock.intradayData = generateIntradayData(stock, daySeed);
    stock.dataQuality = stock.dataQuality || 'bootstrap_local';
    stock.referenceUrl = stock.referenceUrl || 'https://idxdata3.co.id/?directory=.%2FDownload_Data%2FDaily%2FStock_Summary%2F';
  });

  return stocks;
}

/**
 * Fetch and process all stock data
 */
async function fetchAllStockData() {
  const daySeed = getDaySeed();
  const stocks = IDX_STOCKS.map((stock, index) =>
    generateStockData(stock, daySeed, index)
  );

  let idxPayload;
  try {
    idxPayload = await fetchLatestIdxStockSummary();
    lastSourceMeta = {
      ...idxPayload.sourceMeta,
      provider: 'IDX Daily Stock Summary',
    };
  } catch (err) {
    // If we already have previous official/cached data, keep serving it.
    if (cachedStockData && cachedStockData.length > 0) {
      lastSourceMeta = {
        ...lastSourceMeta,
        provider: `${lastSourceMeta.provider || 'IDX Daily Stock Summary'} (cached - last successful snapshot)`,
        stale: true,
        staleReason: err.message,
        fetchedAt: new Date().toISOString(),
      };
      return cachedStockData;
    }

    // Cold-start fallback: serve generated data so app remains usable.
    lastSourceMeta = {
      provider: 'Bootstrap Fallback (generated data)',
      fileName: null,
      fileUrl: null,
      listingUrl: 'https://idxdata3.co.id/?directory=.%2FDownload_Data%2FDaily%2FStock_Summary%2F',
      fetchedAt: new Date().toISOString(),
      stale: true,
      staleReason: err.message,
    };

    applyIdxOfficialOverrides(stocks, null);

    stocks.forEach(stock => {
      stock.intradayData = generateIntradayData(stock, daySeed);
      stock.dataQuality = stock.dataQuality || 'bootstrap_fallback';
    });

    cachedStockData = stocks;
    lastUpdateTime = new Date();

    return stocks;
  }

  applyIdxOfficialOverrides(stocks, idxPayload);

  // Generate intraday for each stock
  stocks.forEach(stock => {
    stock.intradayData = generateIntradayData(stock, daySeed);
  });

  cachedStockData = stocks;
  lastUpdateTime = new Date();

  return stocks;
}

/**
 * Get top/bottom ranked stocks for different timeframes
 */
function getRankedStocks(stocks, timeframe = 'daily', limit = 20) {
  let sortField;
  switch (timeframe) {
    case 'daily': sortField = 'dayTradeScore'; break;
    case 'weekly': sortField = 'weeklyChange'; break;
    case 'monthly': sortField = 'monthlyChange'; break;
    case 'quarterly': sortField = 'quarterlyChange'; break;
    case 'yearly': sortField = 'investScore'; break;
    default: sortField = 'dayTradeScore';
  }

  const sorted = [...stocks].sort((a, b) => b[sortField] - a[sortField]);

  return {
    best: sorted.slice(0, limit),
    worst: sorted.slice(-limit).reverse(),
  };
}

/**
 * Get market summary / IHSG overview
 */
function getMarketSummary(stocks) {
  const advancing = stocks.filter(s => s.changePercent > 0).length;
  const declining = stocks.filter(s => s.changePercent < 0).length;
  const unchanged = stocks.filter(s => s.changePercent === 0).length;
  const araStocks = stocks.filter(s => s.isARA);
  const arbStocks = stocks.filter(s => s.isARB);

  const totalValue = stocks.reduce((sum, s) => sum + s.value, 0);
  const totalVolume = stocks.reduce((sum, s) => sum + s.volume, 0);
  const totalForeignNet = stocks.reduce((sum, s) => sum + s.foreignNet, 0);

  const daySeed = getDaySeed();
  const ihsgBase = 7200;
  const ihsgChange = (seededRandom(daySeed + 999) - 0.45) * 150;
  const ihsgValue = Math.round((ihsgBase + ihsgChange) * 100) / 100;
  const ihsgPct = Math.round(ihsgChange / ihsgBase * 10000) / 100;

  // Sector performance
  const sectors = {};
  stocks.forEach(s => {
    if (!sectors[s.sector]) {
      sectors[s.sector] = { totalChange: 0, count: 0 };
    }
    sectors[s.sector].totalChange += s.changePercent;
    sectors[s.sector].count++;
  });

  const sectorPerformance = Object.entries(sectors).map(([name, data]) => ({
    name,
    avgChange: Math.round(data.totalChange / data.count * 100) / 100,
    stockCount: data.count,
  })).sort((a, b) => b.avgChange - a.avgChange);

  return {
    ihsg: {
      value: ihsgValue,
      change: Math.round(ihsgChange * 100) / 100,
      changePercent: ihsgPct,
    },
    advancing,
    declining,
    unchanged,
    araCount: araStocks.length,
    arbCount: arbStocks.length,
    araStocks: araStocks.map(s => s.ticker),
    arbStocks: arbStocks.map(s => s.ticker),
    totalValue,
    totalVolume,
    totalForeignNet,
    sectorPerformance,
    lastUpdate: new Date().toISOString(),
  };
}

function getLastSourceMeta() {
  return lastSourceMeta;
}

module.exports = {
  fetchAllStockData,
  getRankedStocks,
  getMarketSummary,
  getLastSourceMeta,
  IDX_STOCKS,
};
