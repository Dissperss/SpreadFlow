import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/app/layouts/MainLayout'
import { CalendarSpreadsPage } from '@/pages/calendar-spreads'
import { CryptoArbitragePage } from '@/pages/crypto-arbitrage'
import { HomePage } from '@/pages/home'
import { NotFoundPage } from '@/pages/not-found'
import { ScannerPage } from '@/pages/scanner'
import { SettingsPage } from '@/pages/settings'
import { StockFuturesPage } from '@/pages/stock-futures'
import { WatchlistPage } from '@/pages/watchlist'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'scanner',
                element: <ScannerPage />,
            },
            {
                path: 'stock-futures',
                element: <StockFuturesPage />,
            },
            {
                path: 'calendar-spreads',
                element: <CalendarSpreadsPage />,
            },
            {
                path: 'crypto-arbitrage',
                element: <CryptoArbitragePage />,
            },
            {
                path: 'watchlist',
                element: <WatchlistPage />,
            },
            {
                path: 'settings',
                element: <SettingsPage />,
            },
            {
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
])
