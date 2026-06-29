import type { FutureContract, SpotInstrument } from '@/entities/instrument'
import type { ArbSignal, CalendarSpread } from '@/entities/spread'
import {
    buildCalendarSpread,
    buildCashAndCarrySignal,
} from '@/entities/spread'
import {
    CALENDAR_SPREAD_UNIVERSE,
    STOCK_FUTURES_UNIVERSE,
    type MoexUniverseItem,
} from '@/shared/config/moexUniverse'
import { apiClient } from '../client'
import {
    daysUntil,
    getIssTable,
    issRowsToObjects,
    parseDate,
    parseNumber,
    type IssResponse,
} from './parser'

const SPOT_BOARD = 'TQBR'
const FUTURES_ENGINE = 'futures'
const FUTURES_MARKET = 'forts'

const fetchSpotInstruments = async (
    secids: string[],
): Promise<SpotInstrument[]> => {
    const securities = secids.join(',')
    const { data } = await apiClient.get<IssResponse>(
        `/engines/stock/markets/shares/boards/${SPOT_BOARD}/securities.json`,
        {
            params: {
                securities,
                'iss.meta': 'off',
                'iss.only': 'marketdata',
                'marketdata.columns': 'SECID,LAST,VOLTODAY',
            },
        },
    )

    const table = getIssTable(data, 'marketdata')
    if (!table) return []

    return issRowsToObjects(table.columns, table.data).map((row) => ({
        secid: String(row.SECID),
        type: 'stock' as const,
        board: SPOT_BOARD,
        lastPrice: parseNumber(row.LAST),
        volume: parseNumber(row.VOLTODAY) ?? undefined,
    }))
}

const fetchFortsSecurities = async (): Promise<FutureContract[]> => {
    const { data } = await apiClient.get<IssResponse>(
        `/engines/${FUTURES_ENGINE}/markets/${FUTURES_MARKET}/securities.json`,
        {
            params: {
                'iss.meta': 'off',
                'iss.only': 'securities,marketdata',
                'securities.columns':
                    'SECID,SHORTNAME,ASSETCODE,LASTDELDATE,LOTSIZE,MINSTEP',
                'marketdata.columns': 'SECID,LAST,VOLTODAY,OPENPOSITION',
            },
        },
    )

    const securitiesTable = getIssTable(data, 'securities')
    const marketdataTable = getIssTable(data, 'marketdata')
    if (!securitiesTable || !marketdataTable) return []

    const marketBySecid = new Map(
        issRowsToObjects(marketdataTable.columns, marketdataTable.data).map(
            (row) => [String(row.SECID), row],
        ),
    )

    const contracts: FutureContract[] = []

    for (const row of issRowsToObjects(
        securitiesTable.columns,
        securitiesTable.data,
    )) {
        const secid = String(row.SECID)
        const market = marketBySecid.get(secid)
        const expirationDate = parseDate(row.LASTDELDATE)

        if (!expirationDate) continue

        const daysToExpiry = daysUntil(expirationDate)
        if (daysToExpiry <= 0) continue

        contracts.push({
            secid,
            shortname: String(row.SHORTNAME ?? secid),
            type: 'future',
            assetCode: String(row.ASSETCODE ?? ''),
            expirationDate,
            daysToExpiry,
            lotSize: parseNumber(row.LOTSIZE) ?? undefined,
            minStep: parseNumber(row.MINSTEP) ?? undefined,
            lastPrice: parseNumber(market?.LAST),
            volume: parseNumber(market?.VOLTODAY) ?? undefined,
            openInterest: parseNumber(market?.OPENPOSITION) ?? undefined,
        })
    }

    return contracts
}

const pickNearestFuture = (
    contracts: FutureContract[],
    assetCode: string,
): FutureContract | undefined => {
    return contracts
        .filter((contract) => contract.assetCode === assetCode)
        .sort((a, b) => a.daysToExpiry - b.daysToExpiry)[0]
}

const pickNearFarPair = (
    contracts: FutureContract[],
    assetCode: string,
): [FutureContract, FutureContract] | undefined => {
    const sorted = contracts
        .filter((contract) => contract.assetCode === assetCode)
        .sort((a, b) => a.daysToExpiry - b.daysToExpiry)

    if (sorted.length < 2) return undefined
    return [sorted[0], sorted[1]]
}

const buildStockFuturesSignals = (
    universe: MoexUniverseItem[],
    spots: SpotInstrument[],
    futures: FutureContract[],
): ArbSignal[] => {
    const spotBySecid = new Map(spots.map((spot) => [spot.secid, spot]))

    return universe
        .map((item) => {
            const spot = spotBySecid.get(item.spotSecid)
            const future = pickNearestFuture(futures, item.assetCode)

            if (!spot?.lastPrice || !future?.lastPrice) return null

            return buildCashAndCarrySignal(spot, future)
        })
        .filter((signal): signal is ArbSignal => signal !== null)
}

const buildCalendarSpreadRows = (
    universe: MoexUniverseItem[],
    futures: FutureContract[],
): CalendarSpread[] =>
    universe
        .map((item) => {
            const pair = pickNearFarPair(futures, item.assetCode)
            if (!pair) return null

            return buildCalendarSpread(
                item.label,
                item.assetCode,
                pair[0],
                pair[1],
            )
        })
        .filter((row): row is CalendarSpread => row !== null)

export type QuoteProvider = {
    fetchStockFuturesArb: () => Promise<ArbSignal[]>
    fetchCalendarSpreads: () => Promise<CalendarSpread[]>
}

export const moexIssProvider: QuoteProvider = {
    async fetchStockFuturesArb() {
        const secids = STOCK_FUTURES_UNIVERSE.map((item) => item.spotSecid)
        const [spots, futures] = await Promise.all([
            fetchSpotInstruments(secids),
            fetchFortsSecurities(),
        ])

        return buildStockFuturesSignals(
            STOCK_FUTURES_UNIVERSE,
            spots,
            futures,
        )
    },

    async fetchCalendarSpreads() {
        const futures = await fetchFortsSecurities()
        return buildCalendarSpreadRows(CALENDAR_SPREAD_UNIVERSE, futures)
    },
}

export const quoteProvider: QuoteProvider = moexIssProvider
