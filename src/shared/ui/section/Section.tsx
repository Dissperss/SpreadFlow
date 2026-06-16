import { type PropsWithChildren } from 'react'
import styles from './Section.module.css'
import clsx from 'clsx'

type SectionProps = PropsWithChildren<{
    className?: string
    as?: 'section' | 'div' | 'article'
}>

export const Section = ({
    children,
    className,
    as: Tag = 'section',
}: SectionProps) => {
    return <Tag className={clsx(styles.section, className)}>{children}</Tag>
}
