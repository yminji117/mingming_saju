// AM/PM 12시간제 → 24시간제
export function to24Hour(ampm: 'AM' | 'PM', hour12: number): number {
  if (ampm === 'AM') return hour12 === 12 ? 0 : hour12
  return hour12 === 12 ? 12 : hour12 + 12
}
