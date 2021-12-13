import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SceneManager } from './components/Managers'
import { Main, Demo, Memes, PageNotFound } from './pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="demo" element={<Demo />} />
        <Route path="scenes" element={<SceneManager />} />
        <Route path="memes" element={<Memes />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
