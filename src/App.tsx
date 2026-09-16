import { useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Toast } from './components/Toast'
import { MainInputScreen } from './screens/MainInputScreen'
import { ResultScreen } from './screens/ResultScreen'
import { SavedInfoScreen } from './screens/SavedInfoScreen'
import { clearLastInput, loadLastInput, saveLastInput } from './lib/storage'
import type { SajuFormInput } from './lib/types'

function EntryRoute() {
  const navigate = useNavigate()
  const [forceNew, setForceNew] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const saved = loadLastInput()

  function handleSubmit(input: SajuFormInput) {
    saveLastInput(input)
    navigate('/result', { state: { input } })
  }

  function handleDelete() {
    clearLastInput()
    setForceNew(true)
    setToast('삭제 완료 되었습니다.')
  }

  return (
    <>
      {saved && !forceNew ? (
        <SavedInfoScreen
          nickname={saved.nickname}
          onUseSaved={() => navigate('/result', { state: { input: saved } })}
          onNewInput={() => setForceNew(true)}
          onDelete={handleDelete}
        />
      ) : (
        <MainInputScreen onSubmit={handleSubmit} />
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  )
}

function ResultRoute() {
  const location = useLocation()
  const input = (location.state as { input?: SajuFormInput } | null)?.input ?? loadLastInput()

  if (!input) return <Navigate to="/" replace />
  return <ResultScreen input={input} />
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
