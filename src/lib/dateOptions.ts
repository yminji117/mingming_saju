const MIN_YEAR = 1900

export function yearOptions(): number[] {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let y = currentYear; y >= MIN_YEAR; y--) years.push(y)
  return years
}

export function monthOptions(): number[] {
  return Array.from({ length: 12 }, (_, i) => i + 1)
}

// ponytail: 음력은 월마다 29일/30일이 갈리는데 정확한 일수는 계산이 필요해 여기선 30일까지 보여준다.
// 실제 없는 날짜(예: 음력 29일까지인 달에 30일 선택)는 제출 시 validateForm이 ssaju로 걸러낸다.
// 음력 월별 정확한 일수 표시가 필요해지면 그때 ssaju 변환 기반으로 좁힌다.
export function dayOptions(year: number, month: number, calendarType: 'solar' | 'lunar'): number[] {
  const max = calendarType === 'lunar' ? 30 : new Date(year, month, 0).getDate()
  return Array.from({ length: max }, (_, i) => i + 1)
}

export function hourOptions(): number[] {
  return Array.from({ length: 12 }, (_, i) => i + 1)
}

export function minuteOptions(): number[] {
  return Array.from({ length: 12 }, (_, i) => i * 5)
}
