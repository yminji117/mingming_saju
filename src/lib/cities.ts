// PRD §4.3 — 진태양시 보정용 8개 도시 좌표. displayName은 Figma 표기(정식 행정구역명) 기준.
export const CITIES = [
  { name: '서울', displayName: '서울특별시', longitude: 126.98 },
  { name: '인천', displayName: '인천광역시', longitude: 126.71 },
  { name: '대전', displayName: '대전광역시', longitude: 127.38 },
  { name: '전주', displayName: '전주시', longitude: 127.15 },
  { name: '광주', displayName: '광주광역시', longitude: 126.85 },
  { name: '대구', displayName: '대구광역시', longitude: 128.6 },
  { name: '부산', displayName: '부산광역시', longitude: 129.08 },
  { name: '제주', displayName: '제주특별자치도', longitude: 126.53 },
] as const

export type CityName = (typeof CITIES)[number]['name']

export const DEFAULT_CITY: CityName = '서울'
