import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminPage from './AdminPage'
import ClientePage from './ClientePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
