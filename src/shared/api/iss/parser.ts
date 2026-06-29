type IssTable = {
    columns: string[]
    data: unknown[][]
}

export type IssResponse = Record<string, IssTable>

export const issRowsToObjects = (
    columns: string[],
    data: unknown[][],
): Record<string, unknown>[] =>
    data.map((row) =>
        Object.fromEntries(columns.map((col, index) => [col, row[index]])),
    )

export const getIssTable = (
    response: IssResponse,
    key: string,
): IssTable | undefined => response[key]

export const parseNumber = (value: unknown): number | null => {
    if (value === null || value === undefined || value === '') return null
    const num = Number(value)
    return Number.isFinite(num) ? num : null
}

export const parseDate = (value: unknown): string | undefined => {
    if (typeof value !== 'string' || !value) return undefined
    return value.slice(0, 10)
}

export const daysUntil = (dateStr: string): number => {
    const target = new Date(dateStr)
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    target.setHours(0, 0, 0, 0)
    return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86_400_000))
}
