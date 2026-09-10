import { lunarToSolar } from 'ssaju'

// PRD §4.7 — "실제 윤달이 있는 달만 체크 가능". ssaju가 없는 윤달 조합엔 에러를 던지므로
// 그 특성을 그대로 이용해 연도별 윤달을 찾는다. (ponytail: 별도 절기 데이터/라이브러리 불필요)
const leapMonthCache = new Map<number, number | null>()

export function getLeapMonth(year: number): number | null {
  if (leapMonthCache.has(year)) return leapMonthCache.get(year)!
  let found: number | null = null
  for (let month = 1; month <= 12; month++) {
    try {
      lunarToSolar(year, month, 1, true)
      found = month
      break
    } catch {
      // 해당 월엔 윤달이 없음 — 계속 탐색
    }
  }
  leapMonthCache.set(year, found)
  return found
}
