import type { FutureContract, SpotInstrument } from '@/entities/instrument'
import type { ArbSignal, CalendarSpread, Liquidity, Signal } from '../model/types'

const DEFAULT_REPO_RATE = 0.16
const SIGNAL_THRESHOLD_PCT = 0.25

export const getLiquidity = (openInterest?: number, volume?: number): Liquidity => {
    const oi = openInterest ?? 0
    const vol = volume ?? 0

    if (oi >= 50_000 || vol >= 10_000) return 'High'
    if (oi >= 10_000 || vol >= 2_000) return 'Medium'
    return 'Low'
}

export const calcFairValue = (
    spot: number,
    daysToExpiry: number,
    repoRate = DEFAULT_REPO_RATE,
): number => spot * (1 + repoRate * (daysToExpiry / 365))

export const calcImpliedRepo = (
    spot: number,
    future: number,
    daysToExpiry: number,
): number => {
    if (spot <= 0 || daysToExpiry <= 0) return 0
    return ((future / spot - 1) * (365 / daysToExpiry)) * 100
}

export const calcSpreadPct = (spot: number, future: number): number => {
    if (spot <= 0) return 0
    return ((future - spot) / spot) * 100
}

export const calcExpectedProfit = (
    spot: number,
    future: number,
    fairValue: number,
): number => {
    if (spot <= 0) return 0
    return ((fairValue - future) / spot) * 100
}

export const resolveSignal = (expectedProfit: number): Signal => {
    if (expectedProfit > SIGNAL_THRESHOLD_PCT) return 'buy'
    if (expectedProfit < -SIGNAL_THRESHOLD_PCT) return 'sell'
    return 'neutral'
}

export const buildCashAndCarrySignal = (
    spotInstrument: SpotInstrument,
    futureContract: FutureContract,
    repoRate = DEFAULT_REPO_RATE,
): ArbSignal => {
    const spot = spotInstrument.lastPrice ?? 0
    const future = futureContract.lastPrice ?? 0
    const daysToExpiry = futureContract.daysToExpiry
    const fairValue = calcFairValue(spot, daysToExpiry, repoRate)
    const spread = calcSpreadPct(spot, future)
    const expectedProfit = calcExpectedProfit(spot, future, fairValue)
    const impliedRepo = calcImpliedRepo(spot, future, daysToExpiry)

    return {
        ticker: spotInstrument.secid,
        arbType: 'cash_and_carry',
        spot,
        future,
        spread,
        fairValue,
        expectedProfit,
        impliedRepo,
        daysToExpiry,
        liquidity: getLiquidity(
            futureContract.openInterest,
            futureContract.volume,
        ),
        signal: resolveSignal(expectedProfit),
        spotSecid: spotInstrument.secid,
        futureSecid: futureContract.secid,
    }
}

export const buildCalendarSpread = (
    underlying: string,
    assetCode: string,
    near: FutureContract,
    far: FutureContract,
): CalendarSpread => {
    const nearPrice = near.lastPrice ?? 0
    const farPrice = far.lastPrice ?? 0
    const calendarSpread = farPrice - nearPrice
    const calendarSpreadPct = nearPrice > 0 ? (calendarSpread / nearPrice) * 100 : 0
    const daysBetween = Math.max(
        1,
        far.daysToExpiry - near.daysToExpiry,
    )
    const rollYield =
        nearPrice > 0
            ? ((farPrice / nearPrice - 1) * (365 / daysBetween)) * 100
            : 0

    const expectedProfit = -calendarSpreadPct
    const liquidity = getLiquidity(
        Math.min(near.openInterest ?? 0, far.openInterest ?? 0),
        Math.min(near.volume ?? 0, far.volume ?? 0),
    )

    return {
        underlying,
        assetCode,
        nearSecid: near.secid,
        farSecid: far.secid,
        nearPrice,
        farPrice,
        nearExpiry: near.expirationDate,
        farExpiry: far.expirationDate,
        daysBetween,
        calendarSpread,
        calendarSpreadPct,
        rollYield,
        liquidity,
        signal: resolveSignal(expectedProfit),
    }
}
