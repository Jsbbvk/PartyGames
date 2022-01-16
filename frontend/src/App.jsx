import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { createContext, useContext, useMemo, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { Main, PageNotFound } from './pages'
import {
  CaptionThis,
  CaptionThisDemo,
  CaptionThisMemes,
} from './pages/CaptionThis'
import CardsForUs from './pages/CardsForUs'

export const ThemeContext = createContext({
  toggleColorMode: () => {},
  setBodyTransition: () => {},
})

function App() {
  const [mode, setMode] = useState('light')
  const [transitionBody, setTransitionBody] = useState(false)

  const bodyTheme = useMemo(
    () => ({
      toggleColorMode: (newMode) => {
        setMode(
          (prevMode) => newMode || (prevMode === 'light' ? 'dark' : 'light')
        )
      },
      setBodyTransition: (shouldTransition) =>
        setTransitionBody(shouldTransition),
    }),
    []
  )

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: 'Nunito',
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              ...(transitionBody && {
                body: {
                  transition:
                    'background-color 250ms ease-in-out, color 250ms ease-in-out',
                },
              }),
            },
          },
        },
        palette: {
          mode,
        },
      }),
    [mode, transitionBody]
  )

  return (
    <ThemeContext.Provider value={bodyTheme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/captionthis">
              <Route path="" element={<CaptionThis />} />
              <Route path="demo" element={<CaptionThisDemo />} />
              <Route path="memes" element={<CaptionThisMemes />} />
            </Route>
            <Route path="/cardsforus">
              <Route path="" element={<CardsForUs />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export default App
