import { lunarToSolar } from 'ssaju'
import type { SajuFormInput } from './types'

const MIN_YEAR = 1900

export type FormErrors = Partial<Record<'nickname' | 'date', string>>

export function validateForm(input: SajuFormInput): FormErrors {
  const errors: FormErrors = {}

  if (!input.nickname.trim()) {
    errors.nickname = '이름/닉네임을 입력해 주세요'
  }

  const currentYear = new Date().getFullYear()
  if (input.year < MIN_YEAR || input.year > currentYear) {
    errors.date = '1900년 이후만 계산할 수 있어요'
    return errors
  }

  let solarDate: Date | null = null
  if (input.calendarType === 'solar') {
    const d = new Date(input.year, input.month - 1, input.day)
    const isReal = d.getFullYear() === input.year && d.getMonth() === input.month - 1 && d.getDate() === input.day
    if (!isReal) {
      errors.date = '실재하지 않는 날짜예요'
      return errors
    }
    solarDate = d
  } else {
    try {
      const solar = lunarToSolar(input.year, input.month, input.day, input.isLeapMonth)
      solarDate = new Date(solar.year, solar.month - 1, solar.day)
    } catch {
      errors.date = '실재하지 않는 음력 날짜예요'
      return errors
    }
  }

  const today = new Date()
  today.setHours(23, 59, 59, 999)
  if (solarDate > today) {
    errors.date = '아직 오지 않은 날짜예요'
  }

  return errors
}

export function isFormValid(input: SajuFormInput): boolean {
  return Object.keys(validateForm(input)).length === 0
}
