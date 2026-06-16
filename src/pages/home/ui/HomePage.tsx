import { HeroSection } from '@/widgets/hero-section'
import { StatisticsSection } from '@/widgets/statistics-section'
import { MarketOverview } from '@/widgets/market-overview'
import { ArbitrageTable } from '@/widgets/arbitrage-table'
import { WatchlistSection } from '@/widgets/watchlist-section'
import { NewsSection } from '@/widgets/news-section'
import { HeatmapSection } from '@/widgets/heatmap-section'

export const HomePage = () => {
    return (
        <>
            <HeroSection />
            <StatisticsSection />
            <MarketOverview />
            <ArbitrageTable />
            <WatchlistSection />
            <NewsSection />
            <HeatmapSection />
        </>
    )
}
