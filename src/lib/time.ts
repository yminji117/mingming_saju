// 24시간제 hour → 12시간제 hour + AM/PM
export function to12Hour(hour24: number): { hour: number; ampm: 'AM' | 'PM' } {
  const ampm = hour24 < 12 ? 'AM' : 'PM'
  const hour = hour24 % 12 === 0 ? 12 : hour24 % 12
  return { hour, ampm }
}

// 12시간제 hour + AM/PM → 24시간제 hour
export function to24Hour(ampm: 'AM' | 'PM', hour12: number): number {
  if (ampm === 'AM') return hour12 === 12 ? 0 : hour12
  return hour12 === 12 ? 12 : hour12 + 12
}

// 24시간제 hour/minute → 결과 화면 표시용 "오전/오후 HH:MM" 한글 라벨
export function formatKoreanTime(hour24: number, minute: number): string {
  const { hour, ampm } = to12Hour(hour24)
  return `${ampm === 'AM' ? '오전' : '오후'} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}
