export const statistics = [
    { label: 'Markets Monitored', value: '24' },
    { label: 'Active Opportunities', value: '7', change: '+3', changeType: 'positive' as const },
    { label: 'Average Spread', value: '0.34%', change: '-0.02%', changeType: 'positive' as const },
    { label: 'Largest Spread', value: '2.18%', change: '+0.47%', changeType: 'negative' as const },
    { label: 'Signals Today', value: '142', change: '+18', changeType: 'positive' as const },
    { label: 'Connected Exchanges', value: '12' },
]

export const markets = [
    {
        name: 'MOEX',
        status: 'open' as const,
        change: 0.42,
        volume: '₽ 84.2B',
        sparkline: [42, 48, 44, 52, 49, 55, 53, 58, 56, 60],
    },
    {
        name: 'Stocks',
        status: 'open' as const,
        change: -0.18,
        volume: '$ 32.7B',
        sparkline: [55, 52, 50, 51, 48, 46, 49, 47, 45, 44],
    },
    {
        name: 'Futures',
        status: 'open' as const,
        change: 0.63,
        volume: '$ 127.4B',
        sparkline: [38, 42, 40, 45, 48, 44, 50, 52, 49, 55],
    },
    {
        name: 'Crypto',
        status: 'open' as const,
        change: 1.24,
        volume: '₿ 18.6B',
        sparkline: [30, 38, 35, 42, 48, 44, 52, 50, 56, 62],
    },
    {
        name: 'Forex',
        status: 'open' as const,
        change: -0.05,
        volume: '$ 6.2T',
        sparkline: [50, 51, 49, 50, 48, 49, 50, 48, 47, 48],
    },
    {
        name: 'Commodities',
        status: 'closed' as const,
        change: 0.89,
        volume: '$ 43.1B',
        sparkline: [45, 48, 46, 52, 50, 55, 53, 58, 56, 60],
    },
]

export const arbitrageSignals = [
    { ticker: 'SBER', spot: 283.40, future: 285.15, spread: 0.62, fairValue: 284.80, expectedProfit: 0.35, liquidity: 'High', signal: 'buy' as const },
    { ticker: 'GAZP', spot: 162.30, future: 165.80, spread: 2.16, fairValue: 163.50, expectedProfit: 1.30, liquidity: 'High', signal: 'buy' as const },
    { ticker: 'LKOH', spot: 7110.00, future: 7145.00, spread: 0.49, fairValue: 7130.00, expectedProfit: 0.20, liquidity: 'Medium', signal: 'neutral' as const },
    { ticker: 'BTC/USD', spot: 67450, future: 68120, spread: 0.99, fairValue: 67800, expectedProfit: 0.48, liquidity: 'High', signal: 'buy' as const },
    { ticker: 'ETH/USD', spot: 3450, future: 3520, spread: 2.03, fairValue: 3480, expectedProfit: 0.87, liquidity: 'Medium', signal: 'sell' as const },
    { ticker: 'Si-6.26', spot: 92400, future: 92150, spread: -0.27, fairValue: 92300, expectedProfit: -0.16, liquidity: 'Low', signal: 'neutral' as const },
    { ticker: 'EUR/USD', spot: 1.0845, future: 1.0862, spread: 0.16, fairValue: 1.0855, expectedProfit: 0.07, liquidity: 'High', signal: 'buy' as const },
    { ticker: 'BRENT', spot: 82.40, future: 83.15, spread: 0.91, fairValue: 82.80, expectedProfit: 0.35, liquidity: 'Medium', signal: 'sell' as const },
]

export const watchlistItems = [
    { ticker: 'SBER', price: 283.40, change: 1.24, market: 'MOEX' },
    { ticker: 'GAZP', price: 162.30, change: -0.38, market: 'MOEX' },
    { ticker: 'BTC/USD', price: 67450, change: 2.15, market: 'Crypto' },
    { ticker: 'EUR/USD', price: 1.0845, change: 0.08, market: 'Forex' },
    { ticker: 'BRENT', price: 82.40, change: 0.92, market: 'Commodities' },
]

export const newsItems = [
    {
        title: 'MOEX Reports Record Trading Volume in Q2 2026',
        source: 'Reuters',
        time: '2h ago',
        category: 'Markets',
    },
    {
        title: 'Arbitrage Opportunities Surge Across Crypto Markets',
        source: 'Bloomberg',
        time: '4h ago',
        category: 'Crypto',
    },
    {
        title: 'Bank of Russia Holds Key Rate at 18%',
        source: 'Interfax',
        time: '6h ago',
        category: 'Macro',
    },
    {
        title: 'Futures Spread Tightens on Brent Crude Oil',
        source: 'Financial Times',
        time: '8h ago',
        category: 'Commodities',
    },
    {
        title: 'New Cross-Exchange Arbitrage Pairs Added',
        source: 'SpreadFlow',
        time: '12h ago',
        category: 'Platform',
    },
]

export const heatmapData = [
    { sector: 'Energy', change: 1.42, volume: 1240000000 },
    { sector: 'Financials', change: -0.38, volume: 980000000 },
    { sector: 'Technology', change: 0.85, volume: 2150000000 },
    { sector: 'Metals & Mining', change: 2.14, volume: 670000000 },
    { sector: 'Consumer', change: -0.62, volume: 540000000 },
    { sector: 'Healthcare', change: 0.21, volume: 430000000 },
]
