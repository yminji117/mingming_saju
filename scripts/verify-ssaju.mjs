// Day 1 검증: ssaju가 계산한 사주 8글자가 독립적으로 유도한 값과 일치하는지 확인한다.
// PRD §7 "Day 1을 건너뛰지 않는다" — 라이브러리가 틀리면 그 위에 쌓은 전부를 다시 만들어야 한다.
import { calculateSaju } from 'ssaju'

const STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계']
const BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해']
const HANJA_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const HANJA_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

// 앙커: 1984-01-31 = 갑자일 (60일 주기 기준점).
// 근거: 1984년 갑자일 6회 = 1/31, 3/31, 5/30, 7/29, 9/27, 11/26 (각 60일 간격, 상호 검증됨).
// 11/26 12:00은 ssaju 실측으로도 연주·일주가 모두 甲子로 나와 이 앙커가 맞다는 걸 재확인했다.
const ANCHOR_UTC_DAY = Date.UTC(1984, 0, 31) / 86400000 // 갑자일(index 0)

function expectedDayPillar(year, month, day) {
  const utcDay = Date.UTC(year, month - 1, day) / 86400000
  const diff = utcDay - ANCHOR_UTC_DAY
  const idx = ((diff % 60) + 60) % 60
  return HANJA_STEMS[idx % 10] + HANJA_BRANCHES[idx % 12]
}

function labelDayPillar(year, month, day) {
  const utcDay = Date.UTC(year, month - 1, day) / 86400000
  const diff = utcDay - ANCHOR_UTC_DAY
  const idx = ((diff % 60) + 60) % 60
  return STEMS[idx % 10] + BRANCHES[idx % 12]
}

// 연주 공식: (year-4) mod 10 → 천간, (year-4) mod 12 → 지지. (절기 기준으로 이미 "사주 연도"가 정해진 뒤에만 유효)
function expectedYearPillar(sajuYear) {
  const stemIdx = ((sajuYear - 4) % 10 + 10) % 10
  const branchIdx = ((sajuYear - 4) % 12 + 12) % 12
  return HANJA_STEMS[stemIdx] + HANJA_BRANCHES[branchIdx]
}

// 시두법: 일간 index와 시지 index로 시간 천간을 구한다. (오자시두 공식: hourStem = (dayStemIdx*2 + branchIdx) mod 10)
function expectedHourPillar(dayStemHanja, hour) {
  const dayStemIdx = HANJA_STEMS.indexOf(dayStemHanja)
  // 23:00~00:59=자(0), 01~03=축(1), ... 21~23=해(11)
  const branchIdx = Math.floor((((hour + 1) % 24) / 2)) % 12
  const hourStemIdx = (dayStemIdx * 2 + branchIdx) % 10
  return HANJA_STEMS[hourStemIdx] + HANJA_BRANCHES[branchIdx]
}

function check(label, expected, actual) {
  const ok = expected == null || expected === actual
  console.log(`  ${ok ? '✅' : '❌'} ${label}: 기대 ${expected ?? '(계산 안 함)'} / 실제 ${actual}`)
  return ok
}

