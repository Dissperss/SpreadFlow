import { statistics } from '@/pages/home/lib/mock'
import styles from './StatisticsSection.module.css'

export const StatisticsSection = () => {
    return (
        <section className={styles.stats}>
            {statistics.map((stat) => (
                <div key={stat.label} className={styles.stats__card}>
                    <span className={styles.stats__label}>{stat.label}</span>
                    <div className={styles.stats__value_row}>
                        <span className={styles.stats__value}>{stat.value}</span>
                        {stat.change && (
                            <span
                                className={`${styles.stats__change} ${stat.changeType === 'positive' ? styles.stats__change_positive : stat.changeType === 'negative' ? styles.stats__change_negative : ''}`}
                            >
                                {stat.change}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </section>
    )
}
