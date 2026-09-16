// PRD §4.3 — 진태양시 보정용 좌표. 17개 광역자치단체 전체(도 단위는 도청 소재지 경도 기준).
export const CITIES = [
  { name: '서울', displayName: '서울특별시', longitude: 126.98 },
  { name: '부산', displayName: '부산광역시', longitude: 129.08 },
  { name: '대구', displayName: '대구광역시', longitude: 128.6 },
  { name: '인천', displayName: '인천광역시', longitude: 126.71 },
  { name: '광주', displayName: '광주광역시', longitude: 126.85 },
  { name: '대전', displayName: '대전광역시', longitude: 127.38 },
  { name: '울산', displayName: '울산광역시', longitude: 129.31 },
  { name: '세종', displayName: '세종특별자치시', longitude: 127.29 },
  { name: '경기', displayName: '경기도', longitude: 127.01 },
  { name: '강원', displayName: '강원특별자치도', longitude: 127.73 },
  { name: '충북', displayName: '충청북도', longitude: 127.49 },
  { name: '충남', displayName: '충청남도', longitude: 126.66 },
  { name: '전북', displayName: '전북특별자치도', longitude: 127.15 },
  { name: '전남', displayName: '전라남도', longitude: 126.46 },
  { name: '경북', displayName: '경상북도', longitude: 128.66 },
  { name: '경남', displayName: '경상남도', longitude: 128.68 },
  { name: '제주', displayName: '제주특별자치도', longitude: 126.53 },
] as const

export type CityName = (typeof CITIES)[number]['name']

export const DEFAULT_CITY: CityName = '서울'
