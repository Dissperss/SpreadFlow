import { Link } from 'react-router-dom'
import logo from '@/assets/images/spreadFlowV2.png'
import styles from './Header.module.css'

export const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.header__inner}>
                <Link to="/" className={styles.header__logo}>
                    <img src={logo} alt="SpreadFlow" className={styles.header__logo_img} />
                    <span className={styles.header__logo_text}>SpreadFlow</span>
                </Link>

                <div className={styles.header__search}>
                    <svg className={styles.header__search_icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        className={styles.header__search_input}
                        placeholder="Search markets, tickers..."
                    />
                </div>

                <div className={styles.header__actions}>
                    <button type="button" className={styles.header__icon_btn} aria-label="Notifications">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>

                    <button type="button" className={styles.header__icon_btn} aria-label="Toggle theme">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    </button>

                    <button type="button" className={styles.header__profile_btn} aria-label="Profile">
                        <span className={styles.header__avatar}>
                            <span className={styles.header__avatar_initials}>AU</span>
                        </span>
                    </button>
                </div>
            </div>
        </header>
    )
}
