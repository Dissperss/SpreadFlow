import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/app/layouts/MainLayout'
import { HomePage } from '@/pages/home'

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
                path: 'account',
                // element: <LoanPage />,
            },
        ],
    },
])
