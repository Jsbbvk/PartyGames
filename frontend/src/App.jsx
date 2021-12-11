import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Demo from './pages/Demo'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="demo" element={<Demo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
