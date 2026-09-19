// 스크롤 위치 ↔ 인덱스 순수 변환 — TimePickerModal의 CSS scroll-snap 휠에서 사용
export function indexToScrollTop(index: number, itemHeight: number): number {
  return index * itemHeight
}

export function scrollTopToIndex(scrollTop: number, itemHeight: number): number {
  return Math.round(scrollTop / itemHeight)
}

export function clampIndex(index: number, length: number): number {
  return Math.min(Math.max(index, 0), length - 1)
}

// 첫/마지막 항목도 가운데로 스크롤될 수 있게 위아래에 줄 패딩
export function wheelPadding(itemHeight: number, visibleRows: number): number {
  return itemHeight * Math.floor(visibleRows / 2)
}
