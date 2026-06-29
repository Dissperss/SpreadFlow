import styles from './SettingsPage.module.css'

export const SettingsPage = () => (
    <div className={styles.page}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Platform preferences and data source configuration.</p>

        <section className={styles.section}>
            <h2 className={styles.section_title}>Data Source</h2>
            <p className={styles.text}>MOEX ISS (via dev proxy) · polling every 15 seconds</p>
        </section>

        <section className={styles.section}>
            <h2 className={styles.section_title}>Signal Threshold</h2>
            <p className={styles.text}>Expected profit threshold: 0.25%</p>
        </section>

        <section className={styles.section}>
            <h2 className={styles.section_title}>Default Repo Rate</h2>
            <p className={styles.text}>16% annualized for fair value calculations</p>
        </section>
    </div>
)
