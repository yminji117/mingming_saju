// PRD §4.3 — 진태양시 보정용 8개 도시 좌표
export const CITIES = [
  { name: '서울', longitude: 126.98 },
  { name: '인천', longitude: 126.71 },
  { name: '대전', longitude: 127.38 },
  { name: '전주', longitude: 127.15 },
  { name: '광주', longitude: 126.85 },
  { name: '대구', longitude: 128.6 },
  { name: '부산', longitude: 129.08 },
  { name: '제주', longitude: 126.53 },
] as const

export type CityName = (typeof CITIES)[number]['name']

export const DEFAULT_CITY: CityName = '서울'
