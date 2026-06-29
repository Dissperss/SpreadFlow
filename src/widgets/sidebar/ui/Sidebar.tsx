import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'
import { navItems } from '../lib/menu'

export const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <nav className={styles.sidebar__nav}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                            `${styles.sidebar__link} ${isActive ? styles.sidebar__link_active : ''}`
                        }
                    >
                        <svg
                            className={styles.sidebar__icon}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d={item.icon}
                            />
                        </svg>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}
