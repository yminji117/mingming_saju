// 24시간제 ↔ 12시간제+AM/PM 변환, "오전/오후 HH:MM" 한글 표시 검증
import assert from 'node:assert/strict'
import { formatKoreanTime, to12Hour, to24Hour } from '../src/lib/time.ts'

assert.equal(formatKoreanTime(0, 0), '오전 12:00') // 자정
assert.equal(formatKoreanTime(9, 30), '오전 09:30')
assert.equal(formatKoreanTime(11, 59), '오전 11:59')
assert.equal(formatKoreanTime(12, 0), '오후 12:00') // 정오
assert.equal(formatKoreanTime(14, 30), '오후 02:30')
assert.equal(formatKoreanTime(23, 5), '오후 11:05')

// to12Hour / to24Hour 경계값 — 자정/정오, 왕복 변환
assert.deepEqual(to12Hour(0), { hour: 12, ampm: 'AM' })
assert.deepEqual(to12Hour(12), { hour: 12, ampm: 'PM' })
assert.deepEqual(to12Hour(9), { hour: 9, ampm: 'AM' })
assert.deepEqual(to12Hour(21), { hour: 9, ampm: 'PM' })
assert.equal(to24Hour('AM', 12), 0)
assert.equal(to24Hour('PM', 12), 12)
assert.equal(to24Hour('AM', 9), 9)
assert.equal(to24Hour('PM', 9), 21)

console.log('verify-time-input: all checks passed')
