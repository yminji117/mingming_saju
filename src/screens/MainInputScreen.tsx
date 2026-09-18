import { useState } from 'react'
import heart from '../assets/heart.png'
import { Bezel } from '../components/Bezel'
import { PixelButton } from '../components/PixelButton'
import { PixelCheckbox } from '../components/PixelCheckbox'
import { PixelSelect } from '../components/PixelSelect'
import { CITIES, DEFAULT_CITY } from '../lib/cities'
import { formatDateInput, formatTimeInput, parseDateText, parseTimeText } from '../lib/textInputs'
import type { SajuFormInput } from '../lib/types'
import { validateForm } from '../lib/validation'

function makeDefaultInput(): SajuFormInput {
  return {
    nickname: '',
    calendarType: 'solar',
    isLeapMonth: false,
    year: 0,
    month: 0,
    day: 0,
    ampm: 'AM',
    hour: 0,
    minute: 0,
    timeUnknown: false,
    city: DEFAULT_CITY,
    gender: '여',
  }
}

type Props = {
  onSubmit: (input: SajuFormInput) => void
}

// Figma 2:5 — 필드 구성/순서를 그대로 따른다: 닉네임 → 성별 → 생년월일 → 양음력/윤달 →
// 시각 → 시간모름 → 출생지 → 확인하기
export function MainInputScreen({ onSubmit }: Props) {
  const [input, setInput] = useState<SajuFormInput>(makeDefaultInput)
  const [dateText, setDateText] = useState('')
  const [timeText, setTimeText] = useState('')
  const [touched, setTouched] = useState(false)

  const parsedDate = parseDateText(dateText)
  const parsedTime = parseTimeText(timeText)
  const realismErrors = validateForm(input)

  const dateError = !dateText.trim()
    ? '생년월일을 입력해 주세요'
    : !parsedDate
      ? '1990.01.01 형식으로 입력해 주세요'
      : (realismErrors.date ?? null)
  const timeError = input.timeUnknown
    ? null
    : !timeText.trim()
      ? '시각을 입력하거나 시간 모름을 체크해 주세요'
      : !parsedTime
        ? '00:00 형식으로 입력해 주세요'
        : null

  function update<K extends keyof SajuFormInput>(key: K, value: SajuFormInput[K]) {
    setInput((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'year' || key === 'month') next.isLeapMonth = false
      return next
    })
  }

  function handleDateTextChange(rawText: string) {
    const text = formatDateInput(rawText)
    setDateText(text)
    const parsed = parseDateText(text)
    if (parsed) {
      setInput((prev) => ({ ...prev, year: parsed.year, month: parsed.month, day: parsed.day, isLeapMonth: false }))
    }
  }

  function handleTimeTextChange(rawText: string) {
    const text = formatTimeInput(rawText)
    setTimeText(text)
    const parsed = parseTimeText(text)
    if (parsed) {
      setInput((prev) => ({ ...prev, hour: parsed.hour, minute: parsed.minute }))
    }
  }

  function selectCalendarType(type: 'solar' | 'lunar') {
    setInput((prev) => ({ ...prev, calendarType: type, isLeapMonth: false }))
  }

  function handleSubmit() {
    setTouched(true)
    if (realismErrors.nickname || dateError || timeError) return
    onSubmit(input)
  }

  return (
    <div className="flex min-h-dvh flex-col items-center gap-[60px] bg-[#1a1a1a] px-6 pt-[60px] pb-[calc(120px+env(safe-area-inset-bottom))]">
      <div className="flex flex-col items-center gap-4">
        <img src={heart} alt="" className="h-16 w-[69px] object-cover" />
        <h1 className="text-[40px] font-bold tracking-[1.6px] text-white">사주 만세력</h1>
      </div>

      <div className="flex w-full max-w-[345px] flex-col gap-5">
        <div>
          <Bezel className="h-[48px] w-full px-4">
            <input
              type="text"
              inputMode="text"
              placeholder="이름/닉네임 입력"
              value={input.nickname}
              onChange={(e) => update('nickname', e.target.value)}
              className="w-full bg-transparent text-[16px] tracking-[1.28px] text-[#101010] placeholder:text-[#b1b1b1] focus:outline-none"
            />
          </Bezel>
          {touched && realismErrors.nickname && <p className="mt-1 text-[12px] text-[#ff6b9d]">{realismErrors.nickname}</p>}
        </div>

        <div className="flex w-full gap-5">
          <button
            type="button"
            onClick={() => update('gender', '여')}
            className={`flex h-[48px] flex-1 items-center justify-center rounded-[4px] px-4 text-[16px] tracking-[1.28px] shadow-[inset_0_3px_0_0_rgba(0,0,0,0.4)] ${
              input.gender === '여' ? 'bg-[#f31bc0] text-white' : 'bg-white text-[#101010]'
            }`}
          >
            여자
          </button>
          <button
            type="button"
            onClick={() => update('gender', '남')}
            className={`flex h-[48px] flex-1 items-center justify-center rounded-[4px] px-4 text-[16px] tracking-[1.28px] shadow-[inset_0_3px_0_0_rgba(0,0,0,0.4)] ${
              input.gender === '남' ? 'bg-[#f31bc0] text-white' : 'bg-white text-[#101010]'
            }`}
          >
            남자
          </button>
        </div>

        <div className="flex w-full flex-col">
          <div>
            <Bezel className="h-[48px] w-full px-4">
              <input
                type="text"
                inputMode="numeric"
                placeholder="1990.01.01"
                value={dateText}
                onChange={(e) => handleDateTextChange(e.target.value)}
                className="w-full bg-transparent text-[16px] tracking-[3.2px] text-[#101010] placeholder:text-[#b1b1b1] focus:outline-none"
              />
            </Bezel>
            {touched && dateError && <p className="mt-1 text-[12px] text-[#ff6b9d]">{dateError}</p>}
          </div>

          <div className="mt-4 flex w-full gap-4">
            <PixelCheckbox
              id="calendar-solar"
              label="양력"
              checked={input.calendarType === 'solar'}
              onChange={() => selectCalendarType('solar')}
            />
            <PixelCheckbox
              id="calendar-lunar"
              label="음력"
              checked={input.calendarType === 'lunar'}
              onChange={() => selectCalendarType('lunar')}
            />
            <PixelCheckbox
              id="leap-month"
              label="윤달"
              checked={input.isLeapMonth}
              onChange={(e) => {
                const isLeapMonth = e.target.checked
                setInput((prev) => ({ ...prev, isLeapMonth, calendarType: isLeapMonth ? 'lunar' : prev.calendarType }))
              }}
            />
          </div>

          <div className="mt-5">
            <div className="flex gap-4">
              <Bezel className="h-[48px] flex-1">
                <PixelSelect
                  value={input.ampm}
                  disabled={input.timeUnknown}
                  onChange={(e) => update('ampm', e.target.value as 'AM' | 'PM')}
                  className="absolute inset-0 w-full px-4"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </PixelSelect>
                <span aria-hidden className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-['Mona10'] text-[#101010]">▼</span>
              </Bezel>
              <Bezel className="h-[48px] w-[200px] justify-center px-4">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="00:00"
                  disabled={input.timeUnknown}
                  value={timeText}
                  onChange={(e) => handleTimeTextChange(e.target.value)}
                  className="w-full bg-transparent text-center text-[16px] tracking-[3.2px] text-[#101010] placeholder:text-[#b1b1b1] focus:outline-none disabled:opacity-50"
                />
              </Bezel>
            </div>
            {touched && timeError && <p className="mt-1 text-[12px] text-[#ff6b9d]">{timeError}</p>}
          </div>

          <div className="mt-4">
            <PixelCheckbox
              id="time-unknown"
              label="시간 모름"
              checked={input.timeUnknown}
              onChange={(e) => update('timeUnknown', e.target.checked)}
            />
          </div>
        </div>

        <Bezel className="h-[48px] w-full">
          <PixelSelect
            value={input.city}
            onChange={(e) => update('city', e.target.value as SajuFormInput['city'])}
            className="absolute inset-0 w-full px-4 tracking-[1.28px]"
          >
            {CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.displayName}
              </option>
            ))}
          </PixelSelect>
          <span aria-hidden className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-['Mona10'] text-[#101010]">▼</span>
        </Bezel>
      </div>

      <div className="w-full max-w-[345px]">
        <PixelButton onClick={handleSubmit}>확인하기</PixelButton>
      </div>
    </div>
  )
}