const cases = [
  {
    name: '1) 1984-01-31 정오 — 일주 앙커 #1',
    input: { year: 1984, month: 1, day: 31, hour: 12, minute: 0, gender: '남' },
    expect: { day: true },
  },
  {
    name: '2) 1984-03-31 정오 — 일주 앙커 #2 (60일 후)',
    input: { year: 1984, month: 3, day: 31, hour: 12, minute: 0, gender: '남' },
    expect: { day: true },
  },
  {
    name: '3) 1984-11-26 정오 — 연주+일주 앙커 (연주 甲子 역사적 확인 사례)',
    input: { year: 1984, month: 11, day: 26, hour: 12, minute: 0, gender: '남' },
    expect: { day: true, year: 1984 },
  },
  {
    name: '4) 2000-01-20 정오 — PRD §4.2 예시 (입춘 전 → 1999년 己卯)',
    input: { year: 2000, month: 1, day: 20, hour: 12, minute: 0, gender: '여' },
    expect: { day: true, year: 1999 },
  },
  {
    name: '5) 2000-02-04 21:00 — 입춘(21:40) 40분 전, 아직 1999년',
    input: { year: 2000, month: 2, day: 4, hour: 21, minute: 0, gender: '남' },
    expect: { day: true, year: 1999 },
  },
  {
    name: '6) 2000-02-04 22:00 — 입춘(21:40) 20분 후, 이미 2000년',
    input: { year: 2000, month: 2, day: 4, hour: 22, minute: 0, gender: '남' },
    expect: { day: true, year: 2000 },
  },
  {
    name: '7) 2026-09-10 정오 — 오늘 날짜 (실사용 시나리오 sanity check)',
    input: { year: 2026, month: 9, day: 10, hour: 12, minute: 0, gender: '여' },
    expect: { day: true, year: 2026 },
  },
  {
    name: '8) 1990-06-15 23:30 — 자시 정책 관찰 A (야자시 구간)',
    input: { year: 1990, month: 6, day: 15, hour: 23, minute: 30, gender: '남' },
    expect: {},
    note: '15일 일주 기대값: ' + labelDayPillar(1990, 6, 15) + ' / 16일 일주 기대값: ' + labelDayPillar(1990, 6, 16),
  },
  {
    name: '9) 1990-06-16 00:30 — 자시 정책 관찰 B (조자시 구간)',
    input: { year: 1990, month: 6, day: 16, hour: 0, minute: 30, gender: '남' },
    expect: {},
    note: '15일 일주 기대값: ' + labelDayPillar(1990, 6, 15) + ' / 16일 일주 기대값: ' + labelDayPillar(1990, 6, 16),
  },
]

let allOk = true

for (const c of cases) {
  console.log(`\n${c.name}`)
  const r = calculateSaju(c.input)
  console.log(`  입력: ${JSON.stringify(c.input)}`)
  console.log(`  ssaju 결과: 연주 ${r.pillars.year} 월주 ${r.pillars.month} 일주 ${r.pillars.day} 시주 ${r.pillars.hour}`)

  if (c.expect.day) {
    const expected = expectedDayPillar(c.input.year, c.input.month, c.input.day)
    allOk = check('일주 (mod-60 앙커 계산)', expected, r.pillars.day) && allOk
  }
  if (c.expect.year != null) {
    const expected = expectedYearPillar(c.expect.year)
    allOk = check(`연주 (공식: 사주연도=${c.expect.year})`, expected, r.pillars.year) && allOk
  }
  const expectedHour = expectedHourPillar(r.pillarDetails.day.stem, c.input.hour)
  allOk = check('시주 (시두법 공식)', expectedHour, r.pillars.hour) && allOk

  if (c.note) console.log(`  ℹ️  ${c.note}`)
}

// 10) 음력 변환 스모크 테스트 — 정답 데이터 없이 에러 없이 도는지만 확인
console.log('\n10) 음력 입력 스모크 테스트 (2023년 음력 2월 15일, 평달)')
try {
  const lunarCase = calculateSaju({ year: 2023, month: 2, day: 15, hour: 12, minute: 0, gender: '여', calendar: 'lunar', leap: false })
  console.log(`  ssaju 결과: 양력 ${lunarCase.solar.year}-${lunarCase.solar.month}-${lunarCase.solar.day}, 연주 ${lunarCase.pillars.year} 월주 ${lunarCase.pillars.month} 일주 ${lunarCase.pillars.day}`)
  console.log('  ✅ 에러 없이 계산됨 (정답 대조는 별도 확인 필요 — 자동 검증 범위 밖)')
} catch (e) {
  allOk = false
  console.log('  ❌ 음력 입력 계산 실패:', e.message)
}

console.log(`\n${'='.repeat(50)}`)
console.log(allOk ? '✅ 자동 검증 항목 전부 통과' : '❌ 불일치 있음 — 위 로그 확인')
process.exit(allOk ? 0 : 1)
