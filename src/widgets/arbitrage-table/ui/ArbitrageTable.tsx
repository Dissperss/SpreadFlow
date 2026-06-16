import { arbitrageSignals } from '@/pages/home/lib/mock'
import styles from './ArbitrageTable.module.css'

const signalLabels = {
    buy: { text: 'Buy', className: styles.signal_buy },
    sell: { text: 'Sell', className: styles.signal_sell },
    neutral: { text: 'Neutral', className: styles.signal_neutral },
}

export const ArbitrageTable = () => {
    return (
        <section className={styles.table_section}>
            <h2 className={styles.table_title}>Arbitrage Scanner</h2>
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
                        {arbitrageSignals.map((row) => (
                            <tr key={row.ticker}>
                                <td className={styles.ticker_cell}>{row.ticker}</td>
                                <td>{row.spot.toLocaleString()}</td>
                                <td>{row.future.toLocaleString()}</td>
                                <td className={row.spread >= 0 ? styles.spread_positive : styles.spread_negative}>
                                    {row.spread >= 0 ? '+' : ''}{row.spread}%
                                </td>
                                <td>{row.fairValue.toLocaleString()}</td>
                                <td className={row.expectedProfit >= 0 ? styles.profit_positive : styles.profit_negative}>
                                    {row.expectedProfit >= 0 ? '+' : ''}{row.expectedProfit}%
                                </td>
                                <td>
                                    <span className={`${styles.liquidity} ${styles[`liquidity_${row.liquidity.toLowerCase()}`]}`}>
                                        {row.liquidity}
                                    </span>
                                </td>
                                <td>
                                    <span className={`${styles.signal} ${signalLabels[row.signal].className}`}>
                                        {signalLabels[row.signal].text}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
