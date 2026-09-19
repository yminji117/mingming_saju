import type { CityName } from './cities.ts'

export type SajuFormInput = {
  nickname: string
  calendarType: 'solar' | 'lunar'
  isLeapMonth: boolean
  year: number
  month: number
  day: number
  hour: number // 0~23
  minute: number // 0~59
  timeUnknown: boolean
  city: CityName
  gender: '남' | '여'
}
