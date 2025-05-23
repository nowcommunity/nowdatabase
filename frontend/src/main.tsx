import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { store } from './redux/store.ts'
import { Provider } from 'react-redux'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
