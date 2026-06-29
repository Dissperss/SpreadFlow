import { RouterProvider } from 'react-router-dom'

import { QueryProvider } from './providers/query/QueryProvider'
import { router } from './providers/router/router'

function App() {
    return (
        <QueryProvider>
            <RouterProvider router={router} />
        </QueryProvider>
    )
}

export default App
