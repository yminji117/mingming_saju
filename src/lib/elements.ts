// Figma 48:1194 "오행 컬러" — 색상만으로 구분하지 않고 항상 글자와 함께 쓴다.
export const ELEMENT_COLOR: Record<string, string> = {
  목: '#17c666',
  화: '#d61f34',
  토: '#f3b526',
  금: '#c0c0c0',
  수: '#1c84e5',
}

export const ELEMENT_ORDER = ['목', '화', '토', '금', '수'] as const

// Figma 48:1206 텍스트 노드의 stroke 색상 (fill은 흰색 고정, 2px 아웃라인만 오행별로 다름)
export const ELEMENT_OUTLINE_COLOR: Record<string, string> = {
  목: '#107b5d',
  화: '#d80e0d',
  토: '#86604c',
  금: '#747790',
  수: '#0161d1',
}

// Figma 48:1206 "십성별 컬러" — 일주 배지 문구용 색상 단어
export const ELEMENT_COLOR_WORD: Record<string, string> = {
  목: '초록',
  화: '빨간',
  토: '노란',
  금: '흰',
  수: '검정',
}

// 십이지 동물 — key는 branchKo(자·축·인·묘·...)와 동일한 한글 한 글자
export const BRANCH_ANIMAL: Record<string, string> = {
  자: '쥐',
  축: '소',
  인: '호랑이',
  묘: '토끼',
  진: '용',
  사: '뱀',
  오: '말',
  미: '양',
  신: '원숭이',
  유: '닭',
  술: '개',
  해: '돼지',
}
