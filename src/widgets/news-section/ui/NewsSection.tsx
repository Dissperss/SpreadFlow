import { newsItems } from '@/pages/home/lib/mock'
import styles from './NewsSection.module.css'

export const NewsSection = () => {
    return (
        <section className={styles.news_section}>
            <h2 className={styles.news_title}>Latest News</h2>
            <div className={styles.news_list}>
                {newsItems.map((item, i) => (
                    <article key={i} className={styles.news_card}>
                        <div className={styles.news_card_body}>
                            <div className={styles.news_meta}>
                                <span className={styles.news_category}>{item.category}</span>
                                <span className={styles.news_time}>{item.time}</span>
                            </div>
                            <h3 className={styles.news_headline}>{item.title}</h3>
                            <span className={styles.news_source}>{item.source}</span>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}
