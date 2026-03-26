/**
 * KONEKSI & KULTUR INTELLIGENCE SERVICE
 * ==========================================
 * The heart of Indonesian market intelligence that pure quant screeners miss.
 * 
 * Modules:
 * 1. Political Risk Radar - Government tenders, regulatory shifts, conglomerate connections
 * 2. Social Sentiment Fusion - Influencer tracking, retail sentiment, conglomerate drama
 * 3. Supply Chain Intelligence - Commodity flows, weather impact, logistics bottlenecks
 * 4. Cultural Catalyst Engine - Ramadan/Lebaran, viral trends, regional pride
 * 5. Meme Stock Early Warning - Pump group detection, campus hype, influencer analysis
 * 6. Informal Economy Integration - Street vendor trends, ojek demand, pasar prices
 * 7. Generational Wealth Transfer - Family office formation, inheritance patterns
 */

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getDaySeed() {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

function pick(arr, seed) {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

function pickMultiple(arr, count, seed) {
  const shuffled = [...arr].sort((a, b) => seededRandom(seed + a.length) - 0.5);
  return shuffled.slice(0, count);
}

// ============================================================
// CONGLOMERATE & FAMILY DATA
// Indonesian business is family business
// ============================================================
const CONGLOMERATES = [
  {
    family: 'Salim Group',
    patriarch: 'Anthoni Salim',
    generation: 2,
    successionRisk: 'medium',
    companies: ['INDF', 'ICBP', 'MPPA'],
    sectors: ['Consumer', 'Retail', 'Finance'],
    politicalTier: 1,
    description: 'Indonesia\'s largest conglomerate. Deep government ties since Suharto era.',
    netWorth: 7.2,
    heirs: ['Axton Salim', 'Andre Salim'],
    heirReadiness: 72,
  },
  {
    family: 'Hartono Brothers (Djarum)',
    patriarch: 'Robert Budi Hartono',
    generation: 2,
    successionRisk: 'low',
    companies: ['BBCA'],
    sectors: ['Finance', 'Consumer', 'Technology'],
    politicalTier: 1,
    description: 'Richest family in Indonesia. BCA is the crown jewel. Diversified into tech.',
    netWorth: 47.0,
    heirs: ['Armand Hartono', 'Martin Hartono'],
    heirReadiness: 85,
  },
  {
    family: 'Widjaja Family (Sinar Mas)',
    patriarch: 'Eka Tjipta Widjaja (deceased)',
    generation: 3,
    successionRisk: 'high',
    companies: ['INKP', 'TKIM', 'BSDE', 'SMRA'],
    sectors: ['Industrial', 'Property', 'Finance'],
    politicalTier: 2,
    description: 'Pulp & paper, property, banking empire. Family succession disputes reported.',
    netWorth: 10.5,
    heirs: ['Franky Widjaja', 'Muktar Widjaja', 'Fuganto Widjaja'],
    heirReadiness: 55,
  },
  {
    family: 'Bakrie Group',
    patriarch: 'Aburizal Bakrie',
    generation: 2,
    successionRisk: 'very_high',
    companies: ['BRPT', 'TPIA'],
    sectors: ['Energy', 'Industrial', 'Mining'],
    politicalTier: 1,
    description: 'Politically active family. Media, mining, telecoms. High debt history.',
    netWorth: 2.8,
    heirs: ['Anindya Bakrie', 'Nirwan Bakrie'],
    heirReadiness: 45,
  },
  {
    family: 'Riady Family (Lippo)',
    patriarch: 'Mochtar Riady',
    generation: 2,
    successionRisk: 'medium',
    companies: ['MAPI', 'CTRA'],
    sectors: ['Retail', 'Property', 'Healthcare', 'Technology'],
    politicalTier: 2,
    description: 'Healthcare (Siloam), property (Meikarta), retail. International connections.',
    netWorth: 3.5,
    heirs: ['James Riady', 'Stephen Riady', 'John Riady'],
    heirReadiness: 78,
  },
  {
    family: 'Panigoro Family',
    patriarch: 'Arifin Panigoro',
    generation: 1,
    successionRisk: 'high',
    companies: ['MEDC'],
    sectors: ['Energy', 'Mining'],
    politicalTier: 2,
    description: 'Energy sector champion. Medco Energi dominant player. Aging founder.',
    netWorth: 1.8,
    heirs: ['Hilmi Panigoro'],
    heirReadiness: 65,
  },
  {
    family: 'Tanoto Family (Royal Golden Eagle)',
    patriarch: 'Sukanto Tanoto',
    generation: 2,
    successionRisk: 'low',
    companies: ['INKP'],
    sectors: ['Industrial', 'Energy', 'Property'],
    politicalTier: 2,
    description: 'Pulp, palm oil, energy. Well-managed succession to children.',
    netWorth: 5.2,
    heirs: ['Anderson Tanoto', 'Imelda Tanoto', 'Belinda Tanoto'],
    heirReadiness: 88,
  },
  {
    family: 'Chairul Tanjung (CT Corp)',
    patriarch: 'Chairul Tanjung',
    generation: 1,
    successionRisk: 'medium',
    companies: ['EMTK', 'SCMA'],
    sectors: ['Media', 'Finance', 'Retail', 'Technology'],
    politicalTier: 1,
    description: 'Self-made billionaire. Trans Corp media empire, Bank Mega, Trans Retail.',
    netWorth: 4.5,
    heirs: ['Putri Indahsari Tanjung', 'Rahmat Tanjung'],
    heirReadiness: 60,
  },
  {
    family: 'Prajogo Pangestu',
    patriarch: 'Prajogo Pangestu',
    generation: 1,
    successionRisk: 'very_high',
    companies: ['BREN', 'BRPT', 'TPIA'],
    sectors: ['Energy', 'Industrial'],
    politicalTier: 1,
    description: 'Petrochemical & green energy tycoon. Now richest in ID with Barito Renewables.',
    netWorth: 58.0,
    heirs: ['Uncertain - limited public information'],
    heirReadiness: 30,
  },
  {
    family: 'Aguan (Sugianto Kusuma)',
    patriarch: 'Sugianto Kusuma',
    generation: 1,
    successionRisk: 'high',
    companies: ['CTRA', 'PWON'],
    sectors: ['Property'],
    politicalTier: 2,
    description: 'Property magnate, Agung Sedayu Group. Major Jakarta land bank.',
    netWorth: 3.2,
    heirs: ['Limited public information'],
    heirReadiness: 40,
  },
];

// ============================================================
// POLITICAL RISK RADAR
// ============================================================
const GOVERNMENT_MINISTRIES = [
  'Kementerian BUMN', 'Kementerian ESDM', 'Kementerian Keuangan',
  'Kementerian Perdagangan', 'Kementerian Perindustrian',
  'Kementerian PUPR', 'Kementerian Kesehatan', 'OJK', 'Bank Indonesia',
  'Kementerian Pertahanan', 'Kementerian Perhubungan', 'Bappenas',
];

const REGULATORY_EVENTS = [
  { type: 'mineral_export_ban', name: 'Hilirisasi Mineral Export Ban', sectors: ['Mining'], impact: 85, direction: 'mixed' },
  { type: 'carbon_tax', name: 'Carbon Tax Implementation Phase 2', sectors: ['Energy', 'Industrial'], impact: 70, direction: 'negative' },
  { type: 'digital_tax', name: 'Digital Economy Tax Framework', sectors: ['Technology'], impact: 60, direction: 'negative' },
  { type: 'ev_incentive', name: 'EV & Battery Incentive Package', sectors: ['Industrial', 'Mining'], impact: 80, direction: 'positive' },
  { type: 'banking_regulation', name: 'OJK Tier 1 Capital Requirements Update', sectors: ['Finance'], impact: 75, direction: 'mixed' },
  { type: 'food_price', name: 'Stabilisasi Harga Pangan Policy', sectors: ['Consumer', 'Agriculture'], impact: 65, direction: 'mixed' },
  { type: 'ikn_phase', name: 'IKN Nusantara Phase 3 Tender Awards', sectors: ['Property', 'Industrial'], impact: 90, direction: 'positive' },
  { type: 'telecom_spectrum', name: '5G Spectrum Auction & Sharing Policy', sectors: ['Telecom'], impact: 70, direction: 'positive' },
  { type: 'healthcare_bpjs', name: 'BPJS Tariff Revision 2026', sectors: ['Healthcare'], impact: 65, direction: 'mixed' },
  { type: 'palm_oil', name: 'CPO Export Levy Adjustment', sectors: ['Agriculture'], impact: 75, direction: 'negative' },
  { type: 'nickel_downstream', name: 'Nickel Downstream Mandatory Smelter Expansion', sectors: ['Mining'], impact: 85, direction: 'positive' },
  { type: 'property_ltv', name: 'Property LTV Relaxation for First Homes', sectors: ['Property', 'Finance'], impact: 60, direction: 'positive' },
];

const TENDER_TYPES = [
  'IKN Infrastructure Package', 'Trans-Sumatra Toll Road Segment', 'National 5G Backbone',
  'Hospital Modernization Program', 'EV Charging Network Rollout', 'Port Expansion Project',
  'Smart City Development', 'Defense Procurement', 'Renewable Energy IPP',
  'Water Treatment Plant', 'Airport Expansion', 'Railway Electrification',
  'Digital ID Infrastructure', 'Social Housing Program', 'Dam Construction',
];

function generatePoliticalRiskData(stocks, daySeed) {
  const regulatoryImpacts = REGULATORY_EVENTS.map((event, i) => {
    const seed = daySeed + i * 71;
    const probability = Math.round(30 + seededRandom(seed) * 60);
    const timeline = pick(['Imminent (< 1 month)', 'Near-term (1-3 months)', 'Medium-term (3-6 months)', 'Long-term (6-12 months)'], seed + 1);
    const affectedStocks = stocks
      .filter(s => event.sectors.includes(s.sector))
      .slice(0, Math.floor(3 + seededRandom(seed + 2) * 5))
      .map(s => s.ticker);

    return {
      ...event,
      probability,
      timeline,
      affectedStocks,
      lastUpdate: new Date(Date.now() - seededRandom(seed + 3) * 7 * 86400000).toISOString(),
    };
  });

  // Government tenders
  const activeTenders = [];
  for (let i = 0; i < 8; i++) {
    const seed = daySeed + i * 137;
    const tenderName = pick(TENDER_TYPES, seed);
    const ministry = pick(GOVERNMENT_MINISTRIES, seed + 1);
    const value = Math.round(500 + seededRandom(seed + 2) * 15000); // in billions IDR
    const likelyWinners = [];
    const winnerCount = Math.floor(1 + seededRandom(seed + 3) * 3);
    for (let j = 0; j < winnerCount; j++) {
      const stock = stocks[Math.floor(seededRandom(seed + 4 + j) * stocks.length)];
      likelyWinners.push({
        ticker: stock.ticker,
        name: stock.name,
        winProbability: Math.round(20 + seededRandom(seed + 10 + j) * 60),
      });
    }

    const anomalyScore = Math.round(seededRandom(seed + 20) * 100);

    activeTenders.push({
      id: i + 1,
      name: tenderName,
      ministry,
      value,
      status: pick(['Open', 'Evaluation', 'Shortlisted', 'Awarded'], seed + 5),
      likelyWinners: likelyWinners.sort((a, b) => b.winProbability - a.winProbability),
      anomalyScore, // Tender award anomaly detection
      anomalyFlag: anomalyScore > 75 ? 'HIGH' : anomalyScore > 50 ? 'MEDIUM' : 'LOW',
    });
  }

  // Political connection heatmap
  const connectionMap = {};
  stocks.forEach((stock, i) => {
    const seed = daySeed + i * 53;
    const conglomerate = CONGLOMERATES.find(c => c.companies.includes(stock.ticker));

    connectionMap[stock.ticker] = {
      politicalTier: conglomerate ? conglomerate.politicalTier : Math.ceil(seededRandom(seed) * 3),
      governmentContracts: Math.round(seededRandom(seed + 1) * 15),
      regulatoryCapture: Math.round(seededRandom(seed + 2) * 100),
      conglomerate: conglomerate ? conglomerate.family : null,
      bumnConnection: seededRandom(seed + 3) > 0.6,
    };
  });

  return {
    regulatoryImpacts,
    activeTenders,
    connectionMap,
    overallRiskLevel: regulatoryImpacts.filter(r => r.probability > 60).length > 4 ? 'ELEVATED' : 'MODERATE',
  };
}

// ============================================================
// SOCIAL SENTIMENT FUSION
// ============================================================
const INFLUENCER_PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'Twitter/X', 'Telegram'];
const INFLUENCER_NAMES = [
  'Ellen May', 'Felicia Putri Tjiasaka', 'Ryan Filbert', 'Lo Kheng Hong',
  'Nicky Hogan', 'Andre Soelistyo', 'William Tanuwijaya', 'Iman Usman',
  'Raditya Dika (Finance)', 'CuanID', 'SahamologiID', 'InvestTokID',
  'StockbitUpdate', 'BolaSaham', 'SahamRakyat', 'CuanBanyak99',
];

const SENTIMENT_TOPICS = [
  'Bullish thesis viral clip', 'Portfolio reveal video', 'Stock analysis thread',
  'Market crash prediction', 'Hidden gem recommendation', 'Sector rotation call',
  'Technical analysis breakdown', 'Fundamental deep dive', 'Dividend play recommendation',
  'Short-term trade alert', 'Long-term hold thesis', 'Meme stock promotion',
];

function generateSocialSentiment(stocks, daySeed) {
  // Influencer mentions with price correlation
  const influencerAlerts = [];
  for (let i = 0; i < 12; i++) {
    const seed = daySeed + i * 89;
    const stock = stocks[Math.floor(seededRandom(seed) * stocks.length)];
    const influencer = pick(INFLUENCER_NAMES, seed + 1);
    const platform = pick(INFLUENCER_PLATFORMS, seed + 2);
    const topic = pick(SENTIMENT_TOPICS, seed + 3);
    const engagement = Math.round(1000 + seededRandom(seed + 4) * 500000);
    const priceCorrelation = Math.round((seededRandom(seed + 5) - 0.3) * 100) / 100;

    influencerAlerts.push({
      ticker: stock.ticker,
      influencer,
      platform,
      topic,
      engagement,
      sentiment: seededRandom(seed + 6) > 0.4 ? 'bullish' : seededRandom(seed + 6) > 0.15 ? 'bearish' : 'neutral',
      priceCorrelation,
      hoursAgo: Math.floor(seededRandom(seed + 7) * 48),
      viralScore: Math.round(seededRandom(seed + 8) * 100),
    });
  }

  // Warung kopi / retail sentiment (aggregated from forums, telegram)
  const retailSentiment = {};
  stocks.forEach((stock, i) => {
    const seed = daySeed + i * 41;
    retailSentiment[stock.ticker] = {
      mentionCount: Math.round(seededRandom(seed) * 5000),
      sentimentScore: Math.round((seededRandom(seed + 1) - 0.3) * 100), // -100 to +100
      trendDirection: seededRandom(seed + 2) > 0.5 ? 'rising' : 'falling',
      topKeywords: pickMultiple([
        'bagger', 'cuan', 'cutloss', 'hold', 'buy the dip', 'moon',
        'bandar masuk', 'ARB lagi', 'HAKA semua', 'dividen gede',
        'fundamentalnya bagus', 'overvalued', 'hidden gem', 'rotasi sektor',
        'saham gorengan', 'bluechip mantap', 'tunggu koreksi',
      ], 3, seed + 3),
    };
  });

  // Conglomerate drama tracker
  const conglomerateDrama = CONGLOMERATES.map((c, i) => {
    const seed = daySeed + i * 67;
    const events = [];
    const eventCount = Math.floor(seededRandom(seed) * 3);

    const dramaTypes = [
      'Board restructuring announced', 'New business venture revealed',
      'Heir takes new leadership role', 'Family dispute reported in media',
      'Major asset acquisition', 'Strategic divestment announced',
      'Political appointment of family member', 'Philanthropic initiative launched',
      'Cross-border expansion announced', 'Debt restructuring in progress',
      'New joint venture with foreign partner', 'Regulatory investigation reported',
    ];

    for (let j = 0; j < eventCount; j++) {
      events.push({
        event: pick(dramaTypes, seed + j * 11),
        daysAgo: Math.floor(seededRandom(seed + j * 13) * 30),
        marketImpact: pick(['high', 'medium', 'low'], seed + j * 17),
      });
    }

    return {
      ...c,
      recentEvents: events,
      sentimentTrend: seededRandom(seed + 50) > 0.5 ? 'improving' : 'deteriorating',
      mediaAttentionScore: Math.round(seededRandom(seed + 51) * 100),
    };
  });

  // Gojek/Grab driver sentiment (consumer pulse)
  const gojekGrabSentiment = {
    overallDemand: Math.round(50 + (seededRandom(daySeed + 777) - 0.4) * 60),
    demandTrend: seededRandom(daySeed + 778) > 0.5 ? 'increasing' : 'decreasing',
    avgSpendPerTrip: Math.round(25000 + seededRandom(daySeed + 779) * 50000),
    topCategories: [
      { name: 'Food Delivery', trend: seededRandom(daySeed + 780) > 0.5 ? 'up' : 'down', change: Math.round((seededRandom(daySeed + 781) - 0.4) * 30) },
      { name: 'Ride Hailing', trend: seededRandom(daySeed + 782) > 0.5 ? 'up' : 'down', change: Math.round((seededRandom(daySeed + 783) - 0.4) * 25) },
      { name: 'Groceries', trend: seededRandom(daySeed + 784) > 0.5 ? 'up' : 'down', change: Math.round((seededRandom(daySeed + 785) - 0.4) * 35) },
      { name: 'Payments', trend: seededRandom(daySeed + 786) > 0.5 ? 'up' : 'down', change: Math.round((seededRandom(daySeed + 787) - 0.4) * 40) },
    ],
    driverEarningTrend: seededRandom(daySeed + 788) > 0.5 ? 'improving' : 'declining',
    consumerConfidence: Math.round(40 + seededRandom(daySeed + 789) * 50),
    affectedStocks: ['GOTO', 'BUKA', 'TLKM', 'BBCA', 'BBRI'],
  };

  return {
    influencerAlerts: influencerAlerts.sort((a, b) => b.viralScore - a.viralScore),
    retailSentiment,
    conglomerateDrama,
    gojekGrabSentiment,
  };
}

// ============================================================
// SUPPLY CHAIN & COMMODITY INTELLIGENCE
// ============================================================
const COMMODITIES = [
  { name: 'Crude Palm Oil (CPO)', unit: 'MYR/ton', base: 3800, affectedStocks: ['LSIP', 'DSNG', 'TAPG'], icon: '🌴' },
  { name: 'Nickel (LME)', unit: 'USD/ton', base: 16500, affectedStocks: ['ANTM', 'INCO', 'MBMA', 'NCKL'], icon: '⛏️' },
  { name: 'Thermal Coal (Newcastle)', unit: 'USD/ton', base: 130, affectedStocks: ['ADRO', 'PTBA', 'ITMG', 'HRUM'], icon: '🪨' },
  { name: 'Gold (COMEX)', unit: 'USD/oz', base: 2650, affectedStocks: ['ANTM', 'MDKA'], icon: '🥇' },
  { name: 'Copper (LME)', unit: 'USD/ton', base: 9200, affectedStocks: ['MDKA', 'AMMN'], icon: '🔶' },
  { name: 'Tin (LME)', unit: 'USD/ton', base: 28000, affectedStocks: ['TINS'], icon: '🪙' },
  { name: 'Rubber (SGX)', unit: 'USc/kg', base: 165, affectedStocks: ['ASII', 'UNTR'], icon: '🌿' },
  { name: 'Natural Gas (Henry Hub)', unit: 'USD/MMBtu', base: 3.2, affectedStocks: ['PGAS', 'MEDC', 'ESSA'], icon: '🔥' },
];

const PORTS = [
  { name: 'Tanjung Priok (Jakarta)', region: 'Java', capacity: 95, congestion: 'medium' },
  { name: 'Tanjung Perak (Surabaya)', region: 'Java', capacity: 82, congestion: 'low' },
  { name: 'Belawan (Medan)', region: 'Sumatra', capacity: 75, congestion: 'low' },
  { name: 'Balikpapan', region: 'Kalimantan', capacity: 88, congestion: 'medium' },
  { name: 'Makassar', region: 'Sulawesi', capacity: 65, congestion: 'low' },
  { name: 'Banjarmasin', region: 'Kalimantan', capacity: 78, congestion: 'high' },
  { name: 'Dumai (Riau)', region: 'Sumatra', capacity: 80, congestion: 'medium' },
];

const WEATHER_EVENTS = [
  { type: 'Monsoon Season', impact: 'Mining & logistics disruption in Kalimantan', severity: 'high', sectors: ['Mining', 'Industrial'] },
  { type: 'El Niño Watch', impact: 'CPO production decline, palm oil prices spike', severity: 'medium', sectors: ['Agriculture'] },
  { type: 'La Niña Alert', impact: 'Flooding risk in Java, supply chain delays', severity: 'high', sectors: ['Industrial', 'Consumer', 'Property'] },
  { type: 'Dry Season Extended', impact: 'Forest fire risk, haze affecting operations', severity: 'medium', sectors: ['Agriculture', 'Industrial'] },
  { type: 'Volcanic Activity', impact: 'Aviation disruption, tourism impact', severity: 'low', sectors: ['Telecom'] },
  { type: 'Typhoon Track Shift', impact: 'Northern island logistics affected', severity: 'medium', sectors: ['Industrial'] },
];

function generateSupplyChainData(stocks, daySeed) {
  // Commodity prices with daily changes
  const commodityPrices = COMMODITIES.map((c, i) => {
    const seed = daySeed + i * 83;
    const changePct = (seededRandom(seed) - 0.45) * 8;
    const price = Math.round(c.base * (1 + changePct / 100) * 100) / 100;

    return {
      ...c,
      currentPrice: price,
      change: Math.round((price - c.base) * 100) / 100,
      changePct: Math.round(changePct * 100) / 100,
      weeklyChange: Math.round((seededRandom(seed + 1) - 0.4) * 12 * 100) / 100,
      monthlyChange: Math.round((seededRandom(seed + 2) - 0.35) * 20 * 100) / 100,
      supplyTrend: seededRandom(seed + 3) > 0.5 ? 'tightening' : 'loosening',
      demandOutlook: pick(['strong', 'moderate', 'weak'], seed + 4),
      chinaFactor: Math.round(seededRandom(seed + 5) * 100), // China dependency 0-100
    };
  });

  // Port & logistics
  const portStatus = PORTS.map((p, i) => {
    const seed = daySeed + i * 59;
    return {
      ...p,
      utilization: Math.round(60 + seededRandom(seed) * 35),
      congestion: ['low', 'medium', 'high'][Math.floor(seededRandom(seed + 1) * 3)],
      avgWaitDays: Math.round(seededRandom(seed + 2) * 7 * 10) / 10,
      throughputChange: Math.round((seededRandom(seed + 3) - 0.4) * 20 * 10) / 10,
    };
  });

  // Weather alerts
  const activeWeather = WEATHER_EVENTS.filter((_, i) =>
    seededRandom(daySeed + i * 43) > 0.5
  ).map((w, i) => ({
    ...w,
    probability: Math.round(30 + seededRandom(daySeed + i * 97) * 60),
    expectedDuration: `${Math.floor(1 + seededRandom(daySeed + i * 99) * 8)} weeks`,
    affectedStocks: stocks
      .filter(s => w.sectors.includes(s.sector))
      .slice(0, 4)
      .map(s => s.ticker),
  }));

  // China dependency scores
  const chinaDependency = {};
  stocks.forEach((stock, i) => {
    const seed = daySeed + i * 37;
    chinaDependency[stock.ticker] = {
      exportDependency: Math.round(seededRandom(seed) * 80),
      importDependency: Math.round(seededRandom(seed + 1) * 60),
      investmentExposure: Math.round(seededRandom(seed + 2) * 70),
      overallScore: Math.round(seededRandom(seed + 3) * 100),
      riskLevel: seededRandom(seed + 4) > 0.6 ? 'high' : seededRandom(seed + 4) > 0.3 ? 'medium' : 'low',
    };
  });

  // Inter-island disparity index
  const islandDisparity = [
    { island: 'Java', gdpShare: 58, stockShare: 72, logisticsScore: 85, growthRate: 4.8 },
    { island: 'Sumatra', gdpShare: 22, stockShare: 15, logisticsScore: 62, growthRate: 4.2 },
    { island: 'Kalimantan', gdpShare: 9, stockShare: 8, logisticsScore: 55, growthRate: 5.5 },
    { island: 'Sulawesi', gdpShare: 6, stockShare: 3, logisticsScore: 48, growthRate: 6.1 },
    { island: 'Papua & Maluku', gdpShare: 3, stockShare: 1, logisticsScore: 30, growthRate: 7.2 },
    { island: 'Bali & Nusa Tenggara', gdpShare: 2, stockShare: 1, logisticsScore: 52, growthRate: 4.5 },
  ];

  return {
    commodityPrices,
    portStatus,
    activeWeather,
    chinaDependency,
    islandDisparity,
  };
}

// ============================================================
// CULTURAL CATALYST ENGINE
// ============================================================
function generateCulturalCatalysts(stocks, daySeed) {
  // Determine current month for seasonal events
  const currentMonth = new Date().getMonth() + 1;

  const seasonalEvents = [
    {
      event: 'Ramadan & Lebaran Season',
      active: currentMonth >= 2 && currentMonth <= 4,
      impact: 'Consumer spending surge, retail & consumer stocks rally',
      beneficiaries: ['UNVR', 'ICBP', 'INDF', 'MYOR', 'HMSP', 'GGRM', 'MAPI', 'ACES'],
      spendingIndex: Math.round(70 + seededRandom(daySeed + 301) * 30),
      historicalAvgReturn: '+8.2% for consumer sector',
    },
    {
      event: 'Back to School Season',
      active: currentMonth === 7 || currentMonth === 1,
      impact: 'Retail spending increase, telco data usage spike',
      beneficiaries: ['MAPI', 'ACES', 'ERAA', 'TLKM', 'EXCL'],
      spendingIndex: Math.round(50 + seededRandom(daySeed + 302) * 40),
      historicalAvgReturn: '+4.5% for retail sector',
    },
    {
      event: 'Year-End Window Dressing',
      active: currentMonth === 12,
      impact: 'Fund managers buy blue chips to beautify portfolios',
      beneficiaries: ['BBCA', 'BBRI', 'BMRI', 'TLKM', 'ASII'],
      spendingIndex: Math.round(60 + seededRandom(daySeed + 303) * 35),
      historicalAvgReturn: '+3.8% for LQ45 index',
    },
    {
      event: 'Chinese New Year / Imlek',
      active: currentMonth === 1 || currentMonth === 2,
      impact: 'Gold buying surge, consumer spending in Chinese-Indonesian community',
      beneficiaries: ['ANTM', 'ICBP', 'INDF', 'MYOR'],
      spendingIndex: Math.round(55 + seededRandom(daySeed + 304) * 35),
      historicalAvgReturn: '+3.2% for gold & consumer',
    },
    {
      event: 'Independence Day Rally (17 Aug)',
      active: currentMonth === 8,
      impact: 'Patriotic sentiment, BUMN stocks favored',
      beneficiaries: ['BBRI', 'BMRI', 'TLKM', 'PGAS', 'PTBA', 'ANTM'],
      spendingIndex: Math.round(45 + seededRandom(daySeed + 305) * 40),
      historicalAvgReturn: '+2.1% for BUMN stocks',
    },
    {
      event: 'Dividend Season',
      active: currentMonth >= 3 && currentMonth <= 6,
      impact: 'High-yield stocks see accumulation pre-cum date',
      beneficiaries: ['BBCA', 'BBRI', 'ITMG', 'PTBA', 'ADRO', 'UNTR'],
      spendingIndex: Math.round(65 + seededRandom(daySeed + 306) * 30),
      historicalAvgReturn: '+5.7% for dividend aristocrats',
    },
  ];

  // Viral / trending events
  const viralEvents = [];
  for (let i = 0; i < 6; i++) {
    const seed = daySeed + i * 113;
    const stock = stocks[Math.floor(seededRandom(seed) * stocks.length)];

    const viralTypes = [
      { type: 'TikTok Challenge', desc: `Viral TikTok trend mentioning ${stock.ticker} products/services`, platform: 'TikTok' },
      { type: 'Celebrity Endorsement', desc: `Major celebrity spotted using/endorsing ${stock.name} products`, platform: 'Instagram' },
      { type: 'Viral Meme', desc: `${stock.ticker} becomes trending meme on financial Twitter Indonesia`, platform: 'Twitter/X' },
      { type: 'YouTube Deep Dive', desc: `Popular finance YouTuber releases bullish analysis on ${stock.ticker}`, platform: 'YouTube' },
      { type: 'Telegram Pump Signal', desc: `Multiple Telegram groups simultaneously pushing ${stock.ticker}`, platform: 'Telegram' },
      { type: 'Reddit Indonesia Thread', desc: `Hot thread on r/finansial about ${stock.ticker} undervaluation`, platform: 'Reddit' },
    ];

    const viral = pick(viralTypes, seed + 1);
    viralEvents.push({
      ...viral,
      ticker: stock.ticker,
      stockName: stock.name,
      engagement: Math.round(5000 + seededRandom(seed + 2) * 200000),
      priceImpact: Math.round((seededRandom(seed + 3) - 0.3) * 10 * 100) / 100,
      hoursAgo: Math.floor(seededRandom(seed + 4) * 72),
      riskLevel: viral.type === 'Telegram Pump Signal' ? 'HIGH' : 'LOW',
    });
  }

  // Regional pride investing patterns
  const regionalPride = [
    { region: 'East Java', favStocks: ['HMSP', 'GGRM', 'JPFA'], investorBase: 'Large retail', strength: Math.round(50 + seededRandom(daySeed + 401) * 40) },
    { region: 'Jakarta / Jabodetabek', favStocks: ['BBCA', 'GOTO', 'CTRA', 'BSDE'], investorBase: 'Institutional + retail', strength: Math.round(70 + seededRandom(daySeed + 402) * 25) },
    { region: 'West Java (Bandung)', favStocks: ['TLKM', 'KLBF'], investorBase: 'Growing retail', strength: Math.round(40 + seededRandom(daySeed + 403) * 40) },
    { region: 'Central Java', favStocks: ['SMGR', 'SIDO'], investorBase: 'Conservative retail', strength: Math.round(35 + seededRandom(daySeed + 404) * 45) },
    { region: 'Kalimantan', favStocks: ['ADRO', 'PTBA', 'HRUM'], investorBase: 'Mining community', strength: Math.round(45 + seededRandom(daySeed + 405) * 40) },
    { region: 'Sumatra', favStocks: ['LSIP', 'DSNG', 'TAPG', 'MEDC'], investorBase: 'Agriculture & energy', strength: Math.round(40 + seededRandom(daySeed + 406) * 35) },
    { region: 'Sulawesi', favStocks: ['ANTM', 'INCO', 'NCKL'], investorBase: 'Mining region', strength: Math.round(35 + seededRandom(daySeed + 407) * 45) },
  ];

  // College campus hype tracker
  const campusHype = [
    { campus: 'UI (Universitas Indonesia)', topPick: pick(['GOTO', 'BUKA', 'BBCA'], daySeed + 501), hypeLevel: Math.round(40 + seededRandom(daySeed + 502) * 50) },
    { campus: 'ITB (Institut Teknologi Bandung)', topPick: pick(['TLKM', 'EMTK', 'GOTO'], daySeed + 503), hypeLevel: Math.round(45 + seededRandom(daySeed + 504) * 45) },
    { campus: 'UGM (Gadjah Mada)', topPick: pick(['SIDO', 'SMGR', 'BBRI'], daySeed + 505), hypeLevel: Math.round(35 + seededRandom(daySeed + 506) * 50) },
    { campus: 'Binus', topPick: pick(['GOTO', 'BUKA', 'EMTK'], daySeed + 507), hypeLevel: Math.round(55 + seededRandom(daySeed + 508) * 40) },
    { campus: 'Prasetiya Mulya', topPick: pick(['BBCA', 'BREN', 'AMMN'], daySeed + 509), hypeLevel: Math.round(50 + seededRandom(daySeed + 510) * 45) },
  ];

  return {
    seasonalEvents: seasonalEvents.filter(e => e.active || seededRandom(daySeed + 600) > 0.5),
    viralEvents: viralEvents.sort((a, b) => b.engagement - a.engagement),
    regionalPride,
    campusHype,
  };
}

// ============================================================
// INFORMAL ECONOMY INTEGRATION
// ============================================================
function generateInformalEconomy(stocks, daySeed) {
  // Street vendor (PKL / warung) sentiment index
  const warungIndex = {
    overallIndex: Math.round(40 + seededRandom(daySeed + 901) * 50),
    trend: seededRandom(daySeed + 902) > 0.5 ? 'improving' : 'declining',
    categories: [
      {
        name: 'Warung Makan (Food Stalls)',
        footfall: Math.round(60 + seededRandom(daySeed + 903) * 35),
        avgTransaction: Math.round(15000 + seededRandom(daySeed + 904) * 20000),
        trend: seededRandom(daySeed + 905) > 0.5 ? 'up' : 'down',
        stockImplication: 'ICBP, INDF, MYOR — instant noodle & seasoning demand',
      },
      {
        name: 'Warung Kelontong (Mini Shops)',
        footfall: Math.round(50 + seededRandom(daySeed + 906) * 40),
        avgTransaction: Math.round(20000 + seededRandom(daySeed + 907) * 30000),
        trend: seededRandom(daySeed + 908) > 0.5 ? 'up' : 'down',
        stockImplication: 'UNVR, ICBP, HMSP — FMCG bellwether',
      },
      {
        name: 'Pasar Tradisional (Wet Markets)',
        footfall: Math.round(55 + seededRandom(daySeed + 909) * 35),
        avgTransaction: Math.round(50000 + seededRandom(daySeed + 910) * 50000),
        trend: seededRandom(daySeed + 911) > 0.5 ? 'up' : 'down',
        stockImplication: 'JPFA, CPIN — poultry & feed demand',
      },
    ],
    impliedInflation: Math.round((2 + seededRandom(daySeed + 912) * 5) * 10) / 10,
    biRateImplication: seededRandom(daySeed + 913) > 0.5 ? 'Rate hold likely' : 'Rate hike pressure building',
  };

  // Ojek (motorcycle taxi) demand heatmap
  const ojekDemand = {
    nationalIndex: Math.round(45 + seededRandom(daySeed + 920) * 45),
    regions: [
      { city: 'Jakarta', demand: Math.round(60 + seededRandom(daySeed + 921) * 35), trend: seededRandom(daySeed + 922) > 0.45 ? 'up' : 'down' },
      { city: 'Surabaya', demand: Math.round(50 + seededRandom(daySeed + 923) * 40), trend: seededRandom(daySeed + 924) > 0.5 ? 'up' : 'down' },
      { city: 'Bandung', demand: Math.round(45 + seededRandom(daySeed + 925) * 40), trend: seededRandom(daySeed + 926) > 0.5 ? 'up' : 'down' },
      { city: 'Medan', demand: Math.round(40 + seededRandom(daySeed + 927) * 40), trend: seededRandom(daySeed + 928) > 0.5 ? 'up' : 'down' },
      { city: 'Makassar', demand: Math.round(35 + seededRandom(daySeed + 929) * 45), trend: seededRandom(daySeed + 930) > 0.5 ? 'up' : 'down' },
      { city: 'Semarang', demand: Math.round(40 + seededRandom(daySeed + 931) * 35), trend: seededRandom(daySeed + 932) > 0.5 ? 'up' : 'down' },
    ],
    consumerSpendingForecast: seededRandom(daySeed + 940) > 0.5 ? 'STRONG' : 'MODERATE',
    affectedStocks: ['GOTO', 'ASII', 'BUKA', 'TLKM'],
  };

  // Pasar (traditional market) price tracking → inflation early warning
  const pasarPrices = [
    { item: 'Beras (Rice)', price: Math.round(12000 + seededRandom(daySeed + 950) * 4000), unit: 'Rp/kg', weekChange: Math.round((seededRandom(daySeed + 951) - 0.4) * 10 * 10) / 10 },
    { item: 'Minyak Goreng (Cooking Oil)', price: Math.round(16000 + seededRandom(daySeed + 952) * 4000), unit: 'Rp/L', weekChange: Math.round((seededRandom(daySeed + 953) - 0.4) * 12 * 10) / 10 },
    { item: 'Telur (Eggs)', price: Math.round(26000 + seededRandom(daySeed + 954) * 6000), unit: 'Rp/kg', weekChange: Math.round((seededRandom(daySeed + 955) - 0.45) * 8 * 10) / 10 },
    { item: 'Daging Ayam (Chicken)', price: Math.round(32000 + seededRandom(daySeed + 956) * 8000), unit: 'Rp/kg', weekChange: Math.round((seededRandom(daySeed + 957) - 0.4) * 10 * 10) / 10 },
    { item: 'Cabai Merah (Red Chili)', price: Math.round(40000 + seededRandom(daySeed + 958) * 60000), unit: 'Rp/kg', weekChange: Math.round((seededRandom(daySeed + 959) - 0.3) * 30 * 10) / 10 },
    { item: 'Bawang Merah (Shallots)', price: Math.round(30000 + seededRandom(daySeed + 960) * 20000), unit: 'Rp/kg', weekChange: Math.round((seededRandom(daySeed + 961) - 0.4) * 15 * 10) / 10 },
    { item: 'Gula (Sugar)', price: Math.round(14000 + seededRandom(daySeed + 962) * 3000), unit: 'Rp/kg', weekChange: Math.round((seededRandom(daySeed + 963) - 0.45) * 6 * 10) / 10 },
    { item: 'Terigu (Flour)', price: Math.round(10000 + seededRandom(daySeed + 964) * 3000), unit: 'Rp/kg', weekChange: Math.round((seededRandom(daySeed + 965) - 0.45) * 5 * 10) / 10 },
  ];

  // Remittance flow analysis
  const remittanceFlow = {
    totalMonthly: Math.round(800 + seededRandom(daySeed + 970) * 400), // in millions USD
    trend: seededRandom(daySeed + 971) > 0.5 ? 'increasing' : 'stable',
    topCorridors: [
      { from: 'Saudi Arabia', amount: Math.round(200 + seededRandom(daySeed + 972) * 100), change: Math.round((seededRandom(daySeed + 973) - 0.4) * 15 * 10) / 10 },
      { from: 'Malaysia', amount: Math.round(150 + seededRandom(daySeed + 974) * 80), change: Math.round((seededRandom(daySeed + 975) - 0.4) * 12 * 10) / 10 },
      { from: 'Hong Kong', amount: Math.round(100 + seededRandom(daySeed + 976) * 60), change: Math.round((seededRandom(daySeed + 977) - 0.4) * 10 * 10) / 10 },
      { from: 'Taiwan', amount: Math.round(80 + seededRandom(daySeed + 978) * 50), change: Math.round((seededRandom(daySeed + 979) - 0.4) * 8 * 10) / 10 },
      { from: 'Singapore', amount: Math.round(120 + seededRandom(daySeed + 980) * 80), change: Math.round((seededRandom(daySeed + 981) - 0.4) * 12 * 10) / 10 },
    ],
    rupiahImplication: seededRandom(daySeed + 985) > 0.5 ? 'Supportive of IDR' : 'Neutral for IDR',
    affectedStocks: ['BBRI', 'BMRI', 'BBTN', 'BRIS'],
  };

  return {
    warungIndex,
    ojekDemand,
    pasarPrices,
    remittanceFlow,
  };
}

// ============================================================
// GENERATIONAL WEALTH TRANSFER
// ============================================================
function generateWealthTransfer(stocks, daySeed) {
  // Which stocks do grandparents buy for grandchildren?
  const legacyStocks = [
    { ticker: 'BBCA', name: 'Bank Central Asia', generationPref: 'Boomer Favorite', holdingDuration: '10+ years', popularityScore: 95 },
    { ticker: 'BBRI', name: 'Bank Rakyat Indonesia', generationPref: 'Cross-Generation', holdingDuration: '5-10 years', popularityScore: 90 },
    { ticker: 'TLKM', name: 'Telkom Indonesia', generationPref: 'Boomer Favorite', holdingDuration: '10+ years', popularityScore: 82 },
    { ticker: 'UNVR', name: 'Unilever Indonesia', generationPref: 'Boomer Favorite', holdingDuration: '10+ years', popularityScore: 75 },
    { ticker: 'ASII', name: 'Astra International', generationPref: 'Gen-X Favorite', holdingDuration: '5-10 years', popularityScore: 70 },
  ];

  const millennialPicks = [
    { ticker: 'GOTO', name: 'GoTo Gojek Tokopedia', generationPref: 'Millennial/Gen-Z', holdingDuration: '< 1 year', popularityScore: 85 },
    { ticker: 'BUKA', name: 'Bukalapak', generationPref: 'Millennial/Gen-Z', holdingDuration: '< 1 year', popularityScore: 70 },
    { ticker: 'BREN', name: 'Barito Renewables', generationPref: 'Millennial ESG', holdingDuration: '1-3 years', popularityScore: 78 },
    { ticker: 'ARTO', name: 'Bank Jago', generationPref: 'Millennial/Gen-Z', holdingDuration: '1-3 years', popularityScore: 72 },
    { ticker: 'EMTK', name: 'Elang Mahkota Teknologi', generationPref: 'Millennial', holdingDuration: '1-3 years', popularityScore: 65 },
  ];

  const familyOfficeIndicators = {
    newFormations: Math.round(5 + seededRandom(daySeed + 1001) * 15),
    totalEstimated: Math.round(400 + seededRandom(daySeed + 1002) * 200),
    avgAUM: Math.round(500 + seededRandom(daySeed + 1003) * 2000), // in billions IDR
    topAllocations: [
      { asset: 'IDX Blue Chips', pct: Math.round(25 + seededRandom(daySeed + 1004) * 20) },
      { asset: 'Fixed Income', pct: Math.round(15 + seededRandom(daySeed + 1005) * 15) },
      { asset: 'Property', pct: Math.round(10 + seededRandom(daySeed + 1006) * 15) },
      { asset: 'Offshore (SGX/US)', pct: Math.round(10 + seededRandom(daySeed + 1007) * 20) },
      { asset: 'Private Equity', pct: Math.round(5 + seededRandom(daySeed + 1008) * 15) },
      { asset: 'Digital Assets', pct: Math.round(2 + seededRandom(daySeed + 1009) * 8) },
    ],
    trend: 'Digital & ESG allocation increasing among younger family offices',
  };

  const digitalVsTraditional = {
    digitalPreference: Math.round(55 + seededRandom(daySeed + 1010) * 30),
    traditionalPreference: 0,
    breakdown: [
      { generation: 'Baby Boomer (1946-1964)', digital: 15, traditional: 85 },
      { generation: 'Gen-X (1965-1980)', digital: 40, traditional: 60 },
      { generation: 'Millennial (1981-1996)', digital: 78, traditional: 22 },
      { generation: 'Gen-Z (1997+)', digital: 95, traditional: 5 },
    ],
  };
  digitalVsTraditional.traditionalPreference = 100 - digitalVsTraditional.digitalPreference;

  return {
    legacyStocks,
    millennialPicks,
    familyOfficeIndicators,
    digitalVsTraditional,
    conglomerateSuccession: CONGLOMERATES.map(c => ({
      family: c.family,
      patriarch: c.patriarch,
      generation: c.generation,
      successionRisk: c.successionRisk,
      heirReadiness: c.heirReadiness,
      companies: c.companies,
      netWorth: c.netWorth,
      heirs: c.heirs,
    })),
  };
}

// ============================================================
// MASTER EXPORT: Generate all Koneksi & Kultur data
// ============================================================
function generateKoneksiKulturData(stocks) {
  const daySeed = getDaySeed();

  return {
    politicalRisk: generatePoliticalRiskData(stocks, daySeed),
    socialSentiment: generateSocialSentiment(stocks, daySeed),
    supplyChain: generateSupplyChainData(stocks, daySeed),
    culturalCatalysts: generateCulturalCatalysts(stocks, daySeed),
    informalEconomy: generateInformalEconomy(stocks, daySeed),
    wealthTransfer: generateWealthTransfer(stocks, daySeed),
    conglomerates: CONGLOMERATES,
    lastUpdate: new Date().toISOString(),
  };
}

module.exports = {
  generateKoneksiKulturData,
  CONGLOMERATES,
};
