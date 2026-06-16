import { markets } from '@/pages/home/lib/mock'
import styles from './MarketOverview.module.css'

const Sparkline = ({ data }: { data: number[] }) => {
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const w = 80
    const h = 28
    const points = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w
        const y = h - ((v - min) / range) * (h - 4) - 2
        return `${x},${y}`
    })
    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p}`).join(' ')

    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
            <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export const MarketOverview = () => {
    return (
        <section className={styles.market_section}>
            <h2 className={styles.market_title}>Market Overview</h2>
            <div className={styles.market_grid}>
                {markets.map((m) => (
                    <div key={m.name} className={styles.market_card}>
                        <div className={styles.market_card_header}>
                            <span className={styles.market_name}>{m.name}</span>
                            <span className={`${styles.market_status} ${m.status === 'open' ? styles.market_status_open : styles.market_status_closed}`}>
                                {m.status === 'open' ? 'Open' : 'Closed'}
                            </span>
                        </div>
                        <div className={styles.market_card_body}>
                            <div className={styles.market_change_row}>
                                <span className={m.change >= 0 ? styles.market_change_positive : styles.market_change_negative}>
                                    {m.change >= 0 ? '+' : ''}{m.change}%
                                </span>
                                <span className={styles.market_volume}>{m.volume}</span>
                            </div>
                            <div className={m.change >= 0 ? styles.sparkline_positive : styles.sparkline_negative}>
                                <Sparkline data={m.sparkline} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
