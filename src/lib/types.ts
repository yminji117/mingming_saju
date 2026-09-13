import type { CityName } from './cities.ts'

export type SajuFormInput = {
  nickname: string
  calendarType: 'solar' | 'lunar'
  isLeapMonth: boolean
  year: number
  month: number
  day: number
  ampm: 'AM' | 'PM'
  hour: number // 1~12
  minute: number // 0~55, 5분 단위
  timeUnknown: boolean
  city: CityName
  gender: '남' | '여'
}
