// 생년월일/시각을 select 대신 직접 입력 텍스트로 받을 때 쓰는 파싱 유틸

// 숫자만 입력해도 "YYYY.MM.DD" 형태로 자동 포맷 (뒤에서부터 지워도 자연스럽게 동작)
export function formatDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  return [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)].filter(Boolean).join('.')
}

export function parseDateText(text: string): { year: number; month: number; day: number } | null {
  const m = text.trim().match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})$/)
  if (!m) return null
  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) }
}

// 숫자만 입력해도 "HH:MM" 형태로 자동 포맷
export function formatTimeInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  return [digits.slice(0, 2), digits.slice(2, 4)].filter(Boolean).join(':')
}

export function parseTimeText(text: string): { hour: number; minute: number } | null {
  const m = text.trim().match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  const hour = Number(m[1])
  const minute = Number(m[2])
  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null
  return { hour, minute }
}
