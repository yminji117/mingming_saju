import type { SajuFormInput } from './types'

// PRD §5.2a — AI 해석 캐시(§6.4)와는 별개. "입력 폼을 다시 채울지"를 위한 저장.
const LAST_INPUT_KEY = 'saju:lastInput'

export function loadLastInput(): SajuFormInput | null {
  const raw = localStorage.getItem(LAST_INPUT_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SajuFormInput
  } catch {
    return null
  }
}

export function saveLastInput(input: SajuFormInput): void {
  localStorage.setItem(LAST_INPUT_KEY, JSON.stringify(input))
}

export function clearLastInput(): void {
  localStorage.removeItem(LAST_INPUT_KEY)
}
