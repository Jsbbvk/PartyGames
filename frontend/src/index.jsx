import React from 'react'
import ReactDOM from 'react-dom'
import { CookiesProvider } from 'react-cookie'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
