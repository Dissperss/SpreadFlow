import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
    {
        path: '/',
        // element: <MainLayout />,
        children: [
            {
                index: true,
                // element: <HomePage />,
            },
            {
                path: 'account',
                // element: <LoanPage />,
            },
        ],
    },
])
