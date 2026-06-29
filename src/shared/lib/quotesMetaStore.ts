import { create } from 'zustand'

type QuotesMetaState = {
    lastUpdated: number | null
    setLastUpdated: (timestamp: number) => void
}

export const useQuotesMetaStore = create<QuotesMetaState>((set) => ({
    lastUpdated: null,
    setLastUpdated: (timestamp) => set({ lastUpdated: timestamp }),
}))
