import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SceneManager } from './components/Managers'
import { Main, Demo } from './pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="demo" element={<Demo />} />
        <Route path="scenes" element={<SceneManager />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
