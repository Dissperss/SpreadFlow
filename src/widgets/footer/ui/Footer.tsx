import styles from './Footer.module.css'

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <p className={styles.footer__text}>
                &copy; 2026 SpreadFlow. All rights reserved.
            </p>
        </footer>
    )
}
