/**
 * IDX News Service
 * Generates realistic Indonesian stock market news covering:
 * - Daily market movers and trending stocks
 * - Corporate actions (rights issue, stock split, dividends)
 * - Joint ventures, partnerships, acquisitions
 * - Macro economic news affecting IHSG
 * - Sector-specific developments
 * - Regulatory changes from OJK/IDX
 */

const NEWS_TEMPLATES = {
  daily: [
    { title: '{ticker} Melesat {pct}%, Volume Melonjak {vol}x dari Rata-rata', category: 'Market Mover', impact: 'high', timeframe: 'daily' },
    { title: 'Saham {ticker} Sentuh ARA, Investor Asing Net Buy Rp{val}M', category: 'Market Mover', impact: 'high', timeframe: 'daily' },
    { title: '{ticker} Anjlok ke ARB, Aksi Jual Bandar Dominan', category: 'Market Mover', impact: 'high', timeframe: 'daily' },
    { title: 'IHSG Menguat di Tengah Sentimen Global Positif, {ticker} Jadi Penopang', category: 'IHSG', impact: 'medium', timeframe: 'daily' },
    { title: 'Foreign Flow Masuk Rp{val}M ke {ticker}, Sinyal Akumulasi Kuat', category: 'Foreign Flow', impact: 'high', timeframe: 'daily' },
    { title: 'Bandar Tercatat Akumulasi Besar di {ticker}, HAKA Mendominasi', category: 'Bandar Activity', impact: 'medium', timeframe: 'daily' },
    { title: 'Saham {sector} Kompak Menguat, {ticker} Pimpin Kenaikan', category: 'Sector', impact: 'medium', timeframe: 'daily' },
    { title: '{ticker} Alami Tekanan Jual, HAKI Meningkat Signifikan', category: 'Market Mover', impact: 'medium', timeframe: 'daily' },
    { title: 'Top Gainers Hari Ini: {ticker} Naik {pct}% dengan Volume Rp{val}M', category: 'Top Movers', impact: 'low', timeframe: 'daily' },
    { title: 'Rupiah Menguat, Investor Asing Borong Saham {sector}', category: 'Macro', impact: 'medium', timeframe: 'daily' },
  ],
  weekly: [
    { title: '{ticker} Cetak Kenaikan {pct}% Sepekan, Outlook Tetap Positif', category: 'Weekly Review', impact: 'medium', timeframe: 'weekly' },
    { title: 'Sektor {sector} Jadi Juara Pekan Ini, Ditopang Sentimen {catalyst}', category: 'Sector Review', impact: 'medium', timeframe: 'weekly' },
    { title: 'IHSG Ditutup di Level {level}, Asing Net Buy Rp{val}M Sepekan', category: 'Weekly Review', impact: 'medium', timeframe: 'weekly' },
    { title: '{ticker} Breakout dari Resistance, Target Harga Dinaikkan Analis', category: 'Technical', impact: 'medium', timeframe: 'weekly' },
    { title: 'Rebalancing Indeks MSCI, {ticker} Masuk Radar Investor Global', category: 'Index', impact: 'high', timeframe: 'weekly' },
  ],
  monthly: [
    { title: '{ticker} Umumkan Dividen Interim Rp{val} per Saham', category: 'Corporate Action', impact: 'high', timeframe: 'monthly' },
    { title: '{ticker} Lakukan Stock Split Rasio 1:{ratio}, Saham Jadi Lebih Terjangkau', category: 'Corporate Action', impact: 'high', timeframe: 'monthly' },
    { title: '{ticker} Rights Issue Rp{val}T untuk Ekspansi Bisnis', category: 'Corporate Action', impact: 'high', timeframe: 'monthly' },
    { title: 'Laba Bersih {ticker} Tumbuh {pct}% di Kuartal Terakhir', category: 'Earnings', impact: 'high', timeframe: 'monthly' },
    { title: 'OJK Keluarkan Regulasi Baru Soal Short Selling, Pasar Bereaksi', category: 'Regulation', impact: 'medium', timeframe: 'monthly' },
    { title: '{ticker} Raih Kontrak Baru Senilai Rp{val}T dari Pemerintah', category: 'Contract', impact: 'high', timeframe: 'monthly' },
  ],
  quarterly: [
    { title: '{ticker} Gandeng Perusahaan Global untuk Joint Venture di Sektor {sector}', category: 'Partnership', impact: 'high', timeframe: 'quarterly' },
    { title: '{ticker} Akuisisi Perusahaan {target} Senilai Rp{val}T', category: 'M&A', impact: 'high', timeframe: 'quarterly' },
    { title: 'Ekspansi {ticker} ke Pasar ASEAN, Bangun Pabrik di Vietnam', category: 'Expansion', impact: 'high', timeframe: 'quarterly' },
    { title: '{ticker} Teken MoU dengan {partner} untuk Proyek {project}', category: 'Partnership', impact: 'medium', timeframe: 'quarterly' },
    { title: 'IDX Perbarui Kebijakan ARA/ARB, Batas Baru Berlaku Kuartal Depan', category: 'Regulation', impact: 'high', timeframe: 'quarterly' },
  ],
  yearly: [
    { title: '{ticker} Transformasi Bisnis, Masuk Ekosistem EV dan Energi Terbarukan', category: 'Strategy', impact: 'high', timeframe: 'yearly' },
    { title: 'IPO Jumbo: Anak Usaha {ticker} Melantai di BEI dengan Valuasi Rp{val}T', category: 'IPO', impact: 'high', timeframe: 'yearly' },
    { title: '{ticker} Bangun Smelter Nikel Rp{val}T, Produksi Dimulai 2027', category: 'Expansion', impact: 'high', timeframe: 'yearly' },
    { title: 'Indonesia Jadi Hub Baterai Global, {ticker} Kunci Rantai Pasok', category: 'Strategy', impact: 'high', timeframe: 'yearly' },
    { title: '{ticker} Terapkan AI & Digital Transformation, Efisiensi Naik {pct}%', category: 'Digital', impact: 'medium', timeframe: 'yearly' },
    { title: 'Konsolidasi Sektor {sector}: {ticker} Merger dengan Kompetitor', category: 'M&A', impact: 'high', timeframe: 'yearly' },
  ],
};

