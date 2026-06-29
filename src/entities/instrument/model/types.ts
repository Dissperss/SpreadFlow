import type { z } from 'zod'
import type {
    futureContractSchema,
    instrumentSchema,
    instrumentTypeSchema,
    spotInstrumentSchema,
} from './schemas'

export type InstrumentType = z.infer<typeof instrumentTypeSchema>
export type Instrument = z.infer<typeof instrumentSchema>
export type FutureContract = z.infer<typeof futureContractSchema>
export type SpotInstrument = z.infer<typeof spotInstrumentSchema>
