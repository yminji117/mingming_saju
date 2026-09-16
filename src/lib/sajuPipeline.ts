import { calculateSaju, lunarToSolar, type SajuResult } from 'ssaju'
import { CITIES } from './cities.ts'
import { applyDstCorrection } from './dst.ts'
import { to24Hour } from './time.ts'
import type { SajuFormInput } from './types.ts'

export type SajuComputation = {
  result: SajuResult
  timeUnknown: boolean
  dstApplied: boolean
  localMeanTimeOffsetMinutes: number
  solarDate: { year: number; month: number; day: number }
}

// PRD §4.1 계산 순서 — 이 순서를 바꾸면 결과가 달라진다.
// ① 음력→양력  ② 서머타임 보정  ③ 진태양시 보정(ssaju 내장 옵션)  ④ calculateSaju()  ⑤ 시간 미상 처리
// useLocalMeanTime: false — 결과 화면 진태양시 토글(§5.3 [1])이 꺼졌을 때 보정 없이 재계산하기 위한 옵션
export function computeSaju(input: SajuFormInput, options: { useLocalMeanTime?: boolean } = {}): SajuComputation {
  const useLocalMeanTime = options.useLocalMeanTime ?? true
  // ① 음력 → 양력
  const solar =
    input.calendarType === 'lunar'
      ? lunarToSolar(input.year, input.month, input.day, input.isLeapMonth)
      : { year: input.year, month: input.month, day: input.day }

  const city = CITIES.find((c) => c.name === input.city) ?? CITIES[0]

  if (input.timeUnknown) {
    // 시간 미상 — 라이브러리엔 12시로 넘기되 timeUnknown 플래그로 호출부에서 시주 관련 값을 감춘다 (PRD §4.5)
    const result = calculateSaju({
      year: solar.year,
      month: solar.month,
      day: solar.day,
      hour: 12,
      minute: 0,
      gender: input.gender,
      calendar: 'solar',
    })
    return { result, timeUnknown: true, dstApplied: false, localMeanTimeOffsetMinutes: 0, solarDate: solar }
  }

  const hour24 = to24Hour(input.ampm, input.hour)
  const rawDate = new Date(solar.year, solar.month - 1, solar.day, hour24, input.minute)

  // ② 서머타임 보정
  const { corrected, wasDst } = applyDstCorrection(rawDate)

  // ③+④ 진태양시 보정(ssaju 내장 applyLocalMeanTime) + 사주 계산
  const result = calculateSaju({
    year: corrected.getFullYear(),
    month: corrected.getMonth() + 1,
    day: corrected.getDate(),
    hour: corrected.getHours(),
    minute: corrected.getMinutes(),
    gender: input.gender,
    calendar: 'solar',
    ...(useLocalMeanTime ? { applyLocalMeanTime: true, longitude: city.longitude } : {}),
  })

  return {
    result,
    timeUnknown: false,
    dstApplied: wasDst,
    localMeanTimeOffsetMinutes: result.normalized.localMeanTime?.offsetMinutes ?? 0,
    solarDate: solar,
  }
}
