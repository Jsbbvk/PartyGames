import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import React from 'react'
import ReactDOM from 'react-dom'
import { CookiesProvider } from 'react-cookie'
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
        <App />
      </ThemeProvider>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
