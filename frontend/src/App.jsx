import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SceneManager } from './components/Managers'
import Demo from './pages/Demo'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="demo" element={<Demo />} />
        <Route path="scenes" element={<SceneManager />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
