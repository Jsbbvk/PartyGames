import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Main, PageNotFound } from './pages'
import {
  CaptionThis,
  CaptionThisDemo,
  CaptionThisMemes,
} from './pages/CaptionThis'
import CardsForUs from './pages/CardsForUs'

function App() {
  return (
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
  )
}

export default App
