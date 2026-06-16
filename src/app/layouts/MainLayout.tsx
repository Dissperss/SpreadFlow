import { Outlet } from 'react-router-dom'
import styles from './MainLayout.module.css'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'
import { Footer } from '@/widgets/footer'

export const MainLayout = () => {
    return (
        <div className={styles.layout}>
            <Header />
            <div className={styles.layout__body}>
                <Sidebar />
                <main className={styles.layout__content}>
                    <Outlet />
                    <Footer />
                </main>
            </div>
        </div>
    )
}
