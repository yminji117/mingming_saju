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

// ssaju의 역마살 판별 테이블은 삼합 그룹이 아니라 단순 정충(반대편) 지지로 되어 있어
// 왕지·고지 8개 지지(子丑卯辰午未酉戌)에서 틀린 값을 낸다 (생지 4개 寅申巳亥만 우연히 일치).
// 일지 기준 올바른 삼합 그룹 규칙으로 다시 계산해 교체한다.
const YEOKMA_TARGET: Record<string, string> = {
  寅: '申', 午: '申', 戌: '申',
  申: '寅', 子: '寅', 辰: '寅',
  巳: '亥', 酉: '亥', 丑: '亥',
  亥: '巳', 卯: '巳', 未: '巳',
}

function fixYeokmasal(result: SajuResult): void {
  const target = YEOKMA_TARGET[result.pillarDetails.day.branch]
  for (const key of ['year', 'month', 'day', 'hour'] as const) {
    const pillar = result.sals[key]
    pillar.specialSals = pillar.specialSals.filter((s) => s !== '역마살')
    if (result.pillarDetails[key].branch === target) {
      pillar.specialSals.push('역마살')
    }
  }
}

// ssaju가 계산하지 않는 신살 11종 (Figma 48:869 참고). WebSearch로 계산 규칙을 확인해
// 일간(또는 연간) 기준 대조표로 직접 계산한다. 전부 검증된 표는 아니라 항목별로 근거를 남긴다.

// 일간 → 지지 1개 (복수 소스 일치, 자체 검증됨)
const AMROK: Record<string, string> = { 甲: '亥', 乙: '戌', 丙: '申', 丁: '未', 戊: '申', 己: '未', 庚: '巳', 辛: '辰', 壬: '寅', 癸: '丑' }
const MUNCHANG: Record<string, string> = { 甲: '巳', 乙: '午', 丙: '申', 丁: '酉', 戊: '申', 己: '酉', 庚: '亥', 辛: '子', 壬: '寅', 癸: '卯' }
const MUNGOK: Record<string, string> = { 甲: '亥', 乙: '子', 丙: '寅', 丁: '卯', 戊: '寅', 己: '卯', 庚: '巳', 辛: '午', 壬: '申', 癸: '酉' }
const HAKDANG: Record<string, string> = { 甲: '亥', 乙: '午', 丙: '寅', 丁: '卯', 戊: '寅', 己: '卯', 庚: '亥', 辛: '子', 壬: '申', 癸: '卯' }
// 천간합 짝(甲己·乙庚·丙辛·丁壬·戊癸) 기준 지지 1개
const NAKJEONG: Record<string, string> = { 甲: '巳', 己: '巳', 乙: '子', 庚: '子', 丙: '申', 辛: '申', 丁: '戌', 壬: '戌', 戊: '卯', 癸: '卯' }
// 일간 → 지지 2개
const HYEOPROK: Record<string, [string, string]> = {
  甲: ['丑', '卯'], 乙: ['寅', '辰'], 丙: ['辰', '午'], 丁: ['巳', '未'], 戊: ['辰', '午'],
  己: ['巳', '未'], 庚: ['未', '酉'], 辛: ['申', '戌'], 壬: ['戌', '子'], 癸: ['亥', '丑'],
}
// 양간(甲丙戊庚壬)에만 존재 — 음간은 다수설 기준 해당 없음
const YANGIN: Record<string, string> = { 甲: '卯', 丙: '午', 戊: '午', 庚: '酉', 壬: '子' }
// 기둥 자체의 간지 조합(60갑자 중 이 7개)이면 해당 기둥에 표시 — 지지 단독 판정이 아님
const BAEKHO_PAIRS = new Set(['甲辰', '乙未', '丙戌', '丁丑', '戊辰', '壬戌', '癸丑'])
// 연간의 식신 천간(연간 기준 두 자리 앞) — 월/일/시 천간 중 일치하는 기둥에 표시 (연주 자신은 대상 제외)
const BOKSEONG_TARGET: Record<string, string> = { 甲: '丙', 乙: '丁', 丙: '戊', 丁: '己', 戊: '庚', 己: '辛', 庚: '壬', 辛: '癸', 壬: '甲', 癸: '乙' }
// 검색으로 직접 확인된 4개(乙丙辛壬)만 — 나머지 6개는 신뢰할 수 있는 근거를 못 찾아 비워둔다
const CHEONJU: Partial<Record<string, string>> = { 乙: '午', 丙: '申', 辛: '子', 壬: '寅' }
// 월지 삼합 그룹 기준 천간 1개 — 8글자 중 어디에 있든 적용
const WOLDEOK: Record<string, string> = {
  寅: '丙', 午: '丙', 戌: '丙',
  申: '壬', 子: '壬', 辰: '壬',
  亥: '甲', 卯: '甲', 未: '甲',
  巳: '庚', 酉: '庚', 丑: '庚',
}

function addExtraSinsal(result: SajuResult): void {
  const dayStem = result.pillarDetails.day.stem
  const yearStem = result.pillarDetails.year.stem
  const woldeokTarget = WOLDEOK[result.pillarDetails.month.branch]
  const amrok = AMROK[dayStem]
  const munchang = MUNCHANG[dayStem]
  const mungok = MUNGOK[dayStem]
  const hakdang = HAKDANG[dayStem]
  const nakjeong = NAKJEONG[dayStem]
  const hyeoprok = HYEOPROK[dayStem]
  const yangin = YANGIN[dayStem]
  const cheonju = CHEONJU[dayStem]
  const bokseongTarget = BOKSEONG_TARGET[yearStem]

  for (const key of ['year', 'month', 'day', 'hour'] as const) {
    const branch = result.pillarDetails[key].branch
    const stem = result.pillarDetails[key].stem
    const tags = result.sals[key].specialSals

    if (branch === amrok) tags.push('암록')
    if (branch === munchang) tags.push('문창귀인')
    if (branch === mungok) tags.push('문곡귀인')
    if (branch === hakdang) tags.push('학당귀인')
    if (branch === nakjeong) tags.push('낙정관살')
    if (hyeoprok?.includes(branch)) tags.push('협록')
    if (yangin && branch === yangin) tags.push('양인살')
    if (cheonju && branch === cheonju) tags.push('천주귀인')
    if (BAEKHO_PAIRS.has(`${stem}${branch}`)) tags.push('백호살')
    if (stem === '甲' || stem === '辛' || ['卯', '午', '未', '申'].includes(branch)) tags.push('현침살')
    if (key !== 'year' && bokseongTarget && stem === bokseongTarget) tags.push('복성귀인')
    if (stem === woldeokTarget) tags.push('월덕귀인')
  }
}

// PRD §4.1 계산 순서 — 이 순서를 바꾸면 결과가 달라진다.
// ① 음력→양력  ② 서머타임 보정  ③ 진태양시 보정(ssaju 내장 옵션, 항상 적용)  ④ calculateSaju()  ⑤ 시간 미상 처리
export function computeSaju(input: SajuFormInput): SajuComputation {
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
    fixYeokmasal(result)
    addExtraSinsal(result)
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
    applyLocalMeanTime: true,
    longitude: city.longitude,
  })
  fixYeokmasal(result)
  addExtraSinsal(result)

  return {
    result,
    timeUnknown: false,
    dstApplied: wasDst,
    localMeanTimeOffsetMinutes: result.normalized.localMeanTime?.offsetMinutes ?? 0,
    solarDate: solar,
  }
}
