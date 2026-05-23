import { HashRouter, Routes, Route } from 'react-router-dom'
import Calculator from './components/Calculator'
import Config from './components/Config'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Calculator />} />
        <Route path="/config" element={<Config />} />
      </Routes>
    </HashRouter>
  )
}
