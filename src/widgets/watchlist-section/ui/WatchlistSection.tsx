import { watchlistItems } from '@/pages/home/lib/mock'
import styles from './WatchlistSection.module.css'

export const WatchlistSection = () => {
    return (
        <section className={styles.watchlist_section}>
            <h2 className={styles.watchlist_title}>Watchlist</h2>
            <div className={styles.watchlist_grid}>
                {watchlistItems.map((item) => (
                    <div key={item.ticker} className={styles.watchlist_card}>
                        <div className={styles.watchlist_card_top}>
                            <span className={styles.watchlist_ticker}>{item.ticker}</span>
                            <span className={styles.watchlist_market}>{item.market}</span>
                        </div>
                        <div className={styles.watchlist_card_bottom}>
                            <span className={styles.watchlist_price}>
                                {item.price.toLocaleString()}
                            </span>
                            <span
                                className={`${styles.watchlist_change} ${item.change >= 0 ? styles.change_positive : styles.change_negative}`}
                            >
                                {item.change >= 0 ? '+' : ''}{item.change}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
