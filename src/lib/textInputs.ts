// 생년월일/시각을 select 대신 직접 입력 텍스트로 받을 때 쓰는 파싱 유틸
export function parseDateText(text: string): { year: number; month: number; day: number } | null {
  const m = text.trim().match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})$/)
  if (!m) return null
  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) }
}

export function parseTimeText(text: string): { hour: number; minute: number } | null {
  const m = text.trim().match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  const hour = Number(m[1])
  const minute = Number(m[2])
  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null
  return { hour, minute }
}