const CATALYSTS = [
  'Harga Komoditas Naik', 'Kebijakan Suku Bunga BI', 'Stimulus Pemerintah',
  'Permintaan Ekspor Meningkat', 'Penguatan Rupiah', 'Earnings Season',
  'Arus Modal Masuk', 'Kebijakan Hilirisasi', 'Proyek IKN', 'Green Energy Transition',
];

const PARTNERS = [
  'Tesla', 'CATL', 'Samsung', 'Toyota', 'Hyundai', 'LG Energy',
  'BYD', 'Foxconn', 'BASF', 'Rio Tinto', 'Vale', 'Mitsubishi',
];

const PROJECTS = [
  'Baterai EV', 'Smelter Nikel', 'Pembangkit Listrik Tenaga Surya',
  'Data Center', 'Infrastruktur 5G', 'Smart City IKN',
  'Green Hydrogen', 'Carbon Capture', 'Digital Payment',
];

const TARGET_COMPANIES = [
  'startup fintech lokal', 'perusahaan logistik regional', 'produsen baterai Korea',
  'platform e-commerce', 'perusahaan tambang Afrika', 'bank digital Singapore',
];

const NEWS_SOURCES = [
  'IDX Channel', 'CNBC Indonesia', 'Kontan.co.id', 'Bisnis.com',
  'Bloomberg Technoz', 'Investor Daily', 'Bareksa', 'Stockbit News',
  'Reuters Indonesia', 'Detik Finance',
];

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getDaySeed() {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

function generateNews(stocks) {
  const daySeed = getDaySeed();
  const allNews = [];
  let newsId = 1;

  const tickers = stocks.map(s => s.ticker);
  const sectors = [...new Set(stocks.map(s => s.sector))];

  // Generate news for each timeframe
  Object.entries(NEWS_TEMPLATES).forEach(([timeframe, templates]) => {
    const count = timeframe === 'daily' ? 15 : timeframe === 'weekly' ? 8 : 5;

    for (let i = 0; i < count; i++) {
      const seed = daySeed + newsId * 97 + i * 31;
      const template = templates[Math.floor(seededRandom(seed) * templates.length)];
      const stock = stocks[Math.floor(seededRandom(seed + 1) * stocks.length)];
      const sector = sectors[Math.floor(seededRandom(seed + 2) * sectors.length)];

      let title = template.title
        .replace('{ticker}', stock.ticker)
        .replace('{sector}', sector)
        .replace('{pct}', (Math.round(seededRandom(seed + 3) * 30 * 10) / 10).toString())
        .replace('{vol}', (Math.round(seededRandom(seed + 4) * 5 * 10) / 10).toString())
        .replace('{val}', Math.round(seededRandom(seed + 5) * 500 + 10).toString())
        .replace('{level}', Math.round(7000 + seededRandom(seed + 6) * 500).toString())
        .replace('{ratio}', Math.floor(seededRandom(seed + 7) * 9 + 2).toString())
        .replace('{catalyst}', CATALYSTS[Math.floor(seededRandom(seed + 8) * CATALYSTS.length)])
        .replace('{partner}', PARTNERS[Math.floor(seededRandom(seed + 9) * PARTNERS.length)])
        .replace('{project}', PROJECTS[Math.floor(seededRandom(seed + 10) * PROJECTS.length)])
        .replace('{target}', TARGET_COMPANIES[Math.floor(seededRandom(seed + 11) * TARGET_COMPANIES.length)]);

      const hoursAgo = Math.floor(seededRandom(seed + 12) * (timeframe === 'daily' ? 8 : timeframe === 'weekly' ? 72 : 168));
      const publishDate = new Date(Date.now() - hoursAgo * 3600000);

      const relatedTickers = [stock.ticker];
      if (seededRandom(seed + 13) > 0.5) {
        const related = tickers[Math.floor(seededRandom(seed + 14) * tickers.length)];
        if (related !== stock.ticker) relatedTickers.push(related);
      }

      allNews.push({
        id: newsId++,
        title,
        category: template.category,
        impact: template.impact,
        timeframe: template.timeframe,
        source: NEWS_SOURCES[Math.floor(seededRandom(seed + 15) * NEWS_SOURCES.length)],
        publishedAt: publishDate.toISOString(),
        relatedTickers,
        sector: stock.sector,
        summary: generateSummary(title, stock, seed),
        sentiment: seededRandom(seed + 16) > 0.5 ? 'bullish' : seededRandom(seed + 16) > 0.2 ? 'bearish' : 'neutral',
      });
    }
  });

  // Sort by publish date (newest first)
  allNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  return allNews;
}

function generateSummary(title, stock, seed) {
  const summaries = [
    `Saham ${stock.ticker} (${stock.name}) menunjukkan pergerakan signifikan hari ini. Analis mencatat adanya perubahan pola transaksi yang menarik untuk diperhatikan oleh para pelaku pasar. Volume perdagangan tercatat di atas rata-rata 20 hari terakhir.`,
    `Pergerakan harga ${stock.ticker} didukung oleh sentimen positif dari sektor ${stock.sector}. Partisipasi investor institusi meningkat, dengan broker asing terlihat aktif di sisi pembelian. Proyeksi analis menunjukkan potensi upside yang menarik.`,
    `${stock.name} menarik perhatian pelaku pasar setelah perkembangan terbaru. Data broker summary menunjukkan akumulasi signifikan oleh beberapa broker utama. Foreign flow tercatat positif dalam beberapa hari terakhir.`,
    `Fundamental ${stock.ticker} tetap solid dengan pertumbuhan pendapatan yang konsisten. Valuasi saat ini dinilai masih wajar oleh konsensus analis. Katalis jangka pendek dan menengah menjadi daya tarik tersendiri bagi investor.`,
    `Sektor ${stock.sector} mengalami rotasi yang menarik. ${stock.ticker} menjadi salah satu emiten yang paling diuntungkan. Likuiditas perdagangan meningkat signifikan menandakan minat investor yang tinggi.`,
  ];

  return summaries[Math.floor(seededRandom(seed + 20) * summaries.length)];
}

function getNewsByTimeframe(news, timeframe) {
  if (timeframe === 'all') return news;
  return news.filter(n => n.timeframe === timeframe);
}

function getNewsByTicker(news, ticker) {
  return news.filter(n => n.relatedTickers.includes(ticker));
}

function getNewsByCategory(news, category) {
  return news.filter(n => n.category === category);
}

module.exports = {
  generateNews,
  getNewsByTimeframe,
  getNewsByTicker,
  getNewsByCategory,
};
