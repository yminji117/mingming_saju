import { useEffect, useRef, useState } from 'react'
import closeIcon from '../assets/icon-close.png'
import { to12Hour, to24Hour } from '../lib/time'
import { clampIndex, indexToScrollTop, scrollTopToIndex, wheelPadding } from '../lib/timeWheel'

const ITEM_HEIGHT = 40
const VISIBLE_ROWS = 5
const LABEL_ROW_HEIGHT = 16 // WheelColumn 라벨 span의 h-4
const LABEL_GAP = 4 // WheelColumn의 gap-1
// 하이라이트 밴드는 라벨 아래 스크롤 박스의 정중앙(가운데 행)에 와야 한다 — 라벨 높이만큼 밑으로 내려서 계산
const BAND_TOP = LABEL_ROW_HEIGHT + LABEL_GAP + (ITEM_HEIGHT * VISIBLE_ROWS - ITEM_HEIGHT) / 2
const AMPM: Array<'AM' | 'PM'> = ['AM', 'PM']
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1)
const MINUTES = Array.from({ length: 60 }, (_, i) => i)
const AMPM_LABEL: Record<'AM' | 'PM', string> = { AM: '오전', PM: '오후' }

type Props = {
  hour: number | null // 24시간제
  minute: number | null
  onConfirm: (hour: number, minute: number) => void
  onCancel: () => void
}

// 아이폰 시계 앱 "알람 추가" 스타일 휠 피커. 모바일/패드는 하단 시트, PC(lg 이상)는 가운데 모달.
export function TimePickerModal({ hour, minute, onConfirm, onCancel }: Props) {
  const initial = to12Hour(hour ?? 0)
  const [draftAmPm, setDraftAmPm] = useState<'AM' | 'PM'>(initial.ampm)
  const [draftHour, setDraftHour] = useState(initial.hour)
  const [draftMinute, setDraftMinute] = useState(minute ?? 0)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="시간 선택"
      className="fixed inset-0 z-10 flex items-end justify-center bg-black/50 lg:items-center"
      onClick={onCancel}
    >
      <div
        className="flex w-full flex-col gap-4 rounded-t-[4px] bg-white px-5 pt-5 pb-[calc(24px+env(safe-area-inset-bottom))] lg:max-w-[335px] lg:rounded-[4px] lg:pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <button type="button" onClick={onCancel} aria-label="취소" className="-m-3 flex size-[44px] items-center justify-center">
            <img src={closeIcon} alt="" className="size-5" />
          </button>
          <p className="font-['Pretendard'] text-[16px] text-[#101010]">시간 선택</p>
          <button
            type="button"
            onClick={() => onConfirm(to24Hour(draftAmPm, draftHour), draftMinute)}
            aria-label="확인"
            className="-m-3 flex size-[44px] items-center justify-center"
          >
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
              <path d="M4 10.5L8 14.5L16 5.5" fill="none" stroke="#101010" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
            </svg>
          </button>
        </div>

        <div className="relative flex justify-center gap-2">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 h-[40px] rounded-[4px] bg-[#f5f5f5]"
            style={{ top: BAND_TOP }}
          />
          <WheelColumn label="" values={AMPM} selected={draftAmPm} onSettle={setDraftAmPm} formatLabel={(v) => AMPM_LABEL[v]} width={64} />
          <WheelColumn label="시" values={HOURS} selected={draftHour} onSettle={setDraftHour} formatLabel={(v) => String(v).padStart(2, '0')} />
          <WheelColumn label="분" values={MINUTES} selected={draftMinute} onSettle={setDraftMinute} formatLabel={(v) => String(v).padStart(2, '0')} />
        </div>
      </div>
    </div>
  )
}

type WheelColumnProps<T extends string | number> = {
  label: string
  values: T[]
  selected: T
  onSettle: (value: T) => void
  formatLabel: (value: T) => string
  width?: number
}

function WheelColumn<T extends string | number>({ label, values, selected, onSettle, formatLabel, width = 80 }: WheelColumnProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number | undefined>(undefined)
  const padding = wheelPadding(ITEM_HEIGHT, VISIBLE_ROWS)
  const [centerIndex, setCenterIndex] = useState(() => clampIndex(values.indexOf(selected), values.length))

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: indexToScrollTop(values.indexOf(selected), ITEM_HEIGHT) })
    return () => window.clearTimeout(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleScroll() {
    const el = scrollRef.current
    if (el) setCenterIndex(clampIndex(scrollTopToIndex(el.scrollTop, ITEM_HEIGHT), values.length))

    window.clearTimeout(timerRef.current)
    // ponytail: `scrollend` 대신 디바운스(구형 iOS Safari 미지원) — 스크롤 멈춘 뒤 ~100ms에 값 확정
    timerRef.current = window.setTimeout(() => {
      const idx = scrollRef.current ? clampIndex(scrollTopToIndex(scrollRef.current.scrollTop, ITEM_HEIGHT), values.length) : centerIndex
      onSettle(values[idx])
    }, 100)
  }

  function handleRowClick(i: number) {
    scrollRef.current?.scrollTo({ top: indexToScrollTop(i, ITEM_HEIGHT), behavior: 'smooth' })
    setCenterIndex(i)
    onSettle(values[i])
  }

  return (
    <div className="relative flex flex-col items-center gap-1">
      <span className="flex h-4 items-center font-['Pretendard'] text-[12px] text-[#b1b1b1]">{label}</span>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="snap-y snap-mandatory overflow-y-scroll overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ width, height: ITEM_HEIGHT * VISIBLE_ROWS, paddingTop: padding, paddingBottom: padding }}
      >
        {values.map((v, i) => (
          <div
            key={v}
            onClick={() => handleRowClick(i)}
            style={{ height: ITEM_HEIGHT }}
            className={`flex snap-center items-center justify-center font-['Pretendard'] text-[18px] ${
              i === centerIndex ? 'font-bold text-[#101010]' : 'text-[#b1b1b1]'
            }`}
          >
            {formatLabel(v)}
          </div>
        ))}
      </div>
    </div>
  )
}
