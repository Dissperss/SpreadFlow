import { useMemo, useState } from 'react'
import type { ArbSignal } from '@/entities/spread'
import { useStockFuturesArb } from '@/features/quotes'
import styles from './StockFuturesPage.module.css'

type SortKey = keyof Pick<
    ArbSignal,
    'ticker' | 'spread' | 'expectedProfit' | 'impliedRepo' | 'daysToExpiry'
>

const formatPct = (value: number) =>
    `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`

const formatPrice = (value: number) =>
    value.toLocaleString('ru-RU', { maximumFractionDigits: 2 })

export const StockFuturesPage = () => {
    const { data, isLoading, isError, error } = useStockFuturesArb()
    const [sortKey, setSortKey] = useState<SortKey>('expectedProfit')
    const [sortDesc, setSortDesc] = useState(true)

    const rows = useMemo(() => {
        const list = [...(data ?? [])]
        list.sort((a, b) => {
            const left = a[sortKey] ?? 0
            const right = b[sortKey] ?? 0
            return sortDesc ? Number(right) - Number(left) : Number(left) - Number(right)
        })
        return list
    }, [data, sortDesc, sortKey])

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDesc((prev) => !prev)
            return
        }
        setSortKey(key)
        setSortDesc(true)
    }

    const sortIndicator = (key: SortKey) =>
        sortKey === key ? (sortDesc ? ' ↓' : ' ↑') : ''

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Stock / Futures Arbitrage</h1>
                    <p className={styles.subtitle}>
                        Cash-and-carry spreads for MOEX equities (spot TQBR vs nearest FORTS contract)
                    </p>
                </div>
            </header>

            {isLoading && <p className={styles.status}>Loading MOEX quotes...</p>}
            {isError && (
                <p className={styles.error}>
                    Failed to load quotes: {error instanceof Error ? error.message : 'Unknown error'}
                </p>
            )}

            {!isLoading && !isError && (
                <div className={styles.table_wrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>
                                    <button type="button" className={styles.sort_btn} onClick={() => handleSort('ticker')}>
                                        Ticker{sortIndicator('ticker')}
                                    </button>
                                </th>
                                <th>Future</th>
                                <th>Spot</th>
                                <th>Future Px</th>
                                <th>
                                    <button type="button" className={styles.sort_btn} onClick={() => handleSort('spread')}>
                                        Spread{sortIndicator('spread')}
                                    </button>
                                </th>
                                <th>Fair Value</th>
                                <th>
                                    <button type="button" className={styles.sort_btn} onClick={() => handleSort('expectedProfit')}>
                                        Exp. Profit{sortIndicator('expectedProfit')}
                                    </button>
                                </th>
                                <th>
                                    <button type="button" className={styles.sort_btn} onClick={() => handleSort('impliedRepo')}>
                                        Implied Repo{sortIndicator('impliedRepo')}
                                    </button>
                                </th>
                                <th>
                                    <button type="button" className={styles.sort_btn} onClick={() => handleSort('daysToExpiry')}>
                                        DTE{sortIndicator('daysToExpiry')}
                                    </button>
                                </th>
                                <th>Liquidity</th>
                                <th>Signal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr key={`${row.ticker}-${row.futureSecid}`}>
                                    <td className={styles.ticker}>{row.ticker}</td>
                                    <td className={styles.muted}>{row.futureSecid}</td>
                                    <td>{formatPrice(row.spot)}</td>
                                    <td>{formatPrice(row.future)}</td>
                                    <td className={row.spread >= 0 ? styles.positive : styles.negative}>
                                        {formatPct(row.spread)}
                                    </td>
                                    <td>{formatPrice(row.fairValue)}</td>
                                    <td className={row.expectedProfit >= 0 ? styles.positive : styles.negative}>
                                        {formatPct(row.expectedProfit)}
                                    </td>
                                    <td>{formatPct(row.impliedRepo ?? 0)}</td>
                                    <td>{row.daysToExpiry ?? '—'}</td>
                                    <td>
                                        <span className={`${styles.liquidity} ${styles[`liquidity_${row.liquidity.toLowerCase()}`]}`}>
                                            {row.liquidity}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.signal} ${styles[`signal_${row.signal}`]}`}>
                                            {row.signal.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
