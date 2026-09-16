// PRD §5.3 [2] — 오행 색상. 색상만으로 구분하지 않고 항상 글자와 함께 쓴다.
export const ELEMENT_COLOR: Record<string, string> = {
  목: '#2f9e44',
  화: '#e03131',
  토: '#f0b429',
  금: '#868e96',
  수: '#1971c2',
}

export const ELEMENT_ORDER = ['목', '화', '토', '금', '수'] as const

// 헤더 "당신을 상징하는 글자" 문구용 — 오행 한자 대신 쉬운 말로
export const ELEMENT_PLAIN: Record<string, string> = {
  목: '나무',
  화: '불',
  토: '흙',
  금: '쇠',
  수: '물',
}
