import type { z } from 'zod'
import type {
    arbSignalSchema,
    arbTypeSchema,
    calendarSpreadSchema,
    liquiditySchema,
    signalSchema,
} from './schemas'

export type ArbType = z.infer<typeof arbTypeSchema>
export type Signal = z.infer<typeof signalSchema>
export type Liquidity = z.infer<typeof liquiditySchema>
export type ArbSignal = z.infer<typeof arbSignalSchema>
export type CalendarSpread = z.infer<typeof calendarSpreadSchema>
