import { useStockFuturesArb } from '@/features/quotes'
import { STOCK_FUTURES_UNIVERSE } from '@/shared/config/moexUniverse'
import styles from './StatisticsSection.module.css'

type StatItem = {
    label: string
    value: string
    change?: string
    changeType?: 'positive' | 'negative'
}

export const StatisticsSection = () => {
    const { data } = useStockFuturesArb()
    const rows = data ?? []
    const activeSignals = rows.filter((row) => row.signal !== 'neutral')
    const spreads = rows.map((row) => row.spread)
    const avgSpread =
        spreads.length > 0
            ? spreads.reduce((sum, value) => sum + value, 0) / spreads.length
            : 0
    const maxSpread =
        spreads.length > 0 ? Math.max(...spreads.map(Math.abs)) : 0

    const statistics: StatItem[] = [
        { label: 'MOEX Pairs Monitored', value: String(STOCK_FUTURES_UNIVERSE.length) },
        {
            label: 'Active Opportunities',
            value: String(activeSignals.length),
            change: activeSignals.length > 0 ? `${activeSignals.length} live` : undefined,
            changeType: 'positive' as const,
        },
        {
            label: 'Average Spread',
            value: `${avgSpread.toFixed(2)}%`,
        },
        {
            label: 'Largest Spread',
            value: `${maxSpread.toFixed(2)}%`,
        },
        {
            label: 'Signals Today',
            value: String(activeSignals.length),
        },
        { label: 'Data Source', value: 'MOEX ISS' },
    ]

    return (
        <section className={styles.stats}>
            {statistics.map((stat) => (
                <div key={stat.label} className={styles.stats__card}>
                    <span className={styles.stats__label}>{stat.label}</span>
                    <div className={styles.stats__value_row}>
                        <span className={styles.stats__value}>{stat.value}</span>
                        {stat.change && (
                            <span
                                className={`${styles.stats__change} ${stat.changeType === 'positive' ? styles.stats__change_positive : stat.changeType === 'negative' ? styles.stats__change_negative : ''}`}
                            >
                                {stat.change}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </section>
    )
}
