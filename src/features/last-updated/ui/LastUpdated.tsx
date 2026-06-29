import { useState, useEffect } from 'react'
import styles from './LastUpdated.module.css'
import clsx from 'clsx'

type LastUpdatedProps = {
    since?: Date | number
    className?: string
}

const MS_SECOND = 1000
const MS_MINUTE = 60 * MS_SECOND
const MS_HOUR = 60 * MS_MINUTE

const format = (diff: number): string => {
    if (diff < MS_MINUTE) {
        const sec = Math.floor(diff / MS_SECOND)
        return `${sec} sec${sec !== 1 ? 's' : ''}`
    }
    if (diff < MS_HOUR) {
        const min = Math.floor(diff / MS_MINUTE)
        return `${min} min${min !== 1 ? 's' : ''}`
    }
    const hrs = Math.floor(diff / MS_HOUR)
    return `${hrs} hr${hrs !== 1 ? 's' : ''}`
}

const toTimestamp = (since: Date | number) =>
    typeof since === 'number' ? since : since.getTime()

export const LastUpdated = ({ since, className }: LastUpdatedProps) => {
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(id)
    }, [])

    const label =
        since
            ? `Updated ${format(now - toTimestamp(since))} ago`
            : 'Waiting for data...'

    return (
        <span className={clsx(styles.root, className)}>
            <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {label}
        </span>
    )
}
