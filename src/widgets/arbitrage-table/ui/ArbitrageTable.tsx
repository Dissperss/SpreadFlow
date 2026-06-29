import { useStockFuturesArb } from '@/features/quotes'
import styles from './ArbitrageTable.module.css'

const formatPct = (value: number) =>
    `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`

export const ArbitrageTable = () => {
    const { data, isLoading, isError } = useStockFuturesArb()
    const rows = data ?? []

    return (
        <section className={styles.table_section}>
            <h2 className={styles.table_title}>Arbitrage Scanner</h2>

            {isLoading && <p className={styles.status}>Loading MOEX spreads...</p>}
            {isError && (
                <p className={styles.status_error}>
                    Failed to load spreads. Check dev server proxy to MOEX ISS.
                </p>
            )}

            {!isLoading && !isError && (
                <div className={styles.table_wrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Ticker</th>
                                <th>Spot</th>
                                <th>Future</th>
                                <th>Spread</th>
                                <th>Fair Value</th>
                                <th>Expected Profit</th>
                                <th>Liquidity</th>
                                <th>Signal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 && (
                                <tr>
                                    <td colSpan={8} className={styles.empty}>
                                        No MOEX spreads available.
                                    </td>
                                </tr>
                            )}

                            {rows.map((row) => (
                                <tr key={`${row.ticker}-${row.futureSecid}`}>
                                    <td className={styles.ticker_cell}>
                                        {row.ticker}
                                    </td>
                                    <td>{row.spot.toLocaleString('ru-RU')}</td>
                                    <td>{row.future.toLocaleString('ru-RU')}</td>
                                    <td
                                        className={
                                            row.spread >= 0
                                                ? styles.spread_positive
                                                : styles.spread_negative
                                        }
                                    >
                                        {formatPct(row.spread)}
                                    </td>
                                    <td>{row.fairValue.toLocaleString('ru-RU')}</td>
                                    <td
                                        className={
                                            row.expectedProfit >= 0
                                                ? styles.profit_positive
                                                : styles.profit_negative
                                        }
                                    >
                                        {formatPct(row.expectedProfit)}
                                    </td>
                                    <td>
                                        <span
                                            className={`${styles.liquidity} ${styles[`liquidity_${row.liquidity.toLowerCase()}`]}`}
                                        >
                                            {row.liquidity}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={`${styles.signal} ${styles[`signal_${row.signal}`]}`}
                                        >
                                            {row.signal.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}
