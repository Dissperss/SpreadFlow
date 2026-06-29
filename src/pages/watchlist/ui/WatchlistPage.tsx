import { watchlistItems } from '@/pages/home/lib/mock'
import styles from './WatchlistPage.module.css'

export const WatchlistPage = () => (
    <div className={styles.page}>
        <h1 className={styles.title}>Watchlist</h1>
        <p className={styles.subtitle}>Saved tickers for quick monitoring.</p>

        <div className={styles.grid}>
            {watchlistItems.map((item) => (
                <article key={item.ticker} className={styles.card}>
                    <div className={styles.card_top}>
                        <span className={styles.ticker}>{item.ticker}</span>
                        <span className={styles.market}>{item.market}</span>
                    </div>
                    <div className={styles.price}>{item.price.toLocaleString()}</div>
                    <div className={item.change >= 0 ? styles.positive : styles.negative}>
                        {item.change >= 0 ? '+' : ''}
                        {item.change}%
                    </div>
                </article>
            ))}
        </div>
    </div>
)
