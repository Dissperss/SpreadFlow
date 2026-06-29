import { StatisticsSection } from '@/widgets/statistics-section'
import { MarketOverview } from '@/widgets/market-overview'
import { ArbitrageTable } from '@/widgets/arbitrage-table'
import { WatchlistSection } from '@/widgets/watchlist-section'

export const HomePage = () => {
    return (
        <>
            <StatisticsSection />
            <MarketOverview />
            <ArbitrageTable />
            <WatchlistSection />
        </>
    )
}
