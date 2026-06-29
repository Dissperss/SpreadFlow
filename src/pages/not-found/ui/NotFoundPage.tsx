import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export const NotFoundPage = () => (
    <div className={styles.page}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.subtitle}>Page not found.</p>
        <Link to="/" className={styles.link}>
            Back to dashboard
        </Link>
    </div>
)
