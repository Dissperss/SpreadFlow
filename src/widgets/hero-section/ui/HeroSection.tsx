import styles from './HeroSection.module.css'

export const HeroSection = () => {
    return (
        <section className={styles.hero}>
            <div className={styles.hero__content}>
                <h1 className={styles.hero__title}>
                    Professional Arbitrage<br />
                    <span className={styles.hero__accent}>Intelligence</span>
                </h1>
                <p className={styles.hero__subtitle}>
                    Monitor market inefficiencies across MOEX, Futures and Crypto
                    exchanges in real time.
                </p>
                <div className={styles.hero__actions}>
                    <button type="button" className={styles.hero__btn_primary}>
                        Start Scanning
                    </button>
                    <button type="button" className={styles.hero__btn_secondary}>
                        Explore Markets
                    </button>
                </div>
            </div>

            <div className={styles.hero__illustration} aria-hidden="true">
                <svg viewBox="0 0 400 280" fill="none" className={styles.hero__svg}>
                    <rect x="40" y="180" width="320" height="1" fill="#2A2B35" />
                    <rect x="40" y="140" width="320" height="1" fill="#2A2B35" />
                    <rect x="40" y="100" width="320" height="1" fill="#2A2B35" />
                    <rect x="40" y="60" width="320" height="1" fill="#2A2B35" />
                    <path d="M60 170 L100 130 L140 160 L180 80 L220 110 L260 50 L300 90 L340 70" stroke="#4F7BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="180" cy="80" r="3" fill="#4F7BFF" />
                    <circle cx="260" cy="50" r="3" fill="#4F7BFF" />
                    <path d="M80 175 L120 150 L160 165 L200 120 L240 140 L280 100 L320 125" stroke="#3B64E0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                    <rect x="60" y="200" width="80" height="28" rx="4" fill="#1A1B23" stroke="#2A2B35" strokeWidth="1" />
                    <rect x="160" y="200" width="80" height="28" rx="4" fill="#1A1B23" stroke="#2A2B35" strokeWidth="1" />
                    <rect x="260" y="200" width="80" height="28" rx="4" fill="#1A1B23" stroke="#2A2B35" strokeWidth="1" />
                    <text x="100" y="218" fill="#8B8D9A" fontSize="10" textAnchor="middle" fontFamily="Inter">SBER</text>
                    <text x="200" y="218" fill="#8B8D9A" fontSize="10" textAnchor="middle" fontFamily="Inter">GAZP</text>
                    <text x="300" y="218" fill="#8B8D9A" fontSize="10" textAnchor="middle" fontFamily="Inter">BTC</text>
                    <rect x="60" y="240" width="80" height="3" rx="1.5" fill="#4F7BFF" />
                    <rect x="160" y="240" width="80" height="3" rx="1.5" fill="#4F7BFF" opacity="0.4" />
                    <rect x="260" y="240" width="80" height="3" rx="1.5" fill="#4F7BFF" />
                </svg>
            </div>
        </section>
    )
}
