/**
 * IDX SUPERCOMPUTER DASHBOARD - Frontend Application
 * Bloomberg Terminal / Stockbit / Ajaib Inspired
 */

// ==========================================
// STATE
// ==========================================
let allStocks = [];
let allNews = [];
let marketSummary = {};
let kkData = {}; // Koneksi & Kultur intelligence data
let stockSourceMeta = {};
let currentView = 'overview';
let currentTimeframe = 'daily';
let currentNewsFilter = 'all';
let currentKKTab = 'news';
let screenerSortOrder = 'desc';
let moversMode = 'gainers';

const API_BASE = '';

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 1000);
  loadAllData();
});

async function loadAllData() {
  try {
    const [stocksRes, summaryRes, newsRes, sectorsRes, kkRes] = await Promise.all([
      fetch(`${API_BASE}/api/stocks`),
      fetch(`${API_BASE}/api/market-summary`),
      fetch(`${API_BASE}/api/news`),
      fetch(`${API_BASE}/api/sectors`),
      fetch(`${API_BASE}/api/koneksi-kultur`),
    ]);

    const stocksData = await stocksRes.json();
    const summaryData = await summaryRes.json();
    const newsData = await newsRes.json();
    const sectorsData = await sectorsRes.json();
    const kkDataRes = await kkRes.json();

    allStocks = stocksData.data || [];
    stockSourceMeta = stocksData.source || summaryData.source || {};
    marketSummary = summaryData.data || {};
    allNews = newsData.data || [];
    kkData = kkDataRes.data || {};

    // Populate sector filter
    const sectorFilter = document.getElementById('sectorFilter');
    if (sectorFilter && sectorsData.data) {
      sectorFilter.innerHTML = '<option value="all">All Sectors</option>';
      sectorsData.data.forEach(s => {
        sectorFilter.innerHTML += `<option value="${s}">${s}</option>`;
      });
    }

    renderAll();
  } catch (err) {
    console.error('Failed to load data:', err);
  }
}

async function refreshAllData() {
  const btn = document.querySelector('.btn-refresh');
  if (btn) { btn.style.animation = 'spin 0.8s linear infinite'; }
  try {
    await fetch(`${API_BASE}/api/refresh`, { method: 'POST' });
    await loadAllData();
  } catch (err) {
    console.error('Refresh failed:', err);
  }
  if (btn) { btn.style.animation = ''; }
}

// ==========================================
// RENDER ALL VIEWS
// ==========================================
function renderAll() {
  renderMarketTicker();
  renderSummaryRow();
  renderIHSG();
  renderBreadth();
  renderSectorHeatmap();
  renderMovers();
  renderFlowPanel();
  renderAraArb();
  renderQuickNews();
  renderRankings();
  renderScreener();
  renderNewsGrid();
  // Koneksi & Kultur Intelligence
  renderPoliticalRisk();
  renderSocialSentiment();
  renderCulturalCatalysts();
  renderConglomerateMap();
  renderWealthTransfer();
  renderSupplyChain();
  renderInformalEconomy();
}

