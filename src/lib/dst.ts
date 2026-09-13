// PRD §4.4 서머타임 — ssaju는 처리하지 않으므로 직접 구현.
// 날짜/시각은 IANA tzdata(Asia/Seoul, 이 macOS에 내장)를 `zdump -v Asia/Seoul`로 덤프해서
// 가져온 실제 전환 시각이다 — 블로그 추정치 대신 소프트웨어 업계 표준 소스를 그대로 썼다.
// 전환 시각이 자정(00:00)이 아닌 해(1987, 1988)는 실제 그 시각(새벽 2~3시)에 맞췄다.
const DST_PERIODS: { start: Date; end: Date }[] = [
  { start: new Date(1948, 5, 1, 0, 0), end: new Date(1948, 8, 13, 0, 0) },
  { start: new Date(1949, 3, 3, 0, 0), end: new Date(1949, 8, 11, 0, 0) },
  { start: new Date(1950, 3, 1, 0, 0), end: new Date(1950, 8, 10, 0, 0) },
  { start: new Date(1951, 4, 6, 0, 0), end: new Date(1951, 8, 9, 0, 0) },
  { start: new Date(1955, 4, 5, 0, 0), end: new Date(1955, 8, 9, 0, 0) },
  { start: new Date(1956, 4, 20, 0, 0), end: new Date(1956, 8, 30, 0, 0) },
  { start: new Date(1957, 4, 5, 0, 0), end: new Date(1957, 8, 22, 0, 0) },
  { start: new Date(1958, 4, 4, 0, 0), end: new Date(1958, 8, 21, 0, 0) },
  { start: new Date(1959, 4, 3, 0, 0), end: new Date(1959, 8, 20, 0, 0) },
  { start: new Date(1960, 4, 1, 0, 0), end: new Date(1960, 8, 18, 0, 0) },
  { start: new Date(1987, 4, 10, 2, 0), end: new Date(1987, 9, 11, 3, 0) },
  { start: new Date(1988, 4, 8, 2, 0), end: new Date(1988, 9, 9, 3, 0) },
]

export function isDstDate(date: Date): boolean {
  return DST_PERIODS.some((p) => date >= p.start && date < p.end)
}

// 서머타임 기간이면 1시간을 빼서 실제 표준시로 되돌린 Date를 반환한다.
export function applyDstCorrection(date: Date): { corrected: Date; wasDst: boolean } {
  const wasDst = isDstDate(date)
  if (!wasDst) return { corrected: date, wasDst: false }
  const corrected = new Date(date.getTime() - 60 * 60 * 1000)
  return { corrected, wasDst: true }
}
