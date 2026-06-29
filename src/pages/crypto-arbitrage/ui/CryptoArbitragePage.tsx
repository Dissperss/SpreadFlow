import { Link } from 'react-router-dom'
import styles from './CryptoArbitragePage.module.css'

export const CryptoArbitragePage = () => (
    <div className={styles.page}>
        <h1 className={styles.title}>Crypto Arbitrage</h1>
        <p className={styles.subtitle}>
            Planned module for cross-exchange and spot/perp spreads. Current focus is MOEX equities and FORTS.
        </p>
        <Link to="/stock-futures" className={styles.link}>
            Go to MOEX stock/futures scanner
        </Link>
    </div>
)