// ==========================================
// UTILITIES
// ==========================================
function formatNumber(num) {
  if (num === undefined || num === null) return '--';
  if (Math.abs(num) >= 1e12) return (num / 1e12).toFixed(1) + 'T';
  if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (Math.abs(num) >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toLocaleString('id-ID');
}

function formatPrice(price) {
  if (!price) return '--';
  return price.toLocaleString('id-ID');
}

function formatPct(pct) {
  if (pct === undefined || pct === null) return '--';
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}

function changeClass(val) {
  if (val > 0) return 'text-positive';
  if (val < 0) return 'text-negative';
  return 'text-muted';
}

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function updateClock() {
  const now = new Date();
  const opts = { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const dateOpts = { timeZone: 'Asia/Jakarta', weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  const timeStr = now.toLocaleTimeString('en-US', opts) + ' WIB';
  const dateStr = now.toLocaleDateString('en-US', dateOpts);
  const el = document.getElementById('datetime');
  if (el) el.textContent = `${dateStr} ${timeStr}`;
  const footer = document.getElementById('footerTime');
  if (footer) footer.textContent = `${dateStr} ${timeStr}`;
}

// ==========================================
// NAVIGATION
// ==========================================
function switchView(view) {
  currentView = view;
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  const activeTab = document.querySelector(`.nav-tab[data-view="${view}"]`);
  if (activeTab) activeTab.classList.add('active');
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const activeView = document.getElementById(`view-${view}`);
  if (activeView) activeView.classList.add('active');
}

// ==========================================
// SEARCH
// ==========================================
function handleSearch(query) {
  const results = document.getElementById('searchResults');
  if (!query || query.length < 1) {
    results.classList.remove('visible');
    return;
  }
  const q = query.toUpperCase();
  const matches = allStocks.filter(s =>
    s.ticker.includes(q) || s.name.toUpperCase().includes(q)
  ).slice(0, 8);

  if (matches.length === 0) {
    results.classList.remove('visible');
    return;
  }

  results.innerHTML = matches.map(s => `
    <div class="search-result-item" onclick="openStockModal('${s.ticker}')">
      <div>
        <span class="sr-ticker">${s.ticker}</span>
        <span class="sr-name"> — ${s.name}</span>
      </div>
      <span class="${changeClass(s.changePercent)}">${formatPct(s.changePercent)}</span>
    </div>
  `).join('');
  results.classList.add('visible');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-search')) {
    document.getElementById('searchResults').classList.remove('visible');
  }
});

// ==========================================
// MARKET TICKER (header scrolling)
// ==========================================
function renderMarketTicker() {
  const el = document.getElementById('marketTicker');
  if (!el || !marketSummary.ihsg) return;

  const ihsg = marketSummary.ihsg;
  const topGainers = [...allStocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 4);

  let html = `
    <div class="ticker-item">
      <span class="label">IHSG</span>
      <span class="value ${changeClass(ihsg.changePercent)}">${formatPrice(ihsg.value)}</span>
      <span class="${changeClass(ihsg.changePercent)}">${formatPct(ihsg.changePercent)}</span>
    </div>
  `;

  topGainers.forEach(s => {
    html += `
      <div class="ticker-item">
        <span class="label">${s.ticker}</span>
        <span class="value">${formatPrice(s.currentPrice)}</span>
        <span class="${changeClass(s.changePercent)}">${formatPct(s.changePercent)}</span>
      </div>
    `;
  });

  el.innerHTML = html;
}

// ==========================================
// SUMMARY ROW
// ==========================================
function renderSummaryRow() {
  const el = document.getElementById('summaryRow');
  if (!el || !marketSummary.ihsg) return;

  const ms = marketSummary;
  el.innerHTML = `
    <div class="summary-card">
      <div class="sc-label">TOTAL VALUE</div>
      <div class="sc-value text-cyan">Rp${formatNumber(ms.totalValue)}M</div>
      <div class="sc-sub">Trading Value Today</div>
    </div>
    <div class="summary-card">
      <div class="sc-label">ADVANCING</div>
      <div class="sc-value text-positive">${ms.advancing}</div>
      <div class="sc-sub">Stocks Up</div>
    </div>
    <div class="summary-card">
      <div class="sc-label">DECLINING</div>
      <div class="sc-value text-negative">${ms.declining}</div>
      <div class="sc-sub">Stocks Down</div>
    </div>
    <div class="summary-card">
      <div class="sc-label">ARA / ARB</div>
      <div class="sc-value"><span class="text-positive">${ms.araCount}</span> / <span class="text-negative">${ms.arbCount}</span></div>
      <div class="sc-sub">Auto Rejection Hits</div>
    </div>
    <div class="summary-card">
      <div class="sc-label">FOREIGN NET</div>
      <div class="sc-value ${changeClass(ms.totalForeignNet)}">Rp${formatNumber(Math.abs(ms.totalForeignNet))}M</div>
      <div class="sc-sub">${ms.totalForeignNet >= 0 ? 'Net Buy' : 'Net Sell'}</div>
    </div>
    <div class="summary-card">
      <div class="sc-label">TOTAL VOLUME</div>
      <div class="sc-value">${formatNumber(ms.totalVolume)}</div>
      <div class="sc-sub">Shares Traded</div>
    </div>
  `;
}

// ==========================================
// IHSG DISPLAY
// ==========================================
function renderIHSG() {
  const el = document.getElementById('ihsgDisplay');
  const badge = document.getElementById('ihsgBadge');
  if (!el || !marketSummary.ihsg) return;

  const ihsg = marketSummary.ihsg;
  const cls = changeClass(ihsg.changePercent);

  el.innerHTML = `
    <div class="ihsg-value ${cls}">${ihsg.value.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</div>
    <div class="ihsg-change ${cls}">${ihsg.change >= 0 ? '+' : ''}${ihsg.change.toFixed(2)} (${formatPct(ihsg.changePercent)})</div>
  `;

  if (badge) {
    badge.className = `badge ${ihsg.changePercent >= 0 ? 'badge-positive' : 'badge-negative'}`;
    badge.textContent = ihsg.changePercent >= 0 ? '▲ BULLISH' : '▼ BEARISH';
  }
}

// ==========================================
// MARKET BREADTH BAR
// ==========================================
function renderBreadth() {
  const el = document.getElementById('breadthBar');
  if (!el || !marketSummary.advancing) return;

  const ms = marketSummary;
  const total = ms.advancing + ms.declining + ms.unchanged;
  const advPct = (ms.advancing / total * 100).toFixed(1);
  const uncPct = (ms.unchanged / total * 100).toFixed(1);
  const decPct = (ms.declining / total * 100).toFixed(1);

  el.innerHTML = `
    <div class="breadth-visual">
      <div class="breadth-adv" style="width: ${advPct}%"></div>
      <div class="breadth-unc" style="width: ${uncPct}%"></div>
      <div class="breadth-dec" style="width: ${decPct}%"></div>
    </div>
    <div class="breadth-labels">
      <span class="text-positive">▲ ${ms.advancing} (${advPct}%)</span>
      <span class="text-muted">— ${ms.unchanged}</span>
      <span class="text-negative">▼ ${ms.declining} (${decPct}%)</span>
    </div>
  `;
}

// ==========================================
// SECTOR HEATMAP
// ==========================================
function renderSectorHeatmap() {
  const el = document.getElementById('sectorHeatmap');
  if (!el || !marketSummary.sectorPerformance) return;

  el.innerHTML = marketSummary.sectorPerformance.map(s => {
    const intensity = Math.min(Math.abs(s.avgChange) * 15, 60);
    const bgColor = s.avgChange >= 0
      ? `rgba(16, 185, 129, ${intensity / 100})`
      : `rgba(239, 68, 68, ${intensity / 100})`;
    const textColor = s.avgChange >= 0 ? 'var(--positive)' : 'var(--negative)';

    return `
      <div class="sector-cell" style="background: ${bgColor}">
        <div class="sc-name">${s.name}</div>
        <div class="sc-pct" style="color: ${textColor}">${formatPct(s.avgChange)}</div>
      </div>
    `;
  }).join('');
}

// ==========================================
// TOP MOVERS
// ==========================================
function toggleMovers(mode) {
  moversMode = mode;
  document.querySelectorAll('.panel-movers .toggle').forEach(t => t.classList.remove('active'));
  document.querySelector(`.panel-movers .toggle:${mode === 'gainers' ? 'first-child' : 'last-child'}`).classList.add('active');
  renderMovers();
}

function renderMovers() {
  const el = document.getElementById('moversTable');
  if (!el) return;

  const sorted = [...allStocks].sort((a, b) =>
    moversMode === 'gainers'
      ? b.changePercent - a.changePercent
      : a.changePercent - b.changePercent
  ).slice(0, 15);

  el.innerHTML = sorted.map(s => `
    <div class="mover-row" onclick="openStockModal('${s.ticker}')">
      <span class="ticker">${s.ticker}</span>
      <span class="name">${s.name}</span>
      <span class="price">${formatPrice(s.currentPrice)}</span>
      <span class="change ${changeClass(s.changePercent)}">${formatPct(s.changePercent)}</span>
      <span class="volume">${formatNumber(s.volume)}</span>
    </div>
  `).join('');
}

// ==========================================
// MONEY FLOW PANEL
// ==========================================
function renderFlowPanel() {
  const summaryEl = document.getElementById('flowSummary');
  const tableEl = document.getElementById('flowTable');
  if (!summaryEl || !tableEl) return;

  const totalForeignBuy = allStocks.reduce((s, x) => s + x.foreignBuy, 0);
  const totalForeignSell = allStocks.reduce((s, x) => s + x.foreignSell, 0);
  const totalForeignNet = totalForeignBuy - totalForeignSell;
  const avgBandar = Math.round(allStocks.reduce((s, x) => s + x.bandarScore, 0) / allStocks.length);

  summaryEl.innerHTML = `
    <div class="flow-card" style="background: ${totalForeignNet >= 0 ? 'var(--positive-bg)' : 'var(--negative-bg)'}">
      <div class="fc-label">FOREIGN NET FLOW</div>
      <div class="fc-value ${changeClass(totalForeignNet)}">Rp${formatNumber(Math.abs(totalForeignNet))}M</div>
    </div>
    <div class="flow-card" style="background: var(--accent-cyan-dim)">
      <div class="fc-label">AVG BANDAR SCORE</div>
      <div class="fc-value text-cyan">${avgBandar}/100</div>
    </div>
  `;

  // Top foreign net buy stocks
  const topForeign = [...allStocks].sort((a, b) => b.foreignNet - a.foreignNet).slice(0, 10);
  tableEl.innerHTML = `
    <div class="flow-row" style="font-weight:600; color: var(--text-muted); font-size:9px; border-bottom: 1px solid var(--border-secondary);">
      <span>TICKER</span>
      <span>SECTOR</span>
      <span style="text-align:right">FOREIGN NET</span>
      <span style="text-align:right">BANDAR</span>
    </div>
    ${topForeign.map(s => `
      <div class="flow-row" style="cursor:pointer" onclick="openStockModal('${s.ticker}')">
        <span class="ticker">${s.ticker}</span>
        <span style="color:var(--text-tertiary)">${s.sector}</span>
        <span style="text-align:right" class="${changeClass(s.foreignNet)}">${s.foreignNet >= 0 ? '+' : ''}${formatNumber(s.foreignNet)}M</span>
        <span style="text-align:right; color:var(--accent-cyan)">${s.bandarScore}</span>
      </div>
    `).join('')}
  `;
}

// ==========================================
// ARA/ARB MONITOR
// ==========================================
function renderAraArb() {
  const el = document.getElementById('araArbList');
  if (!el || !marketSummary.araStocks) return;

  const araStocks = marketSummary.araStocks || [];
  const arbStocks = marketSummary.arbStocks || [];

  el.innerHTML = `
    <div class="ara-arb-section">
      <div class="ara-arb-title">
        <span class="text-positive">▲</span> ARA (Auto Rejection Atas) — ${araStocks.length} stocks
      </div>
      <div class="ara-arb-chips">
        ${araStocks.length > 0
          ? araStocks.map(t => `<span class="ara-chip" onclick="openStockModal('${t}')">${t}</span>`).join('')
          : '<span class="no-items">No stocks at ARA today</span>'
        }
      </div>
    </div>
    <div class="ara-arb-section" style="margin-top:14px">
      <div class="ara-arb-title">
        <span class="text-negative">▼</span> ARB (Auto Rejection Bawah) — ${arbStocks.length} stocks
      </div>
      <div class="ara-arb-chips">
        ${arbStocks.length > 0
          ? arbStocks.map(t => `<span class="arb-chip" onclick="openStockModal('${t}')">${t}</span>`).join('')
          : '<span class="no-items">No stocks at ARB today</span>'
        }
      </div>
    </div>
  `;
}

// ==========================================
// QUICK NEWS (overview sidebar)
// ==========================================
function renderQuickNews() {
  const el = document.getElementById('newsScroll');
  if (!el) return;

  const recentNews = allNews.slice(0, 12);
  el.innerHTML = recentNews.map(n => `
    <div class="news-item">
      <div class="ni-meta">
        <span class="ni-source">${n.source}</span>
        <span class="ni-category impact-${n.impact}">${n.category}</span>
        <span class="ni-time">${timeAgo(n.publishedAt)}</span>
      </div>
      <div class="ni-title">${n.title}</div>
      <div class="ni-tickers">
        ${n.relatedTickers.map(t => `<span class="ni-ticker-tag" onclick="openStockModal('${t}')">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// ==========================================
// RANKINGS VIEW
// ==========================================
function switchTimeframe(tf) {
  currentTimeframe = tf;
  document.querySelectorAll('.tf-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tf-tab').forEach(t => {
    if (t.textContent.toLowerCase().includes(tf.slice(0, 4))) t.classList.add('active');
  });
  renderRankings();
}

async function renderRankings() {
  const bestEl = document.getElementById('bestRankingTable');
  const worstEl = document.getElementById('worstRankingTable');
  const bestLabel = document.getElementById('bestLabel');
  const worstLabel = document.getElementById('worstLabel');
  if (!bestEl || !worstEl) return;

  try {
    const res = await fetch(`${API_BASE}/api/rankings/${currentTimeframe}`);
    const data = await res.json();

    if (!data.success) return;

    const labels = {
      daily: { best: 'DAY TRADE PICKS', worst: 'AVOID FOR DAY TRADE' },
      weekly: { best: 'SWING TRADE PICKS', worst: 'WEEKLY UNDERPERFORMERS' },
      monthly: { best: 'MONTHLY TOP PICKS', worst: 'MONTHLY LAGGARDS' },
      quarterly: { best: 'QUARTERLY GROWTH', worst: 'QUARTERLY DECLINE' },
      yearly: { best: 'INVESTMENT GRADE', worst: 'YEARLY UNDERPERFORMERS' },
    };

    if (bestLabel) bestLabel.textContent = labels[currentTimeframe]?.best || 'TOP';
    if (worstLabel) worstLabel.textContent = labels[currentTimeframe]?.worst || 'BOTTOM';

    const scoreField = currentTimeframe === 'daily' ? 'dayTradeScore' :
                       currentTimeframe === 'yearly' ? 'investScore' :
                       `${currentTimeframe}Change`;

    const scoreLabel = currentTimeframe === 'daily' ? 'DT SCORE' :
                       currentTimeframe === 'yearly' ? 'INV SCORE' : 'CHG %';

    const renderTable = (stocks, el) => {
      el.innerHTML = `
        <div class="rank-header">
          <span>#</span>
          <span>TICKER</span>
          <span>NAME</span>
          <span style="text-align:right">PRICE</span>
          <span style="text-align:right">CHG %</span>
          <span style="text-align:center">${scoreLabel}</span>
          <span style="text-align:right">VOL</span>
          <span style="text-align:right">FRGN NET</span>
        </div>
        ${stocks.map((s, i) => {
          const score = s[scoreField];
          const scoreColor = typeof score === 'number' ?
            (score >= 60 ? 'var(--positive)' : score >= 40 ? 'var(--warning)' : 'var(--negative)') :
            'var(--text-secondary)';
          const scoreDisplay = scoreField.includes('Change') ? formatPct(score) : score;

          return `
            <div class="rank-row" onclick="openStockModal('${s.ticker}')">
              <span class="rank-num">${i + 1}</span>
              <span class="rank-ticker">${s.ticker}</span>
              <span class="rank-name">${s.name}</span>
              <span class="rank-price">${formatPrice(s.currentPrice)}</span>
              <span class="rank-change ${changeClass(s.changePercent)}">${formatPct(s.changePercent)}</span>
              <span class="rank-score" style="color:${scoreColor}">${scoreDisplay}</span>
              <span class="rank-volume">${formatNumber(s.volume)}</span>
              <span class="rank-foreign ${changeClass(s.foreignNet)}">${formatNumber(s.foreignNet)}M</span>
            </div>
          `;
        }).join('')}
      `;
    };

    renderTable(data.data.best, bestEl);
    renderTable(data.data.worst, worstEl);
  } catch (err) {
    console.error('Failed to load rankings:', err);
  }
}

// ==========================================
// SCREENER VIEW
// ==========================================
function toggleSortOrder() {
  screenerSortOrder = screenerSortOrder === 'desc' ? 'asc' : 'desc';
  document.getElementById('sortOrderIcon').textContent = screenerSortOrder === 'desc' ? '▼' : '▲';
  applyScreenerFilters();
}

async function applyScreenerFilters() {
  const sector = document.getElementById('sectorFilter').value;
  const sort = document.getElementById('sortFilter').value;

  try {
    const res = await fetch(`${API_BASE}/api/stocks?sector=${sector}&sort=${sort}&order=${screenerSortOrder}`);
    const data = await res.json();
    if (data.success) {
      renderScreenerTable(data.data);
    }
  } catch (err) {
    console.error('Screener filter failed:', err);
  }
}

function renderScreener() {
  const sourceEl = document.getElementById('screenerSourceMeta');
  if (sourceEl) {
    const provider = stockSourceMeta.provider || 'Unknown source';
    const fileName = stockSourceMeta.fileName || '-';
    const fileUrl = stockSourceMeta.fileUrl;
    sourceEl.innerHTML = fileUrl
      ? `Source: <strong>${provider}</strong> · File: <a href="${fileUrl}" target="_blank" rel="noopener noreferrer">${fileName}</a>`
      : `Source: <strong>${provider}</strong>`;
  }

  renderScreenerTable(allStocks);
}

function renderScreenerTable(stocks) {
  const body = document.getElementById('screenerBody');
  if (!body) return;

  body.innerHTML = stocks.map((s, i) => {
    const sourceBadge = s.dataQuality === 'official_idx' ? 'IDX' : 'Fallback';
    const sourceClass = s.dataQuality === 'official_idx' ? 'text-positive' : 'text-warning';
    const ref = s.referenceUrl || stockSourceMeta.fileUrl || stockSourceMeta.listingUrl || '#';

    return `
      <tr onclick="openStockModal('${s.ticker}')">
        <td>${i + 1}</td>
        <td>${s.ticker}</td>
        <td>${s.name}</td>
        <td>${formatPrice(s.open)}</td>
        <td>${formatPrice(s.high)}</td>
        <td>${formatPrice(s.low)}</td>
        <td>${formatPrice(s.currentPrice)}</td>
        <td>${formatPrice(s.prevClose)}</td>
        <td class="${changeClass(s.changePercent)}">${formatPct(s.changePercent)}</td>
        <td>${formatNumber(s.volume)}</td>
        <td>${formatNumber(s.value)}</td>
        <td>${formatPrice(s.bidPrice)}</td>
        <td>${formatPrice(s.askPrice)}</td>
        <td><a href="${ref}" target="_blank" rel="noopener noreferrer" class="${sourceClass}" onclick="event.stopPropagation()">${sourceBadge}</a></td>
      </tr>
    `;
  }).join('');
}

// ==========================================
// NEWS VIEW
// ==========================================
function filterNews(timeframe) {
  currentNewsFilter = timeframe;
  document.querySelectorAll('.nf-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nf-tab').forEach(t => {
    if (t.textContent.toLowerCase().includes(timeframe === 'all' ? 'all' : timeframe.slice(0, 4))) {
      t.classList.add('active');
    }
  });
  renderNewsGrid();
}

function renderNewsGrid() {
  const el = document.getElementById('newsGrid');
  if (!el) return;

  let filtered = allNews;
  if (currentNewsFilter !== 'all') {
    filtered = allNews.filter(n => n.timeframe === currentNewsFilter);
  }

  el.innerHTML = filtered.slice(0, 30).map(n => `
    <div class="news-card">
      <div class="nc-header">
        <span class="nc-source">${n.source}</span>
        <span class="nc-time">${timeAgo(n.publishedAt)}</span>
      </div>
      <span class="nc-category impact-${n.impact}">${n.category}</span>
      <span class="nc-sentiment sentiment-${n.sentiment}" style="margin-left:6px">${n.sentiment.toUpperCase()}</span>
      <div class="nc-title">${n.title}</div>
      <div class="nc-summary">${n.summary}</div>
      <div class="nc-tickers">
        ${n.relatedTickers.map(t => `<span class="ni-ticker-tag" onclick="event.stopPropagation(); openStockModal('${t}')">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// ==========================================
// STOCK DETAIL MODAL
// ==========================================
async function openStockModal(ticker) {
  const modal = document.getElementById('stockModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  // Close search
  document.getElementById('searchResults').classList.remove('visible');
  document.getElementById('searchInput').value = '';

  try {
    const res = await fetch(`${API_BASE}/api/stocks/${ticker}`);
    const data = await res.json();
    if (!data.success) return;

    const s = data.data;
    title.innerHTML = `<span class="text-cyan">${s.ticker}</span> — ${s.name} <span style="font-size:11px; color:var(--text-tertiary)">${s.sector}</span>`;

    // Mini intraday chart using CSS bars
    let chartHtml = '';
    if (s.intradayData && s.intradayData.length > 0) {
      const prices = s.intradayData.map(d => d.price);
      const minP = Math.min(...prices);
      const maxP = Math.max(...prices);
      const range = maxP - minP || 1;
      const step = Math.max(1, Math.floor(s.intradayData.length / 60));

      chartHtml = '<div class="mini-chart" style="width:100%; height:40px; margin: 8px 0;">';
      for (let i = 0; i < s.intradayData.length; i += step) {
        const d = s.intradayData[i];
        const h = Math.max(3, ((d.price - minP) / range) * 36);
        const color = d.price >= s.prevClose ? 'var(--positive)' : 'var(--negative)';
        chartHtml += `<div class="mini-bar" style="height:${h}px; background:${color}; flex:1; max-width:6px;"></div>`;
      }
      chartHtml += '</div>';
    }

    body.innerHTML = `
      <!-- Price Section -->
      <div style="text-align:center; padding: 12px 0; border-bottom: 1px solid var(--border-primary); margin-bottom:16px;">
        <div style="font-size:28px; font-weight:700;" class="${changeClass(s.changePercent)}">
          Rp ${formatPrice(s.currentPrice)}
        </div>
        <div style="font-size:14px; margin-top:4px;" class="${changeClass(s.changePercent)}">
          ${s.change >= 0 ? '+' : ''}${formatPrice(s.change)} (${formatPct(s.changePercent)})
        </div>
        ${chartHtml}
        <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted); margin-top:4px;">
          <span>O: ${formatPrice(s.open)}</span>
          <span>H: ${formatPrice(s.high)}</span>
          <span>L: ${formatPrice(s.low)}</span>
          <span>C: ${formatPrice(s.currentPrice)}</span>
        </div>
      </div>

      <div style="margin-bottom:12px; font-size:10px; color:var(--text-muted);">
        Source: ${s.referenceUrl ? `<a href="${s.referenceUrl}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-cyan)">IDX Stock Summary</a>` : 'Synthetic fallback'}
        ${s.idxDate ? ` · Trade Date: ${new Date(s.idxDate).toLocaleDateString('en-GB')}` : ''}
      </div>

      <div class="modal-grid">
        <!-- Left Column -->
        <div>
          <!-- Trading Data -->
          <div class="modal-section">
            <h4>TRADING DATA</h4>
            <div class="modal-metric"><span class="mm-label">Volume</span><span class="mm-value">${formatNumber(s.volume)}</span></div>
            <div class="modal-metric"><span class="mm-label">Avg Volume</span><span class="mm-value">${formatNumber(s.avgVolume)}</span></div>
            <div class="modal-metric"><span class="mm-label">Volume Ratio</span><span class="mm-value">${s.volumeRatio}x</span></div>
            <div class="modal-metric"><span class="mm-label">Value</span><span class="mm-value">Rp${formatNumber(s.value)}M</span></div>
            <div class="modal-metric"><span class="mm-label">Bid</span><span class="mm-value">${formatPrice(s.bidPrice)} (${formatNumber(s.bidVol)})</span></div>
            <div class="modal-metric"><span class="mm-label">Ask</span><span class="mm-value">${formatPrice(s.askPrice)} (${formatNumber(s.askVol)})</span></div>
            <div class="modal-metric"><span class="mm-label">Spread</span><span class="mm-value">${s.spread} bps</span></div>
          </div>

          <!-- HAKA / HAKI -->
          <div class="modal-section">
            <h4>HAKA / HAKI ANALYSIS</h4>
            <div class="modal-metric"><span class="mm-label">HAKA Score (Buy Pressure)</span><span class="mm-value ${s.hakaScore >= 60 ? 'text-positive' : ''}">${s.hakaScore}/100</span></div>
            <div class="modal-metric"><span class="mm-label">HAKI Score (Sell Pressure)</span><span class="mm-value ${s.hakiScore >= 60 ? 'text-negative' : ''}">${s.hakiScore}/100</span></div>
            <div class="modal-metric"><span class="mm-label">HAKA/HAKI Ratio</span><span class="mm-value">${s.hakaHakiRatio}</span></div>
            <div style="margin-top:8px;">
              <div style="display:flex; height:6px; border-radius:3px; overflow:hidden;">
                <div style="width:${s.hakaScore}%; background:var(--positive)"></div>
                <div style="flex:1; background:var(--negative)"></div>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:9px; margin-top:3px;">
                <span class="text-positive">HAKA ${s.hakaScore}%</span>
                <span class="text-negative">HAKI ${s.hakiScore}%</span>
              </div>
            </div>
          </div>

          <!-- ARA / ARB -->
          <div class="modal-section">
            <h4>ARA / ARB LEVELS</h4>
            <div class="modal-metric"><span class="mm-label">ARA Price</span><span class="mm-value text-positive">${formatPrice(s.araPrice)}</span></div>
            <div class="modal-metric"><span class="mm-label">Distance to ARA</span><span class="mm-value">${s.distanceToARA}%</span></div>
            <div class="modal-metric"><span class="mm-label">ARB Price</span><span class="mm-value text-negative">${formatPrice(s.arbPrice)}</span></div>
            <div class="modal-metric"><span class="mm-label">Distance to ARB</span><span class="mm-value">${s.distanceToARB}%</span></div>
            ${s.isARA ? '<div style="margin-top:6px; padding:4px 8px; background:var(--positive-dim); color:var(--positive); border-radius:3px; font-size:10px; text-align:center;">⚡ AT ARA - UPPER LIMIT HIT</div>' : ''}
            ${s.isARB ? '<div style="margin-top:6px; padding:4px 8px; background:var(--negative-dim); color:var(--negative); border-radius:3px; font-size:10px; text-align:center;">⚡ AT ARB - LOWER LIMIT HIT</div>' : ''}
          </div>

          <!-- Technical -->
          <div class="modal-section">
            <h4>TECHNICAL INDICATORS</h4>
            <div class="modal-metric"><span class="mm-label">RSI (14)</span><span class="mm-value ${s.rsi > 70 ? 'text-negative' : s.rsi < 30 ? 'text-positive' : ''}">${s.rsi} ${s.rsi > 70 ? '(Overbought)' : s.rsi < 30 ? '(Oversold)' : ''}</span></div>
            <div class="modal-metric"><span class="mm-label">MACD</span><span class="mm-value ${changeClass(s.macd)}">${s.macd}</span></div>
            <div class="modal-metric"><span class="mm-label">SMA 20</span><span class="mm-value">${formatPrice(s.sma20)}</span></div>
            <div class="modal-metric"><span class="mm-label">SMA 50</span><span class="mm-value">${formatPrice(s.sma50)}</span></div>
            <div class="modal-metric"><span class="mm-label">SMA 200</span><span class="mm-value">${formatPrice(s.sma200)}</span></div>
          </div>
        </div>

        <!-- Right Column -->
        <div>
          <!-- Foreign Flow -->
          <div class="modal-section">
            <h4>FOREIGN FLOW</h4>
            <div class="modal-metric"><span class="mm-label">Foreign Buy</span><span class="mm-value text-positive">Rp${formatNumber(s.foreignBuy)}M</span></div>
            <div class="modal-metric"><span class="mm-label">Foreign Sell</span><span class="mm-value text-negative">Rp${formatNumber(s.foreignSell)}M</span></div>
            <div class="modal-metric"><span class="mm-label">Foreign Net</span><span class="mm-value ${changeClass(s.foreignNet)}">Rp${formatNumber(s.foreignNet)}M</span></div>
            <div class="modal-metric"><span class="mm-label">Foreign % of Volume</span><span class="mm-value">${s.foreignPctOfVolume}%</span></div>
          </div>

          <!-- Bandar Activity -->
          <div class="modal-section">
            <h4>BANDAR (MARKET MAKER) ACTIVITY</h4>
            <div class="modal-metric"><span class="mm-label">Bandar Score</span><span class="mm-value text-cyan">${s.bandarScore}/100</span></div>
            <div class="modal-metric"><span class="mm-label">Accumulation Signal</span><span class="mm-value ${changeClass(s.bandarAccumulation)}">${s.bandarAccumulation > 0 ? 'ACCUMULATING' : 'DISTRIBUTING'}</span></div>
            <div style="margin-top:8px; padding:6px; background: var(--bg-secondary); border-radius:3px;">
              <div style="font-size:9px; color:var(--text-muted); margin-bottom:4px;">BANDAR ACTIVITY GAUGE</div>
              <div style="display:flex; height:8px; background:var(--bg-primary); border-radius:4px; overflow:hidden;">
                <div style="width:${s.bandarScore}%; background: linear-gradient(90deg, var(--accent-blue-dim), var(--accent-cyan)); border-radius:4px;"></div>
              </div>
            </div>
          </div>

          <!-- Fundamental -->
          <div class="modal-section">
            <h4>FUNDAMENTALS</h4>
            <div class="modal-metric"><span class="mm-label">Market Cap</span><span class="mm-value">Rp${formatNumber(s.marketCap)}B</span></div>
            <div class="modal-metric"><span class="mm-label">PER</span><span class="mm-value">${s.per}x</span></div>
            <div class="modal-metric"><span class="mm-label">PBV</span><span class="mm-value">${s.pbv}x</span></div>
            <div class="modal-metric"><span class="mm-label">ROE</span><span class="mm-value">${s.roe}%</span></div>
            <div class="modal-metric"><span class="mm-label">DER</span><span class="mm-value">${s.der}x</span></div>
            <div class="modal-metric"><span class="mm-label">Dividend Yield</span><span class="mm-value text-positive">${s.dividendYield}%</span></div>
          </div>

          <!-- Multi-Timeframe Performance -->
          <div class="modal-section">
            <h4>MULTI-TIMEFRAME PERFORMANCE</h4>
            <div class="modal-metric"><span class="mm-label">Daily</span><span class="mm-value ${changeClass(s.dailyChange)}">${formatPct(s.dailyChange)}</span></div>
            <div class="modal-metric"><span class="mm-label">Weekly</span><span class="mm-value ${changeClass(s.weeklyChange)}">${formatPct(s.weeklyChange)}</span></div>
            <div class="modal-metric"><span class="mm-label">Monthly</span><span class="mm-value ${changeClass(s.monthlyChange)}">${formatPct(s.monthlyChange)}</span></div>
            <div class="modal-metric"><span class="mm-label">Quarterly</span><span class="mm-value ${changeClass(s.quarterlyChange)}">${formatPct(s.quarterlyChange)}</span></div>
            <div class="modal-metric"><span class="mm-label">Yearly</span><span class="mm-value ${changeClass(s.yearlyChange)}">${formatPct(s.yearlyChange)}</span></div>
          </div>

          <!-- Composite Scores -->
          <div class="modal-section">
            <h4>COMPOSITE SCORES</h4>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <div style="padding:10px; background:var(--bg-secondary); border-radius:4px; text-align:center;">
                <div style="font-size:9px; color:var(--text-muted); letter-spacing:1px;">DAY TRADE</div>
                <div style="font-size:22px; font-weight:700; margin-top:4px;" class="${s.dayTradeScore >= 60 ? 'text-positive' : s.dayTradeScore >= 40 ? 'text-warning' : 'text-negative'}">${s.dayTradeScore}</div>
              </div>
              <div style="padding:10px; background:var(--bg-secondary); border-radius:4px; text-align:center;">
                <div style="font-size:9px; color:var(--text-muted); letter-spacing:1px;">INVESTMENT</div>
                <div style="font-size:22px; font-weight:700; margin-top:4px;" class="${s.investScore >= 60 ? 'text-positive' : s.investScore >= 40 ? 'text-warning' : 'text-negative'}">${s.investScore}</div>
              </div>
            </div>
          </div>

          <!-- Top Brokers -->
          <div class="modal-section">
            <h4>TOP 5 BROKERS</h4>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div>
                <div style="font-size:9px; color:var(--positive); margin-bottom:4px; letter-spacing:1px;">BUY SIDE</div>
                <table class="broker-table">
                  ${s.topBuyBrokers.map(b => `
                    <tr>
                      <td class="bt-code">${b.code}</td>
                      <td class="bt-name">${b.name}</td>
                      <td class="bt-vol">${formatNumber(b.volume)}</td>
                    </tr>
                  `).join('')}
                </table>
              </div>
              <div>
                <div style="font-size:9px; color:var(--negative); margin-bottom:4px; letter-spacing:1px;">SELL SIDE</div>
                <table class="broker-table">
                  ${s.topSellBrokers.map(b => `
                    <tr>
                      <td class="bt-code">${b.code}</td>
                      <td class="bt-name">${b.name}</td>
                      <td class="bt-vol">${formatNumber(b.volume)}</td>
                    </tr>
                  `).join('')}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('visible');
  } catch (err) {
    console.error('Failed to load stock detail:', err);
  }
}

function closeModal(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('stockModal').classList.remove('visible');
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('stockModal').classList.remove('visible');
  }
});

// ==========================================
// KONEKSI & KULTUR TAB SWITCHING
// ==========================================
function switchKKTab(tab) {
  currentKKTab = tab;
  document.querySelectorAll('.kk-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.kk-tab').forEach(t => {
    if (t.textContent.toLowerCase().includes(tab.slice(0, 5))) t.classList.add('active');
  });
  document.querySelectorAll('.kk-section').forEach(s => s.classList.remove('active'));
  const section = document.getElementById(`kk-${tab}`);
  if (section) section.classList.add('active');
}

// ==========================================
// POLITICAL RISK RADAR
// ==========================================
function renderPoliticalRisk() {
  if (!kkData.politicalRisk) return;
  const pr = kkData.politicalRisk;

  // Risk level badge
  const badge = document.getElementById('riskLevelBadge');
  if (badge) {
    badge.textContent = pr.overallRiskLevel;
    badge.className = `badge ${pr.overallRiskLevel === 'ELEVATED' ? 'badge-negative' : 'badge-positive'}`;
  }

  // Regulatory radar
  const regEl = document.getElementById('regulatoryRadar');
  if (regEl) {
    regEl.innerHTML = `<div style="max-height:420px; overflow-y:auto;">
      ${pr.regulatoryImpacts.sort((a, b) => b.probability - a.probability).map(r => `
        <div class="reg-item">
          <div class="ri-name">${r.name}</div>
          <div class="ri-meta">
            <span class="impact-${r.impact > 70 ? 'high' : r.impact > 40 ? 'medium' : 'low'}" style="padding:1px 6px; border-radius:2px; font-size:8px;">IMPACT: ${r.impact}</span>
            <span style="color:${r.direction === 'positive' ? 'var(--positive)' : r.direction === 'negative' ? 'var(--negative)' : 'var(--warning)'}">
              ${r.direction === 'positive' ? '▲' : r.direction === 'negative' ? '▼' : '◆'} ${r.direction.toUpperCase()}
            </span>
            <span style="color:var(--text-muted)">${r.timeline}</span>
          </div>
          <div class="prob-bar">
            <div class="prob-bar-track">
              <div class="prob-bar-fill" style="width:${r.probability}%; background:${r.probability > 60 ? 'var(--negative)' : r.probability > 40 ? 'var(--warning)' : 'var(--positive)'}"></div>
            </div>
            <span class="prob-bar-label">${r.probability}%</span>
          </div>
          <div class="ri-sectors" style="margin-top:6px">
            ${r.affectedStocks.map(t => `<span class="reg-chip" style="color:var(--accent-cyan); cursor:pointer" onclick="openStockModal('${t}')">${t}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>`;
  }

  // Tender monitor
  const tenderEl = document.getElementById('tenderMonitor');
  if (tenderEl) {
    tenderEl.innerHTML = `<div style="max-height:420px; overflow-y:auto;">
      ${pr.activeTenders.map(t => `
        <div class="tender-item">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div class="ti-name">${t.name}</div>
            <span class="anomaly-flag anomaly-${t.anomalyFlag}">${t.anomalyFlag === 'HIGH' ? '⚠ ANOMALY' : t.anomalyFlag}</span>
          </div>
          <div class="ti-ministry">${t.ministry}</div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
            <span class="ti-value">Rp${formatNumber(t.value)}B</span>
            <span class="reg-chip">${t.status}</span>
          </div>
          <div class="ti-winners">
            <div style="font-size:9px; color:var(--text-muted); margin-bottom:3px;">LIKELY WINNERS:</div>
            ${t.likelyWinners.map(w => `
              <div style="display:flex; align-items:center; gap:6px; padding:2px 0;">
                <span style="color:var(--accent-cyan); font-weight:600; cursor:pointer; font-size:10px;" onclick="openStockModal('${w.ticker}')">${w.ticker}</span>
                <div class="prob-bar" style="flex:1">
                  <div class="prob-bar-track">
                    <div class="prob-bar-fill" style="width:${w.winProbability}%; background:var(--accent-cyan);"></div>
                  </div>
                  <span class="prob-bar-label" style="color:var(--accent-cyan)">${w.winProbability}%</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>`;
  }

  // Political connection heatmap
  const heatEl = document.getElementById('politicalHeatmap');
  if (heatEl) {
    const connections = pr.connectionMap;
    const sorted = Object.entries(connections)
      .sort((a, b) => a[1].politicalTier - b[1].politicalTier);

    heatEl.innerHTML = `<div style="max-height:420px; overflow-y:auto;">
      <div style="display:grid; grid-template-columns:45px 55px 45px 50px 1fr; gap:6px; padding:4px; font-size:9px; color:var(--text-muted); border-bottom:1px solid var(--border-secondary);">
        <span>TIER</span><span>TICKER</span><span>GOV</span><span>REG.CAP</span><span>CONGLOMERATE</span>
      </div>
      ${sorted.map(([ticker, c]) => `
        <div style="display:grid; grid-template-columns:45px 55px 45px 50px 1fr; gap:6px; padding:5px 4px; font-size:10px; border-bottom:1px solid var(--border-primary); align-items:center; cursor:pointer;" onclick="openStockModal('${ticker}')">
          <span><span class="tier-badge tier-${c.politicalTier}">${c.politicalTier}</span></span>
          <span style="font-weight:600; color:var(--accent-cyan)">${ticker}</span>
          <span>${c.governmentContracts}</span>
          <span style="color:${c.regulatoryCapture > 60 ? 'var(--warning)' : 'var(--text-tertiary)'}">${c.regulatoryCapture}</span>
          <span style="color:var(--text-tertiary); font-size:9px">${c.conglomerate || '—'} ${c.bumnConnection ? '<span style="color:var(--accent-cyan)">BUMN</span>' : ''}</span>
        </div>
      `).join('')}
    </div>`;
  }
}

// ==========================================
// SOCIAL SENTIMENT FUSION
// ==========================================
function renderSocialSentiment() {
  if (!kkData.socialSentiment) return;
  const ss = kkData.socialSentiment;

  // Influencer tracker
  const infEl = document.getElementById('influencerTracker');
  if (infEl) {
    infEl.innerHTML = `<div style="max-height:400px; overflow-y:auto;">
      ${ss.influencerAlerts.map(a => `
        <div class="influencer-item">
          <div class="ii-header">
            <span class="ii-name">${a.influencer}</span>
            <span class="ii-platform">${a.platform}</span>
          </div>
          <div class="ii-topic">${a.topic} → <span style="color:var(--accent-cyan); font-weight:600; cursor:pointer" onclick="openStockModal('${a.ticker}')">${a.ticker}</span></div>
          <div style="display:flex; gap:8px; font-size:9px; align-items:center;">
            <span class="sentiment-${a.sentiment}" style="padding:1px 6px; border-radius:2px; font-size:8px;">${a.sentiment.toUpperCase()}</span>
            <span style="color:var(--text-muted)">${formatNumber(a.engagement)} engagement</span>
            <span style="color:var(--text-muted)">${a.hoursAgo}h ago</span>
            <span style="color:var(--accent-cyan)">Viral: ${a.viralScore}/100</span>
          </div>
        </div>
      `).join('')}
    </div>`;
  }

  // Retail chatter
  const chatEl = document.getElementById('retailChatter');
  if (chatEl) {
    const topMentions = Object.entries(ss.retailSentiment)
      .sort((a, b) => b[1].mentionCount - a[1].mentionCount)
      .slice(0, 15);

    chatEl.innerHTML = `<div style="max-height:400px; overflow-y:auto;">
      <div style="font-size:9px; color:var(--text-muted); padding:4px; margin-bottom:8px; border-bottom:1px solid var(--border-secondary);">
        TOP MENTIONED STOCKS IN FORUMS, TELEGRAM, WARUNG KOPI
      </div>
      ${topMentions.map(([ticker, data]) => `
        <div style="display:flex; align-items:center; gap:8px; padding:6px 4px; border-bottom:1px solid var(--border-primary); cursor:pointer;" onclick="openStockModal('${ticker}')">
          <span style="font-weight:600; color:var(--accent-cyan); min-width:50px;">${ticker}</span>
          <div style="flex:1;">
            <div style="display:flex; align-items:center; gap:4px;">
              <div class="prob-bar-track" style="flex:1">
                <div class="prob-bar-fill" style="width:${Math.min(Math.abs(data.sentimentScore), 100)}%; background:${data.sentimentScore > 0 ? 'var(--positive)' : 'var(--negative)'}"></div>
              </div>
              <span style="font-size:10px; font-weight:600; min-width:35px; text-align:right;" class="${data.sentimentScore > 0 ? 'text-positive' : 'text-negative'}">${data.sentimentScore > 0 ? '+' : ''}${data.sentimentScore}</span>
            </div>
          </div>
          <span style="font-size:9px; color:var(--text-muted); min-width:55px; text-align:right;">${formatNumber(data.mentionCount)} mentions</span>
          <span style="font-size:9px; color:${data.trendDirection === 'rising' ? 'var(--positive)' : 'var(--negative)'}">${data.trendDirection === 'rising' ? '▲' : '▼'}</span>
        </div>
      `).join('')}
    </div>`;
  }

  // Conglomerate drama
  const dramaEl = document.getElementById('conglomerateDrama');
  if (dramaEl) {
    const withEvents = ss.conglomerateDrama.filter(c => c.recentEvents.length > 0);
    dramaEl.innerHTML = `<div style="max-height:400px; overflow-y:auto;">
      ${withEvents.length === 0 ? '<div style="color:var(--text-muted); font-size:10px; padding:20px; text-align:center;">No major conglomerate events detected today</div>' : ''}
      ${withEvents.map(c => `
        <div style="padding:10px; border:1px solid var(--border-primary); border-radius:4px; margin-bottom:8px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-weight:700; font-size:12px;">${c.family}</span>
            <span style="font-size:9px; color:${c.sentimentTrend === 'improving' ? 'var(--positive)' : 'var(--negative)'}">
              ${c.sentimentTrend === 'improving' ? '▲' : '▼'} ${c.sentimentTrend}
            </span>
          </div>
          <div style="font-size:9px; color:var(--text-muted); margin-bottom:6px;">
            Media Score: ${c.mediaAttentionScore}/100 | Companies: ${c.companies.join(', ')}
          </div>
          ${c.recentEvents.map(e => `
            <div style="padding:4px 8px; background:var(--bg-primary); border-radius:3px; margin-bottom:3px; font-size:10px;">
              <span class="impact-${e.marketImpact}" style="padding:1px 4px; border-radius:2px; font-size:8px; margin-right:4px;">${e.marketImpact.toUpperCase()}</span>
              ${e.event} <span style="color:var(--text-muted)">(${e.daysAgo}d ago)</span>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>`;
  }

  // Gojek/Grab sentiment
  const gojekEl = document.getElementById('gojekSentiment');
  if (gojekEl) {
    const gs = ss.gojekGrabSentiment;
    gojekEl.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:12px;">
        <div style="padding:10px; background:var(--bg-secondary); border-radius:4px; text-align:center;">
          <div style="font-size:9px; color:var(--text-muted); letter-spacing:1px;">DEMAND INDEX</div>
          <div style="font-size:22px; font-weight:700; color:var(--accent-cyan); margin-top:2px;">${gs.overallDemand}</div>
          <div style="font-size:9px; color:${gs.demandTrend === 'increasing' ? 'var(--positive)' : 'var(--negative)'}">
            ${gs.demandTrend === 'increasing' ? '▲' : '▼'} ${gs.demandTrend}
          </div>
        </div>
        <div style="padding:10px; background:var(--bg-secondary); border-radius:4px; text-align:center;">
          <div style="font-size:9px; color:var(--text-muted); letter-spacing:1px;">CONSUMER CONFIDENCE</div>
          <div style="font-size:22px; font-weight:700; color:${gs.consumerConfidence > 60 ? 'var(--positive)' : 'var(--warning)'}; margin-top:2px;">${gs.consumerConfidence}</div>
          <div style="font-size:9px; color:var(--text-muted)">Forecast: ${gs.consumerSpendingForecast}</div>
        </div>
      </div>
      <div style="font-size:9px; color:var(--text-muted); letter-spacing:1px; margin-bottom:6px;">CATEGORY BREAKDOWN</div>
      ${gs.topCategories.map(cat => `
        <div style="display:flex; align-items:center; gap:8px; padding:5px 0; border-bottom:1px solid var(--border-primary);">
          <span style="font-size:10px; min-width:100px; color:var(--text-secondary)">${cat.name}</span>
          <div class="prob-bar-track" style="flex:1">
            <div class="prob-bar-fill" style="width:${50 + cat.change}%; background:${cat.change > 0 ? 'var(--positive)' : 'var(--negative)'}"></div>
          </div>
          <span style="font-size:10px; font-weight:600; color:${cat.change > 0 ? 'var(--positive)' : 'var(--negative)'}; min-width:40px; text-align:right;">${cat.change > 0 ? '+' : ''}${cat.change}%</span>
        </div>
      `).join('')}
      <div style="margin-top:10px; font-size:9px; color:var(--text-muted);">
        Avg Spend/Trip: Rp${formatNumber(gs.avgSpendPerTrip)} | Driver Earnings: <span class="${gs.driverEarningTrend === 'improving' ? 'text-positive' : 'text-negative'}">${gs.driverEarningTrend}</span>
      </div>
      <div style="margin-top:6px; display:flex; gap:3px; flex-wrap:wrap;">
        ${gs.affectedStocks.map(t => `<span class="reg-chip" style="color:var(--accent-cyan); cursor:pointer;" onclick="openStockModal('${t}')">${t}</span>`).join('')}
      </div>
    `;
  }
}

// ==========================================
// CULTURAL CATALYSTS
// ==========================================
function renderCulturalCatalysts() {
  if (!kkData.culturalCatalysts) return;
  const cc = kkData.culturalCatalysts;

  // Seasonal events
  const seEl = document.getElementById('seasonalEvents');
  if (seEl) {
    seEl.innerHTML = `<div style="max-height:420px; overflow-y:auto;">
      ${cc.seasonalEvents.map(e => `
        <div class="seasonal-card ${e.active ? 'active-event' : ''}">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="se-name">${e.event}</span>
            ${e.active ? '<span class="badge badge-positive">ACTIVE NOW</span>' : '<span class="badge" style="background:var(--bg-active); color:var(--text-muted);">UPCOMING</span>'}
          </div>
          <div class="se-impact">${e.impact}</div>
          <div style="display:flex; justify-content:space-between; font-size:9px; margin-bottom:6px;">
            <span style="color:var(--text-muted)">Historical Avg: <span class="text-positive">${e.historicalAvgReturn}</span></span>
            <span style="color:var(--accent-cyan)">Spending Index: ${e.spendingIndex}/100</span>
          </div>
          <div style="display:flex; gap:3px; flex-wrap:wrap;">
            ${e.beneficiaries.map(t => `<span class="reg-chip" style="color:var(--accent-cyan); cursor:pointer;" onclick="openStockModal('${t}')">${t}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>`;
  }

  // Viral alerts
  const viralEl = document.getElementById('viralAlerts');
  if (viralEl) {
    viralEl.innerHTML = `<div style="max-height:420px; overflow-y:auto;">
      ${cc.viralEvents.map(v => `
        <div class="viral-item ${v.riskLevel === 'HIGH' ? 'risk-HIGH' : ''}">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="vi-type">${v.type}</span>
            <div style="display:flex; gap:4px; align-items:center;">
              <span class="ii-platform">${v.platform}</span>
              ${v.riskLevel === 'HIGH' ? '<span class="anomaly-flag anomaly-HIGH">⚠ PUMP RISK</span>' : ''}
            </div>
          </div>
          <div class="vi-desc">${v.desc}</div>
          <div style="display:flex; gap:10px; font-size:9px; margin-top:6px; align-items:center;">
            <span style="color:var(--accent-cyan); font-weight:600; cursor:pointer;" onclick="openStockModal('${v.ticker}')">${v.ticker}</span>
            <span style="color:var(--text-muted)">${formatNumber(v.engagement)} reach</span>
            <span style="color:var(--text-muted)">${v.hoursAgo}h ago</span>
            <span class="${v.priceImpact >= 0 ? 'text-positive' : 'text-negative'}">${v.priceImpact >= 0 ? '+' : ''}${v.priceImpact}% price impact</span>
          </div>
        </div>
      `).join('')}
    </div>`;
  }

  // Regional pride
  const regEl = document.getElementById('regionalPride');
  if (regEl) {
    regEl.innerHTML = `<div style="max-height:420px; overflow-y:auto;">
      ${cc.regionalPride.map(r => `
        <div style="padding:10px; border:1px solid var(--border-primary); border-radius:4px; margin-bottom:8px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span style="font-weight:600; font-size:11px; color:var(--text-primary)">${r.region}</span>
            <span style="font-size:10px; color:var(--accent-cyan); font-weight:600;">${r.strength}/100</span>
          </div>
          <div style="font-size:9px; color:var(--text-muted); margin-bottom:4px;">${r.investorBase}</div>
          <div class="prob-bar" style="margin-bottom:6px;">
            <div class="prob-bar-track">
              <div class="prob-bar-fill" style="width:${r.strength}%; background:var(--accent-cyan);"></div>
            </div>
          </div>
          <div style="display:flex; gap:3px; flex-wrap:wrap;">
            ${r.favStocks.map(t => `<span class="reg-chip" style="color:var(--accent-cyan); cursor:pointer;" onclick="openStockModal('${t}')">${t}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>`;
  }

  // Campus hype
  const campEl = document.getElementById('campusHype');
  if (campEl) {
    campEl.innerHTML = `<div style="max-height:420px; overflow-y:auto;">
      <div style="font-size:9px; color:var(--text-muted); letter-spacing:1px; padding:4px; margin-bottom:8px; border-bottom:1px solid var(--border-secondary);">
        WHAT ARE INDONESIA'S TOP UNIVERSITY STUDENTS INVESTING IN?
      </div>
      ${cc.campusHype.map(c => `
        <div style="display:flex; align-items:center; gap:10px; padding:8px 4px; border-bottom:1px solid var(--border-primary);">
          <span style="font-size:11px; font-weight:500; min-width:140px; color:var(--text-secondary);">${c.campus}</span>
          <span style="font-weight:600; color:var(--accent-cyan); min-width:50px; cursor:pointer;" onclick="openStockModal('${c.topPick}')">${c.topPick}</span>
          <div class="prob-bar-track" style="flex:1">
            <div class="prob-bar-fill" style="width:${c.hypeLevel}%; background: linear-gradient(90deg, var(--accent-blue-dim), var(--accent-cyan));"></div>
          </div>
          <span style="font-size:10px; font-weight:600; color:var(--accent-cyan); min-width:30px; text-align:right;">${c.hypeLevel}</span>
        </div>
      `).join('')}
    </div>`;
  }
}

// ==========================================
// CONGLOMERATE MAP
// ==========================================
function renderConglomerateMap() {
  if (!kkData.conglomerates) return;
  const el = document.getElementById('conglomerateMap');
  if (!el) return;

  el.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:12px;">
      ${kkData.conglomerates.map(c => {
        const riskColors = { low: 'var(--positive)', medium: 'var(--warning)', high: 'var(--negative)', very_high: '#ff2d55' };
        const riskColor = riskColors[c.successionRisk] || 'var(--text-muted)';
        const readinessColor = c.heirReadiness > 70 ? 'var(--positive)' : c.heirReadiness > 45 ? 'var(--warning)' : 'var(--negative)';

        return `
          <div class="conglom-card">
            <div class="cc-header">
              <span class="cc-family">${c.family}</span>
              <span class="cc-worth">$${c.netWorth}B</span>
            </div>
            <div class="cc-patriarch">
              <span class="tier-badge tier-${c.politicalTier}" style="margin-right:4px;">${c.politicalTier}</span>
              ${c.patriarch} · Gen-${c.generation}
            </div>
            <div style="font-size:10px; color:var(--text-tertiary); margin-bottom:6px; line-height:1.4;">${c.description}</div>
            <div style="display:flex; gap:3px; flex-wrap:wrap; margin-bottom:8px;">
              ${c.companies.map(t => `<span class="reg-chip" style="color:var(--accent-cyan); cursor:pointer; font-weight:600;" onclick="openStockModal('${t}')">${t}</span>`).join('')}
            </div>
            <div class="cc-metrics">
              <div class="cc-metric-box">
                <div class="cmb-label">SUCCESSION RISK</div>
                <div class="cmb-value" style="color:${riskColor}; font-size:10px;">${c.successionRisk.replace('_', ' ').toUpperCase()}</div>
              </div>
              <div class="cc-metric-box">
                <div class="cmb-label">HEIR READINESS</div>
                <div class="cmb-value" style="color:${readinessColor}">${c.heirReadiness}%</div>
              </div>
              <div class="cc-metric-box">
                <div class="cmb-label">POLITICAL TIER</div>
                <div class="cmb-value text-cyan">${c.politicalTier}</div>
              </div>
            </div>
            <div class="readiness-gauge">
              <div class="readiness-bar">
                <div class="readiness-fill" style="width:${c.heirReadiness}%; background:${readinessColor}"></div>
              </div>
              <span style="font-size:9px; color:var(--text-muted);">Heirs: ${Array.isArray(c.heirs) ? c.heirs.join(', ') : c.heirs}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ==========================================
// WEALTH TRANSFER
// ==========================================
function renderWealthTransfer() {
  if (!kkData.wealthTransfer) return;
  const wt = kkData.wealthTransfer;

  // Generational stock preferences
  const genEl = document.getElementById('genStockPrefs');
  if (genEl) {
    genEl.innerHTML = `
      <div style="font-size:9px; color:var(--text-muted); letter-spacing:1px; margin-bottom:8px; padding-bottom:4px; border-bottom:1px solid var(--border-secondary);">BOOMER LEGACY PICKS</div>
      ${wt.legacyStocks.map(s => `
        <div class="gen-stock-card">
          <span class="gs-ticker" style="cursor:pointer" onclick="openStockModal('${s.ticker}')">${s.ticker}</span>
          <span style="font-size:10px; color:var(--text-tertiary)">${s.name}</span>
          <span class="gs-gen" style="background:var(--accent-cyan-dim); color:var(--accent-cyan);">${s.generationPref}</span>
          <span style="font-size:10px; text-align:right; color:var(--positive)">${s.popularityScore}/100</span>
        </div>
      `).join('')}
      <div style="font-size:9px; color:var(--text-muted); letter-spacing:1px; margin:12px 0 8px; padding-bottom:4px; border-bottom:1px solid var(--border-secondary);">MILLENNIAL / GEN-Z FAVORITES</div>
      ${wt.millennialPicks.map(s => `
        <div class="gen-stock-card">
          <span class="gs-ticker" style="cursor:pointer" onclick="openStockModal('${s.ticker}')">${s.ticker}</span>
          <span style="font-size:10px; color:var(--text-tertiary)">${s.name}</span>
          <span class="gs-gen" style="background:var(--positive-dim); color:var(--positive);">${s.generationPref}</span>
          <span style="font-size:10px; text-align:right; color:var(--accent-cyan)">${s.popularityScore}/100</span>
        </div>
      `).join('')}
      <div style="font-size:9px; color:var(--text-muted); letter-spacing:1px; margin:12px 0 8px; padding-bottom:4px; border-bottom:1px solid var(--border-secondary);">DIGITAL vs TRADITIONAL PREFERENCE</div>
      ${wt.digitalVsTraditional.breakdown.map(b => `
        <div style="display:flex; align-items:center; gap:6px; padding:4px 0; font-size:10px;">
          <span style="min-width:150px; color:var(--text-secondary)">${b.generation}</span>
          <div style="flex:1; display:flex; height:8px; border-radius:4px; overflow:hidden;">
            <div style="width:${b.digital}%; background:var(--accent-cyan)"></div>
            <div style="width:${b.traditional}%; background:var(--text-muted)"></div>
          </div>
          <span style="min-width:60px; text-align:right; color:var(--accent-cyan); font-size:9px;">${b.digital}% digital</span>
        </div>
      `).join('')}
    `;
  }

  // Family office
  const foEl = document.getElementById('familyOffice');
  if (foEl) {
    const fi = wt.familyOfficeIndicators;
    foEl.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:12px;">
        <div style="padding:10px; background:var(--bg-secondary); border-radius:4px; text-align:center;">
          <div style="font-size:8px; color:var(--text-muted); letter-spacing:1px;">NEW FORMATIONS</div>
          <div style="font-size:18px; font-weight:700; color:var(--positive); margin-top:2px;">${fi.newFormations}</div>
        </div>
        <div style="padding:10px; background:var(--bg-secondary); border-radius:4px; text-align:center;">
          <div style="font-size:8px; color:var(--text-muted); letter-spacing:1px;">TOTAL ESTIMATED</div>
          <div style="font-size:18px; font-weight:700; color:var(--accent-cyan); margin-top:2px;">${fi.totalEstimated}</div>
        </div>
        <div style="padding:10px; background:var(--bg-secondary); border-radius:4px; text-align:center;">
          <div style="font-size:8px; color:var(--text-muted); letter-spacing:1px;">AVG AUM</div>
          <div style="font-size:18px; font-weight:700; color:var(--text-primary); margin-top:2px;">Rp${formatNumber(fi.avgAUM)}B</div>
        </div>
      </div>
      <div style="font-size:9px; color:var(--text-muted); letter-spacing:1px; margin-bottom:8px;">TOP ALLOCATIONS</div>
      ${fi.topAllocations.map(a => `
        <div style="display:flex; align-items:center; gap:8px; padding:4px 0; border-bottom:1px solid var(--border-primary);">
          <span style="font-size:10px; min-width:120px; color:var(--text-secondary)">${a.asset}</span>
          <div class="prob-bar-track" style="flex:1">
            <div class="prob-bar-fill" style="width:${a.pct}%; background:var(--accent-cyan);"></div>
          </div>
          <span style="font-size:10px; font-weight:600; color:var(--accent-cyan); min-width:30px; text-align:right;">${a.pct}%</span>
        </div>
      `).join('')}
      <div style="font-size:10px; color:var(--text-tertiary); margin-top:10px; font-style:italic; line-height:1.5;">
        ${fi.trend}
      </div>
    `;
  }

  // Succession risk
  const succEl = document.getElementById('successionRisk');
  if (succEl && wt.conglomerateSuccession) {
    succEl.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(250px, 1fr)); gap:10px;">
        ${wt.conglomerateSuccession.sort((a, b) => a.heirReadiness - b.heirReadiness).map(c => {
          const riskColors = { low: 'var(--positive)', medium: 'var(--warning)', high: 'var(--negative)', very_high: '#ff2d55' };
          const color = riskColors[c.successionRisk] || 'var(--text-muted)';
          return `
            <div style="padding:10px; border:1px solid var(--border-primary); border-radius:4px; border-left:3px solid ${color};">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:600; font-size:11px;">${c.family}</span>
                <span style="font-size:9px; font-weight:600; color:${color}">${c.successionRisk.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div style="font-size:9px; color:var(--text-muted); margin:3px 0;">
                ${c.patriarch} · $${c.netWorth}B · Gen-${c.generation}
              </div>
              <div class="readiness-gauge">
                <span style="font-size:9px; color:var(--text-muted); min-width:55px;">Readiness:</span>
                <div class="readiness-bar">
                  <div class="readiness-fill" style="width:${c.heirReadiness}%; background:${color}"></div>
                </div>
                <span style="font-size:10px; font-weight:600; color:${color}; min-width:30px; text-align:right;">${c.heirReadiness}%</span>
              </div>
              <div style="display:flex; gap:3px; flex-wrap:wrap; margin-top:6px;">
                ${c.companies.map(t => `<span class="reg-chip" style="color:var(--accent-cyan); cursor:pointer;" onclick="openStockModal('${t}')">${t}</span>`).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}

// ==========================================
// SUPPLY CHAIN INTELLIGENCE
// ==========================================
function renderSupplyChain() {
  if (!kkData.supplyChain) return;
  const sc = kkData.supplyChain;

  // Commodity dashboard
  const comEl = document.getElementById('commodityDashboard');
  if (comEl) {
    comEl.innerHTML = `
      <div class="commodity-row" style="font-size:9px; color:var(--text-muted); font-weight:600; border-bottom:1px solid var(--border-secondary);">
        <span></span><span>COMMODITY</span><span style="text-align:right">PRICE</span><span style="text-align:right">DAILY</span><span style="text-align:right">WEEKLY</span><span>SUPPLY</span>
      </div>
      ${sc.commodityPrices.map(c => `
        <div class="commodity-row">
          <span style="font-size:14px">${c.icon}</span>
          <span style="font-weight:500; color:var(--text-primary); font-size:10px;">${c.name}</span>
          <span style="text-align:right; font-weight:600;">${c.currentPrice.toLocaleString()} <span style="font-size:8px; color:var(--text-muted)">${c.unit}</span></span>
          <span style="text-align:right; font-weight:600;" class="${changeClass(c.changePct)}">${formatPct(c.changePct)}</span>
          <span style="text-align:right;" class="${changeClass(c.weeklyChange)}">${formatPct(c.weeklyChange)}</span>
          <span style="font-size:9px; color:${c.supplyTrend === 'tightening' ? 'var(--negative)' : 'var(--positive)'};">${c.supplyTrend}</span>
        </div>
        <div style="padding:0 4px 6px 30px; display:flex; gap:3px; flex-wrap:wrap;">
          ${c.affectedStocks.map(t => `<span class="reg-chip" style="color:var(--accent-cyan); cursor:pointer; font-size:8px;" onclick="openStockModal('${t}')">${t}</span>`).join('')}
          <span style="font-size:8px; color:var(--text-muted); margin-left:4px;">China: ${c.chinaFactor}%</span>
        </div>
      `).join('')}
    `;
  }

  // Port status
  const portEl = document.getElementById('portStatus');
  if (portEl) {
    portEl.innerHTML = `
      <div class="port-row" style="font-size:9px; color:var(--text-muted); font-weight:600; border-bottom:1px solid var(--border-secondary);">
        <span>PORT</span><span style="text-align:right">UTIL %</span><span style="text-align:center">CONGESTION</span><span style="text-align:right">WAIT</span><span style="text-align:right">THRU CHG</span>
      </div>
      ${sc.portStatus.map(p => {
        const congColors = { low: 'var(--positive)', medium: 'var(--warning)', high: 'var(--negative)' };
        return `
          <div class="port-row">
            <span style="font-weight:500; color:var(--text-primary); font-size:10px;">${p.name}</span>
            <span style="text-align:right; font-weight:600;">${p.utilization}%</span>
            <span style="text-align:center; color:${congColors[p.congestion]}; font-weight:600; font-size:10px;">${p.congestion.toUpperCase()}</span>
            <span style="text-align:right; font-size:10px;">${p.avgWaitDays}d</span>
            <span style="text-align:right; font-size:10px;" class="${changeClass(p.throughputChange)}">${p.throughputChange > 0 ? '+' : ''}${p.throughputChange}%</span>
          </div>
        `;
      }).join('')}
    `;
  }

  // Weather
  const weathEl = document.getElementById('weatherImpact');
  if (weathEl) {
    weathEl.innerHTML = `
      ${sc.activeWeather.length === 0 ? '<div style="color:var(--text-muted); font-size:10px; padding:20px; text-align:center;">No active weather alerts</div>' : ''}
      ${sc.activeWeather.map(w => `
        <div class="weather-alert severity-${w.severity}">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span style="font-weight:600; font-size:12px; color:var(--text-primary);">${w.type}</span>
            <span class="anomaly-flag anomaly-${w.severity === 'high' ? 'HIGH' : w.severity === 'medium' ? 'MEDIUM' : 'LOW'}">${w.severity.toUpperCase()}</span>
          </div>
          <div style="font-size:10px; color:var(--text-tertiary); margin-bottom:4px; line-height:1.4;">${w.impact}</div>
          <div style="display:flex; gap:10px; font-size:9px; color:var(--text-muted);">
            <span>Probability: <span style="font-weight:600">${w.probability}%</span></span>
            <span>Duration: ${w.expectedDuration}</span>
          </div>
          <div style="display:flex; gap:3px; flex-wrap:wrap; margin-top:6px;">
            ${w.affectedStocks.map(t => `<span class="reg-chip" style="color:var(--accent-cyan); cursor:pointer;" onclick="openStockModal('${t}')">${t}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    `;
  }

  // China dependency
  const chinaEl = document.getElementById('chinaDependency');
  if (chinaEl) {
    const deps = Object.entries(sc.chinaDependency)
      .sort((a, b) => b[1].overallScore - a[1].overallScore)
      .slice(0, 15);

    chinaEl.innerHTML = `
      <div style="font-size:9px; color:var(--text-muted); letter-spacing:1px; margin-bottom:8px; padding-bottom:4px; border-bottom:1px solid var(--border-secondary);">
        STOCKS MOST EXPOSED TO CHINA/BEIJING POLICY SHIFTS
      </div>
      ${deps.map(([ticker, d]) => `
        <div style="display:flex; align-items:center; gap:8px; padding:5px 4px; border-bottom:1px solid var(--border-primary); cursor:pointer;" onclick="openStockModal('${ticker}')">
          <span style="font-weight:600; color:var(--accent-cyan); min-width:50px;">${ticker}</span>
          <div class="prob-bar-track" style="flex:1">
            <div class="prob-bar-fill" style="width:${d.overallScore}%; background:${d.riskLevel === 'high' ? 'var(--negative)' : d.riskLevel === 'medium' ? 'var(--warning)' : 'var(--positive)'};"></div>
          </div>
          <span style="font-size:9px; min-width:55px; text-align:right; color:${d.riskLevel === 'high' ? 'var(--negative)' : d.riskLevel === 'medium' ? 'var(--warning)' : 'var(--positive)'}; font-weight:600;">${d.overallScore} ${d.riskLevel.toUpperCase()}</span>
        </div>
      `).join('')}
    `;
  }

  // Island disparity
  const islandEl = document.getElementById('islandDisparity');
  if (islandEl) {
    islandEl.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:10px;">
        ${sc.islandDisparity.map(isl => `
          <div style="padding:12px; border:1px solid var(--border-primary); border-radius:4px; background:var(--bg-secondary);">
            <div style="font-weight:700; font-size:12px; color:var(--text-primary); margin-bottom:8px;">${isl.island}</div>
            <div style="display:flex; justify-content:space-between; font-size:10px; padding:3px 0; border-bottom:1px solid var(--border-primary);">
              <span style="color:var(--text-muted)">GDP Share</span>
              <span style="font-weight:600">${isl.gdpShare}%</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:10px; padding:3px 0; border-bottom:1px solid var(--border-primary);">
              <span style="color:var(--text-muted)">IDX Stock Share</span>
              <span style="font-weight:600">${isl.stockShare}%</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:10px; padding:3px 0; border-bottom:1px solid var(--border-primary);">
              <span style="color:var(--text-muted)">Logistics Score</span>
              <span style="font-weight:600; color:${isl.logisticsScore > 70 ? 'var(--positive)' : isl.logisticsScore > 50 ? 'var(--warning)' : 'var(--negative)'};">${isl.logisticsScore}/100</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:10px; padding:3px 0;">
              <span style="color:var(--text-muted)">Growth Rate</span>
              <span style="font-weight:600; color:var(--positive);">${isl.growthRate}%</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

// ==========================================
// INFORMAL ECONOMY
// ==========================================
function renderInformalEconomy() {
  if (!kkData.informalEconomy) return;
  const ie = kkData.informalEconomy;

  // Warung index
  const wEl = document.getElementById('warungIndex');
  if (wEl) {
    const wi = ie.warungIndex;
    wEl.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:12px;">
        <div style="padding:12px; background:var(--bg-secondary); border-radius:4px; text-align:center;">
          <div style="font-size:8px; color:var(--text-muted); letter-spacing:1px;">WARUNG INDEX</div>
          <div style="font-size:24px; font-weight:700; color:var(--accent-cyan); margin-top:2px;">${wi.overallIndex}</div>
          <div style="font-size:9px; color:${wi.trend === 'improving' ? 'var(--positive)' : 'var(--negative)'}">
            ${wi.trend === 'improving' ? '▲' : '▼'} ${wi.trend}
          </div>
        </div>
        <div style="padding:12px; background:var(--bg-secondary); border-radius:4px; text-align:center;">
          <div style="font-size:8px; color:var(--text-muted); letter-spacing:1px;">IMPLIED INFLATION</div>
          <div style="font-size:24px; font-weight:700; color:${wi.impliedInflation > 4 ? 'var(--negative)' : 'var(--warning)'}; margin-top:2px;">${wi.impliedInflation}%</div>
          <div style="font-size:9px; color:var(--text-muted)">${wi.biRateImplication}</div>
        </div>
      </div>
      ${wi.categories.map(c => `
        <div class="warung-category">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="wc-name">${c.name}</span>
            <span style="font-size:9px; color:${c.trend === 'up' ? 'var(--positive)' : 'var(--negative)'}; font-weight:600;">${c.trend === 'up' ? '▲' : '▼'} Footfall: ${c.footfall}</span>
          </div>
          <div style="font-size:9px; color:var(--text-muted); margin-top:2px;">Avg Trx: Rp${formatNumber(c.avgTransaction)}</div>
          <div style="font-size:9px; color:var(--text-tertiary); margin-top:3px; font-style:italic;">→ ${c.stockImplication}</div>
        </div>
      `).join('')}
    `;
  }

  // Ojek demand
  const ojEl = document.getElementById('ojekDemand');
  if (ojEl) {
    const od = ie.ojekDemand;
    ojEl.innerHTML = `
      <div style="padding:10px; background:var(--bg-secondary); border-radius:4px; text-align:center; margin-bottom:12px;">
        <div style="font-size:8px; color:var(--text-muted); letter-spacing:1px;">NATIONAL OJEK DEMAND INDEX</div>
        <div style="font-size:24px; font-weight:700; color:var(--accent-cyan); margin-top:2px;">${od.nationalIndex}/100</div>
        <div style="font-size:9px; color:var(--text-muted);">Consumer Spending Forecast: <span style="font-weight:600; color:${od.consumerSpendingForecast === 'STRONG' ? 'var(--positive)' : 'var(--warning)'}">${od.consumerSpendingForecast}</span></div>
      </div>
      ${od.regions.map(r => `
        <div class="ojek-city">
          <span class="oc-name">${r.city}</span>
          <div class="oc-bar">
            <div class="oc-fill" style="width:${r.demand}%"></div>
          </div>
          <span class="oc-value">${r.demand}</span>
          <span style="font-size:10px; color:${r.trend === 'up' ? 'var(--positive)' : 'var(--negative)'};">${r.trend === 'up' ? '▲' : '▼'}</span>
        </div>
      `).join('')}
      <div style="margin-top:10px; display:flex; gap:3px; flex-wrap:wrap;">
        ${od.affectedStocks.map(t => `<span class="reg-chip" style="color:var(--accent-cyan); cursor:pointer;" onclick="openStockModal('${t}')">${t}</span>`).join('')}
      </div>
    `;
  }

  // Pasar prices
  const pEl = document.getElementById('pasarPrices');
  if (pEl) {
    const pp = ie.pasarPrices;
    pEl.innerHTML = `
      <div style="font-size:9px; color:var(--text-muted); letter-spacing:1px; margin-bottom:8px; padding-bottom:4px; border-bottom:1px solid var(--border-secondary);">
        TRADITIONAL MARKET PRICE TRACKING → INFLATION SIGNAL
      </div>
      <div class="pasar-row" style="font-size:9px; color:var(--text-muted); font-weight:600; border-bottom:1px solid var(--border-secondary);">
        <span>ITEM</span><span style="text-align:right">PRICE</span><span style="text-align:right">UNIT</span><span style="text-align:right">WEEK CHG</span>
      </div>
      ${pp.map(p => `
        <div class="pasar-row">
          <span style="color:var(--text-primary); font-weight:500;">${p.item}</span>
          <span style="text-align:right; font-weight:600;">Rp${formatNumber(p.price)}</span>
          <span style="text-align:right; color:var(--text-muted);">${p.unit}</span>
          <span style="text-align:right; font-weight:600;" class="${changeClass(p.weekChange)}">${p.weekChange > 0 ? '+' : ''}${p.weekChange}%</span>
        </div>
      `).join('')}
    `;
  }

  // Remittance
  const remEl = document.getElementById('remittanceFlow');
  if (remEl) {
    const rf = ie.remittanceFlow;
    remEl.innerHTML = `
      <div style="padding:10px; background:var(--bg-secondary); border-radius:4px; text-align:center; margin-bottom:12px;">
        <div style="font-size:8px; color:var(--text-muted); letter-spacing:1px;">MONTHLY REMITTANCE INFLOW</div>
        <div style="font-size:22px; font-weight:700; color:var(--positive); margin-top:2px;">$${rf.totalMonthly}M</div>
        <div style="font-size:9px; color:var(--text-muted);">${rf.trend} | ${rf.rupiahImplication}</div>
      </div>
      <div style="font-size:9px; color:var(--text-muted); letter-spacing:1px; margin-bottom:6px;">TOP CORRIDORS</div>
      <div class="remit-row" style="font-size:9px; color:var(--text-muted); font-weight:600; border-bottom:1px solid var(--border-secondary);">
        <span>FROM</span><span style="text-align:right">AMOUNT</span><span style="text-align:right">CHANGE</span>
      </div>
      ${rf.topCorridors.map(c => `
        <div class="remit-row">
          <span style="color:var(--text-primary); font-weight:500;">${c.from}</span>
          <span style="text-align:right; font-weight:600;">$${c.amount}M</span>
          <span style="text-align:right;" class="${changeClass(c.change)}">${c.change > 0 ? '+' : ''}${c.change}%</span>
        </div>
      `).join('')}
      <div style="margin-top:10px; display:flex; gap:3px; flex-wrap:wrap;">
        ${rf.affectedStocks.map(t => `<span class="reg-chip" style="color:var(--accent-cyan); cursor:pointer;" onclick="openStockModal('${t}')">${t}</span>`).join('')}
      </div>
    `;
  }
}
