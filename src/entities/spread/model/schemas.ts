import { z } from 'zod'

export const arbTypeSchema = z.enum([
    'cash_and_carry',
    'calendar',
    'stat_arb',
    'options_parity',
])

export const signalSchema = z.enum(['buy', 'sell', 'neutral'])

export const liquiditySchema = z.enum(['High', 'Medium', 'Low'])

export const arbSignalSchema = z.object({
    ticker: z.string(),
    arbType: arbTypeSchema,
    spot: z.number(),
    future: z.number(),
    spread: z.number(),
    fairValue: z.number(),
    expectedProfit: z.number(),
    impliedRepo: z.number().optional(),
    daysToExpiry: z.number().optional(),
    liquidity: liquiditySchema,
    signal: signalSchema,
    spotSecid: z.string().optional(),
    futureSecid: z.string().optional(),
})

export const calendarSpreadSchema = z.object({
    underlying: z.string(),
    assetCode: z.string(),
    nearSecid: z.string(),
    farSecid: z.string(),
    nearPrice: z.number(),
    farPrice: z.number(),
    nearExpiry: z.string(),
    farExpiry: z.string(),
    daysBetween: z.number(),
    calendarSpread: z.number(),
    calendarSpreadPct: z.number(),
    rollYield: z.number(),
    liquidity: liquiditySchema,
    signal: signalSchema,
})
