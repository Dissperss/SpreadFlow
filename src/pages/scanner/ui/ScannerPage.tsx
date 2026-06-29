import { Link } from 'react-router-dom'
import { useStockFuturesArb } from '@/features/quotes'
import styles from './ScannerPage.module.css'

export const ScannerPage = () => {
    const { data } = useStockFuturesArb()
    const activeSignals = (data ?? []).filter((row) => row.signal !== 'neutral')

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Arbitrage Scanner</h1>
            <p className={styles.subtitle}>
                Active MOEX cash-and-carry signals from the nearest futures contract.
            </p>

            <div className={styles.cards}>
                {activeSignals.length === 0 && (
                    <p className={styles.empty}>No active signals right now.</p>
                )}

                {activeSignals.map((row) => (
                    <article key={`${row.ticker}-${row.futureSecid}`} className={styles.card}>
                        <div className={styles.card_header}>
                            <span className={styles.ticker}>{row.ticker}</span>
                            <span className={`${styles.signal} ${styles[`signal_${row.signal}`]}`}>
                                {row.signal.toUpperCase()}
                            </span>
                        </div>
                        <p className={styles.meta}>
                            {row.futureSecid} · spread {row.spread.toFixed(2)}% · profit {row.expectedProfit.toFixed(2)}%
                        </p>
                    </article>
                ))}
            </div>

            <Link to="/stock-futures" className={styles.link}>
                Open full stock/futures table
            </Link>
        </div>
    )
}
