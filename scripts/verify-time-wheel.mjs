// 시/분 휠 피커의 스크롤 위치 ↔ 인덱스 순수 변환 검증
import assert from 'node:assert/strict'
import { clampIndex, indexToScrollTop, scrollTopToIndex, wheelPadding } from '../src/lib/timeWheel.ts'

// indexToScrollTop — 시(0~23)/분(0~59) 양쪽 경계값
assert.equal(indexToScrollTop(0, 40), 0)
assert.equal(indexToScrollTop(23, 40), 920)
assert.equal(indexToScrollTop(59, 40), 2360)

// scrollTopToIndex — 정확한 위치, 반올림 경계(정확히 절반 지점)
assert.equal(scrollTopToIndex(0, 40), 0)
assert.equal(scrollTopToIndex(19, 40), 0)
assert.equal(scrollTopToIndex(20, 40), 1) // JS Math.round(0.5)는 올림
assert.equal(scrollTopToIndex(920, 40), 23)
assert.equal(scrollTopToIndex(2360, 40), 59)

// clampIndex — 범위 밖 값 클램핑
assert.equal(clampIndex(-1, 24), 0)
assert.equal(clampIndex(24, 24), 23)
assert.equal(clampIndex(60, 60), 59)
assert.equal(clampIndex(5, 24), 5)

// wheelPadding
assert.equal(wheelPadding(40, 5), 80)
assert.equal(wheelPadding(40, 3), 40)

console.log('verify-time-wheel: all checks passed')
