import { useMemo, useState } from 'react'
import { Bezel } from '../components/Bezel'
import { PixelButton } from '../components/PixelButton'
import { PixelCheckbox } from '../components/PixelCheckbox'
import { PixelSelect } from '../components/PixelSelect'
import { SegmentToggle } from '../components/SegmentToggle'
import { CITIES, DEFAULT_CITY } from '../lib/cities'
import { dayOptions, hourOptions, minuteOptions, monthOptions, yearOptions } from '../lib/dateOptions'
import { getLeapMonth } from '../lib/lunar'
import type { SajuFormInput } from '../lib/types'
import { validateForm } from '../lib/validation'

const DEFAULT_YEAR = new Date().getFullYear() - 20

function makeDefaultInput(): SajuFormInput {
  return {
    nickname: '',
    calendarType: 'solar',
    isLeapMonth: false,
    year: DEFAULT_YEAR,
    month: 1,
    day: 1,
    ampm: 'AM',
    hour: 12,
    minute: 0,
    timeUnknown: false,
    city: DEFAULT_CITY,
    gender: '남',
  }
}

type Props = {
  onSubmit: (input: SajuFormInput) => void
}

export function MainInputScreen({ onSubmit }: Props) {
  const [input, setInput] = useState<SajuFormInput>(makeDefaultInput)
  const [touched, setTouched] = useState(false)

  const leapMonth = useMemo(
    () => (input.calendarType === 'lunar' ? getLeapMonth(input.year) : null),
    [input.calendarType, input.year],
  )
  const days = useMemo(
    () => dayOptions(input.year, input.month, input.calendarType),
    [input.year, input.month, input.calendarType],
  )
  const errors = validateForm(input)

  function update<K extends keyof SajuFormInput>(key: K, value: SajuFormInput[K]) {
    setInput((prev) => {
      const next = { ...prev, [key]: value }
      // 연/월이 바뀌면 이전에 체크된 윤달이 더 이상 유효하지 않을 수 있어 초기화한다
      if (key === 'year' || key === 'month') next.isLeapMonth = false
      return next
    })
  }

  function handleSubmit() {
    setTouched(true)
    if (Object.keys(errors).length > 0) return
    onSubmit(input)
  }

  return (
    <div className="flex min-h-dvh flex-col items-center bg-[#1a1a1a] px-6 pt-20 pb-[calc(24px+env(safe-area-inset-bottom))]">
      <div className="flex flex-col items-center gap-4">
        <span className="text-[40px]">💗</span>
        <h1 className="font-['Mona10'] text-[40px] font-bold tracking-[1.6px] text-white">나의 만세력</h1>
      </div>

      <div className="mt-10 flex w-full max-w-[345px] flex-col gap-5">
        <p className="text-center text-[12px] text-white">태어난 생년월일을 작성해 주세요.</p>

        <div>
          <Bezel className="p-4">
            <input
              type="text"
              inputMode="text"
              placeholder="이름/닉네임 입력"
              value={input.nickname}
              onChange={(e) => update('nickname', e.target.value)}
              className="w-full bg-transparent text-[16px] text-black placeholder:text-[#b1b1b1] focus:outline-none"
            />
          </Bezel>
          {touched && errors.nickname && <p className="mt-1 text-[12px] text-[#ff6b9d]">{errors.nickname}</p>}
        </div>

        <SegmentToggle
          options={[
            { label: '양력', value: 'solar' as const },
            { label: '음력', value: 'lunar' as const },
          ]}
          value={input.calendarType}
          onChange={(v) => update('calendarType', v)}
        />

        {input.calendarType === 'lunar' && (
          <PixelCheckbox
            id="leap-month"
            label="윤달"
            checked={input.isLeapMonth}
            disabled={leapMonth !== input.month}
            onChange={(e) => update('isLeapMonth', e.target.checked)}
          />
        )}

        <div>
          <Bezel className="justify-between gap-2 p-4">
            <PixelSelect value={input.year} onChange={(e) => update('year', Number(e.target.value))}>
              {yearOptions().map((y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ))}
            </PixelSelect>
            <PixelSelect value={input.month} onChange={(e) => update('month', Number(e.target.value))}>
              {monthOptions().map((m) => (
                <option key={m} value={m}>
                  {m}월
                </option>
              ))}
            </PixelSelect>
            <PixelSelect value={input.day} onChange={(e) => update('day', Number(e.target.value))}>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}일
                </option>
              ))}
            </PixelSelect>
          </Bezel>
          {touched && errors.date && <p className="mt-1 text-[12px] text-[#ff6b9d]">{errors.date}</p>}
        </div>

        <div className="flex gap-4">
          <Bezel className="w-[129px] justify-center gap-2 p-4">
            <PixelSelect
              value={input.ampm}
              disabled={input.timeUnknown}
              onChange={(e) => update('ampm', e.target.value as 'AM' | 'PM')}
              className="text-center"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </PixelSelect>
          </Bezel>
          <Bezel className="flex-1 justify-center gap-1 p-4">
            <PixelSelect
              value={input.hour}
              disabled={input.timeUnknown}
              onChange={(e) => update('hour', Number(e.target.value))}
              className="text-center"
            >
              {hourOptions().map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, '0')}
                </option>
              ))}
            </PixelSelect>
            <span className="text-black">:</span>
            <PixelSelect
              value={input.minute}
              disabled={input.timeUnknown}
              onChange={(e) => update('minute', Number(e.target.value))}
              className="text-center"
            >
              {minuteOptions().map((m) => (
                <option key={m} value={m}>
                  {String(m).padStart(2, '0')}
                </option>
              ))}
            </PixelSelect>
          </Bezel>
        </div>

        <PixelCheckbox
          id="time-unknown"
          label="시간 모름"
          checked={input.timeUnknown}
          onChange={(e) => update('timeUnknown', e.target.checked)}
        />

        <Bezel className="justify-between p-4">
          <PixelSelect value={input.city} onChange={(e) => update('city', e.target.value as SajuFormInput['city'])}>
            {CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </PixelSelect>
        </Bezel>

        <SegmentToggle
          options={[
            { label: '남', value: '남' as const },
            { label: '여', value: '여' as const },
          ]}
          value={input.gender}
          onChange={(v) => update('gender', v)}
        />
      </div>

      <div className="mt-10 w-full max-w-[345px]">
        <PixelButton onClick={handleSubmit}>확인하기</PixelButton>
      </div>
    </div>
  )
}
