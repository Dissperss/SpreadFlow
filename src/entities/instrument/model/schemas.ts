import { z } from 'zod'

export const instrumentTypeSchema = z.enum([
    'stock',
    'future',
    'index',
    'currency',
    'commodity',
])

export const instrumentSchema = z.object({
    secid: z.string(),
    shortname: z.string().optional(),
    name: z.string().optional(),
    type: instrumentTypeSchema,
    board: z.string().optional(),
    lotSize: z.number().optional(),
    minStep: z.number().optional(),
    assetCode: z.string().optional(),
    expirationDate: z.string().optional(),
    lastPrice: z.number().nullable(),
    volume: z.number().optional(),
    openInterest: z.number().optional(),
})

export const futureContractSchema = instrumentSchema.extend({
    type: z.literal('future'),
    assetCode: z.string(),
    expirationDate: z.string(),
    daysToExpiry: z.number(),
})

export const spotInstrumentSchema = instrumentSchema.extend({
    type: z.literal('stock'),
})
