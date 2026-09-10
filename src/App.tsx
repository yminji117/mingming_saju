import { useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { MainInputScreen } from './screens/MainInputScreen'
import { ResultStub } from './screens/ResultStub'
import { SavedInfoScreen } from './screens/SavedInfoScreen'
import { loadLastInput, saveLastInput } from './lib/storage'
import type { SajuFormInput } from './lib/types'

function EntryRoute() {
  const navigate = useNavigate()
  const [forceNew, setForceNew] = useState(false)
  const saved = loadLastInput()

  function handleSubmit(input: SajuFormInput) {
    saveLastInput(input)
    navigate('/result', { state: { input } })
  }

  if (saved && !forceNew) {
    return (
      <SavedInfoScreen
        nickname={saved.nickname}
        onUseSaved={() => navigate('/result', { state: { input: saved } })}
        onNewInput={() => setForceNew(true)}
      />
    )
  }

  return <MainInputScreen onSubmit={handleSubmit} />
}

function ResultRoute() {
  const location = useLocation()
  const input = (location.state as { input?: SajuFormInput } | null)?.input ?? loadLastInput()

  if (!input) return <Navigate to="/" replace />
  return <ResultStub input={input} />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<EntryRoute />} />
      <Route path="/result" element={<ResultRoute />} />
    </Routes>
  )
}

export default App
