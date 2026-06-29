import { useQuery } from '@tanstack/react-query'
import { quoteProvider } from '@/shared/api'
import { useQuotesMetaStore } from '@/shared/lib/quotesMetaStore'

const STOCK_FUTURES_KEY = ['quotes', 'stock-futures'] as const
const CALENDAR_SPREADS_KEY = ['quotes', 'calendar-spreads'] as const

const REFETCH_INTERVAL = 15_000

const touchLastUpdated = () => {
    useQuotesMetaStore.getState().setLastUpdated(Date.now())
}

export const useStockFuturesArb = () =>
    useQuery({
        queryKey: STOCK_FUTURES_KEY,
        queryFn: async () => {
            const data = await quoteProvider.fetchStockFuturesArb()
            touchLastUpdated()
            return data
        },
        refetchInterval: REFETCH_INTERVAL,
        staleTime: 10_000,
    })

export const useCalendarSpreads = () =>
    useQuery({
        queryKey: CALENDAR_SPREADS_KEY,
        queryFn: async () => {
            const data = await quoteProvider.fetchCalendarSpreads()
            touchLastUpdated()
            return data
        },
        refetchInterval: REFETCH_INTERVAL,
        staleTime: 10_000,
    })
