// Day 3 검증: 계산 파이프라인(음력 변환 → 서머타임 → 진태양시 → ssaju)이
// PRD §4.1/§4.3/§4.4와 §8.1 체크리스트대로 동작하는지 확인한다.
import { computeSaju } from '../src/lib/sajuPipeline.ts'

let allOk = true
function check(label, cond, detail = '') {
  console.log(`  ${cond ? '✅' : '❌'} ${label}${detail ? ' — ' + detail : ''}`)
  if (!cond) allOk = false
}

const baseInput = {
  nickname: '테스트',
  calendarType: 'solar',
  isLeapMonth: false,
  timeUnknown: false,
  city: '서울',
  gender: '남',
}

console.log('\n1) 1988-07-20 15:00 서울 — 서머타임 기간 (1988.5.8 03:00 ~ 10.9 03:00)')
{
  const r = computeSaju({ ...baseInput, year: 1988, month: 7, day: 20, ampm: 'PM', hour: 3, minute: 0 })
  check('dstApplied === true', r.dstApplied === true)
  check('시주가 실제로 -1시간 보정된 값 (未시, 서머타임 미보정이면 申시)', r.result.pillars.hour.includes('未'), r.result.pillars.hour)
}

console.log('\n2) 1990-07-20 15:00 서울 — 서머타임 아닌 해 (음성 대조군)')
{
  const r = computeSaju({ ...baseInput, year: 1990, month: 7, day: 20, ampm: 'PM', hour: 3, minute: 0 })
  check('dstApplied === false', r.dstApplied === false)
}

console.log('\n3) 서울 vs 부산 진태양시 보정량 (PRD §4.3: 32분 vs 24분)')
{
  const seoul = computeSaju({ ...baseInput, city: '서울', year: 1995, month: 6, day: 15, ampm: 'AM', hour: 7, minute: 20 })
  const busan = computeSaju({ ...baseInput, city: '부산', year: 1995, month: 6, day: 15, ampm: 'AM', hour: 7, minute: 20 })
  check('서울 보정량 ≈ -32분', Math.abs(seoul.localMeanTimeOffsetMinutes - -32.08) < 0.1, seoul.localMeanTimeOffsetMinutes.toFixed(2))
  check('부산 보정량 ≈ -24분', Math.abs(busan.localMeanTimeOffsetMinutes - -23.68) < 0.1, busan.localMeanTimeOffsetMinutes.toFixed(2))
  check('서울/부산 보정량이 다르다', seoul.localMeanTimeOffsetMinutes !== busan.localMeanTimeOffsetMinutes)
}

console.log('\n4) 경계 시각(07:28) — 서울(-32분→06:56)과 부산(-24분→07:04)이 卯/辰 경계를 사이에 두고 갈리는 지점')
{
  const seoul = computeSaju({ ...baseInput, city: '서울', year: 1995, month: 6, day: 15, ampm: 'AM', hour: 7, minute: 28 })
  const busan = computeSaju({ ...baseInput, city: '부산', year: 1995, month: 6, day: 15, ampm: 'AM', hour: 7, minute: 28 })
  console.log(`  서울 시주: ${seoul.result.pillars.hour} / 부산 시주: ${busan.result.pillars.hour}`)
  check('서울/부산 시주가 다르다', seoul.result.pillars.hour !== busan.result.pillars.hour)
}

console.log('\n5) 음력 2023년 윤2월 15일 → 양력 2023-04-05 변환 확인')
{
  const r = computeSaju({ ...baseInput, calendarType: 'lunar', isLeapMonth: true, year: 2023, month: 2, day: 15, ampm: 'PM', hour: 12, minute: 0 })
  check('양력 2023-04-05로 변환됨', r.solarDate.year === 2023 && r.solarDate.month === 4 && r.solarDate.day === 5, JSON.stringify(r.solarDate))
}

console.log('\n6) 시간 미상 — 서머타임/진태양시 보정 건너뛰고 12시 계산, 시주 노출 안 함')
{
  const r = computeSaju({ ...baseInput, year: 1988, month: 7, day: 20, ampm: 'AM', hour: 12, minute: 0, timeUnknown: true })
  check('timeUnknown === true', r.timeUnknown === true)
  check('dstApplied === false (시간 미상이라 건너뜀)', r.dstApplied === false)
  check('localMeanTimeOffsetMinutes === 0', r.localMeanTimeOffsetMinutes === 0)
}

console.log(`\n${'='.repeat(50)}`)
console.log(allOk ? '✅ Day3 파이프라인 검증 전부 통과' : '❌ 불일치 있음 — 위 로그 확인')
process.exit(allOk ? 0 : 1)
