import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { store } from './redux/store.ts'
import { Provider } from 'react-redux'
import './styles/global.css'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
)
