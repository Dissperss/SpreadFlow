import { heatmapData } from '@/pages/home/lib/mock'
import styles from './HeatmapSection.module.css'

const intensityColor = (change: number): string => {
    if (change >= 1.5) return '#22c55e'
    if (change >= 0.5) return '#4ade80'
    if (change >= 0) return '#86efac'
    if (change >= -0.5) return '#fca5a5'
    if (change >= -1) return '#f87171'
    return '#ef4444'
}

export const HeatmapSection = () => {
    return (
        <section className={styles.heatmap_section}>
            <h2 className={styles.heatmap_title}>Market Heatmap</h2>
            <div className={styles.heatmap_grid}>
                {heatmapData.map((item) => (
                    <div
                        key={item.sector}
                        className={styles.heatmap_cell}
                        style={{ background: intensityColor(item.change) }}
                    >
                        <span className={styles.heatmap_sector}>{item.sector}</span>
                        <span className={styles.heatmap_change}>
                            {item.change >= 0 ? '+' : ''}{item.change}%
                        </span>
                    </div>
                ))}
            </div>
        </section>
    )
}
