// 생년월일을 select 대신 직접 입력 텍스트로 받을 때 쓰는 파싱 유틸

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
