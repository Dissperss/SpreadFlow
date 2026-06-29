import { useMemo } from 'react'
import type { CalendarSpread } from '@/entities/spread'
import { useCalendarSpreads } from '@/features/quotes'
import styles from './CalendarSpreadsPage.module.css'

const formatPct = (value: number) =>
    `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`

const formatPrice = (value: number) =>
    value.toLocaleString('ru-RU', { maximumFractionDigits: 2 })

const groupByAsset = (rows: CalendarSpread[]) => {
    const groups = new Map<string, CalendarSpread[]>()

    for (const row of rows) {
        const key = row.assetCode
        const list = groups.get(key) ?? []
        list.push(row)
        groups.set(key, list)
    }

    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
}

export const CalendarSpreadsPage = () => {
    const { data, isLoading, isError, error } = useCalendarSpreads()

    const groups = useMemo(() => groupByAsset(data ?? []), [data])

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Calendar Spreads</h1>
                    <p className={styles.subtitle}>
                        Near vs far FORTS contracts grouped by underlying asset
                    </p>
                </div>
            </header>

            {isLoading && <p className={styles.status}>Loading calendar spreads...</p>}
            {isError && (
                <p className={styles.error}>
                    Failed to load spreads: {error instanceof Error ? error.message : 'Unknown error'}
                </p>
            )}

            {!isLoading && !isError && (
                <div className={styles.groups}>
                    {groups.map(([assetCode, rows]) => (
                        <section key={assetCode} className={styles.group}>
                            <h2 className={styles.group_title}>
                                {rows[0]?.underlying ?? assetCode}
                                <span className={styles.group_code}>{assetCode}</span>
                            </h2>

                            <div className={styles.table_wrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Near</th>
                                            <th>Far</th>
                                            <th>Near Px</th>
                                            <th>Far Px</th>
                                            <th>Spread</th>
                                            <th>Spread %</th>
                                            <th>Roll Yield</th>
                                            <th>Days</th>
                                            <th>Liquidity</th>
                                            <th>Signal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row) => (
                                            <tr key={`${row.nearSecid}-${row.farSecid}`}>
                                                <td className={styles.contract}>{row.nearSecid}</td>
                                                <td className={styles.contract}>{row.farSecid}</td>
                                                <td>{formatPrice(row.nearPrice)}</td>
                                                <td>{formatPrice(row.farPrice)}</td>
                                                <td className={row.calendarSpread >= 0 ? styles.positive : styles.negative}>
                                                    {formatPrice(row.calendarSpread)}
                                                </td>
                                                <td className={row.calendarSpreadPct >= 0 ? styles.positive : styles.negative}>
                                                    {formatPct(row.calendarSpreadPct)}
                                                </td>
                                                <td className={row.rollYield >= 0 ? styles.positive : styles.negative}>
                                                    {formatPct(row.rollYield)}
                                                </td>
                                                <td>{row.daysBetween}</td>
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
                        </section>
                    ))}
                </div>
            )}
        </div>
    )
}
