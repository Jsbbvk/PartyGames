import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import React from 'react'
import ReactDOM from 'react-dom'
import { CookiesProvider } from 'react-cookie'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'

const theme = createTheme({
  typography: {
    fontFamily: 'Nunito',
  },
})

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </ThemeProvider>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
