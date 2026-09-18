import { useEffect, useRef } from 'react'

type Props = {
  message: string
  onDone: () => void
}

// Figma 43:81 "삭제 완료 Toast Popup" — 흰색 70% 배경, 알약형, 2초 후 자동 소멸
export function Toast({ message, onDone }: Props) {
  const onDoneRef = useRef(onDone)
  useEffect(() => {
    onDoneRef.current = onDone
  })

  useEffect(() => {
    const timer = setTimeout(() => onDoneRef.current(), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(48px+env(safe-area-inset-bottom))] flex justify-center px-6">
      <div className="rounded-[1000px] bg-white/70 px-12 py-3">
        <p className="whitespace-nowrap font-['Pretendard'] text-[16px] text-[#0a0a0a]">{message}</p>
      </div>
    </div>
  )
}
