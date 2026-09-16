import gapTree from '../assets/characters/gap-tree.png'
import eulSprout from '../assets/characters/eul-sprout.png'
import byeongSun from '../assets/characters/byeong-sun.png'
import jeongCandle from '../assets/characters/jeong-candle.png'
import muMountain from '../assets/characters/mu-mountain.png'
import giField from '../assets/characters/gi-field.png'
import imWave from '../assets/characters/im-wave.png'
import gyeRaincloud from '../assets/characters/gye-raincloud.png'

// skill/pixel-design-skill.md §6 — 천간 10개 중 8개만 에셋 존재 (경금·신금은 미제작)
export const STEM_CHARACTER: Record<string, string | null> = {
  甲: gapTree,
  乙: eulSprout,
  丙: byeongSun,
  丁: jeongCandle,
  戊: muMountain,
  己: giField,
  庚: null,
  辛: null,
  壬: imWave,
  癸: gyeRaincloud,
}
