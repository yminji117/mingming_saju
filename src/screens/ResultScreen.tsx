import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { PillarKey } from 'ssaju'
import { GlossaryTerm } from '../components/GlossaryTerm'
import { STEM_CHARACTER } from '../lib/characters'
import { CITIES } from '../lib/cities'
import { ELEMENT_COLOR, ELEMENT_ORDER, ELEMENT_PLAIN } from '../lib/elements'
import { SINSAL_GLOSSARY, TEN_GOD_GLOSSARY } from '../lib/glossary'
import { computeSaju } from '../lib/sajuPipeline'
import type { SajuFormInput } from '../lib/types'

type Props = {
  input: SajuFormInput
}

const PILLAR_ORDER: PillarKey[] = ['hour', 'day', 'month', 'year']
const PILLAR_LABEL: Record<PillarKey, string> = { hour: '시주', day: '일주', month: '월주', year: '연주' }

// PRD §5.3 결과 화면. AI 해석(§5.3 [6])과 면책(§5.3 [7])은 Day 5 이후 범위 — 여기서는 다루지 않는다.
export function ResultScreen({ input }: Props) {
  const [useLmt, setUseLmt] = useState(true)
  const computation = useMemo(() => computeSaju(input, { useLocalMeanTime: useLmt }), [input, useLmt])
  const { result, timeUnknown, dstApplied, localMeanTimeOffsetMinutes, solarDate } = computation
  const city = CITIES.find((c) => c.name === input.city) ?? CITIES[0]

  const dayDetail = result.pillarDetails.day
  const dayElementPlain = ELEMENT_PLAIN[dayDetail.element.stem]
  const characterImg = STEM_CHARACTER[dayDetail.stem]

  const timeLabel = timeUnknown
    ? '시간 미상'
    : `${input.ampm === 'AM' ? '오전' : '오후'} ${String(input.hour).padStart(2, '0')}:${String(input.minute).padStart(2, '0')}`

  const visiblePillars = PILLAR_ORDER.filter((key) => !(key === 'hour' && timeUnknown))

  // 오행 분포 요약 한 줄 (§5.3 [3])
  const elementSummary = useMemo(() => {
    const entries = ELEMENT_ORDER.map((el) => [el, result.fiveElements[el] ?? 0] as const)
    const max = Math.max(...entries.map(([, c]) => c))
    if (max === 0) return '오행이 골고루 퍼져 있어요'
    const most = entries.filter(([, c]) => c === max).map(([el]) => el)
    const zero = entries.filter(([, c]) => c === 0).map(([el]) => el)
    const zeroText = zero.length > 0 ? `${zero.join('·')}이 없어요` : '고루 갖춰져 있어요'
    return `${most.join('·')}이 많고, ${zeroText}`
  }, [result.fiveElements])

  // 신살 태그 — 중복 제거, 시간 미상이면 시주 제외
  const sinsalTags = useMemo(() => {
    const tags = new Set<string>()
    visiblePillars.forEach((key) => {
      tags.add(result.sals[key].twelveSal)
      result.sals[key].specialSals.forEach((s) => tags.add(s))
    })
    return Array.from(tags)
  }, [result.sals, visiblePillars])

  const maxElementCount = Math.max(1, ...ELEMENT_ORDER.map((el) => result.fiveElements[el] ?? 0))

  return (
    <div className="flex min-h-dvh flex-col items-center gap-8 bg-[#1a1a1a] px-4 pt-[48px] pb-[calc(80px+env(safe-area-inset-bottom))] text-white">
      {/* [1] 요약 헤더 */}
      <header className="flex w-full max-w-[345px] flex-col items-center gap-3 text-center">
        <h1 className="text-[28px] font-bold tracking-[1.4px]">{input.nickname}의 만세력</h1>
        <p className="text-[14px] text-[#b1b1b1]">
          {solarDate.year}.{String(solarDate.month).padStart(2, '0')}.{String(solarDate.day).padStart(2, '0')} (
          {input.calendarType === 'solar' ? '양' : '음'}) {timeLabel} · {input.gender} · {city.displayName}
        </p>

        <div className="flex items-center gap-3 rounded-[4px] bg-white/5 px-4 py-3">
          {characterImg ? (
            <img
              src={characterImg}
              alt=""
              className="h-[47px] w-[54px] object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
          ) : (
            <div
              className="flex h-[47px] w-[54px] shrink-0 items-center justify-center rounded-[4px] border-2 border-white/30 text-[22px] font-bold"
              style={{ color: ELEMENT_COLOR[dayDetail.element.stem] }}
            >
              {dayDetail.stem}
            </div>
          )}
          <p className="text-[14px]">
            당신을 상징하는 글자:{' '}
            <span className="font-bold" style={{ color: ELEMENT_COLOR[dayDetail.element.stem] }}>
              {dayDetail.stem}({dayDetail.stemKo})
            </span>{' '}
            — {dayElementPlain}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {!timeUnknown && useLmt && (
            <span className="rounded-[1000px] border border-white/30 px-3 py-1 text-[12px]">
              진태양시 {localMeanTimeOffsetMinutes.toFixed(1)}분 ({city.name})
            </span>
          )}
          {dstApplied && <span className="rounded-[1000px] border border-white/30 px-3 py-1 text-[12px]">서머타임 보정</span>}
          {timeUnknown && <span className="rounded-[1000px] border border-white/30 px-3 py-1 text-[12px]">시간 미상</span>}
        </div>

        {!timeUnknown && (
          <label className="flex min-h-[44px] items-center gap-2 text-[13px] text-[#b1b1b1]">
            <input
              type="checkbox"
              checked={useLmt}
              onChange={(e) => setUseLmt(e.target.checked)}
              className="size-[18px]"
            />
            진태양시 보정 적용
          </label>
        )}
      </header>

      {/* [2] 만세력 표 */}
      <section className="w-full max-w-[345px]">
        <table className="w-full table-fixed overflow-hidden rounded-[4px] bg-white text-center text-black">
          <thead>
            <tr className="text-[11px] text-[#666]">
              <th className="w-[47px]"></th>
              {PILLAR_ORDER.map((key) => (
                <th key={key} className={`py-2 ${key === 'day' ? 'bg-[#f31bc0]/15' : ''}`}>
                  {PILLAR_LABEL[key]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(['천간', '지지', '오행'] as const).map((rowLabel) => (
              <tr key={rowLabel}>
                <th className="text-[11px] text-[#666]">{rowLabel}</th>
                {PILLAR_ORDER.map((key) => {
                  const isHourUnknown = key === 'hour' && timeUnknown
                  const detail = result.pillarDetails[key]
                  return (
                    <td key={key} className={`py-2 ${key === 'day' ? 'bg-[#f31bc0]/15' : ''}`}>
                      {isHourUnknown ? (
                        <span className="text-[#ccc]">?</span>
                      ) : rowLabel === '천간' ? (
                        <div className="flex flex-col items-center">
                          <span className="text-[22px] font-bold" style={{ color: ELEMENT_COLOR[detail.element.stem] }}>
                            {detail.stem}
                          </span>
                          <span className="text-[11px] text-[#666]">({detail.stemKo})</span>
                        </div>
                      ) : rowLabel === '지지' ? (
                        <div className="flex flex-col items-center">
                          <span className="text-[22px] font-bold" style={{ color: ELEMENT_COLOR[detail.element.branch] }}>
                            {detail.branch}
                          </span>
                          <span className="text-[11px] text-[#666]">({detail.branchKo})</span>
                        </div>
                      ) : (
                        <span className="text-[12px] font-bold">
                          <span style={{ color: ELEMENT_COLOR[detail.element.stem] }}>{detail.element.stem}</span>/
                          <span style={{ color: ELEMENT_COLOR[detail.element.branch] }}>{detail.element.branch}</span>
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* [3] 오행 분포 */}
      <section className="flex w-full max-w-[345px] flex-col gap-3">
        <h2 className="text-[16px] font-bold">오행 분포</h2>
        <div className="flex items-end gap-2">
          {ELEMENT_ORDER.map((el) => {
            const count = result.fiveElements[el] ?? 0
            return (
              <div key={el} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex h-[68px] w-full items-end">
                  <div
                    className="w-full rounded-t-[2px]"
                    style={{
                      height: count > 0 ? `${(count / maxElementCount) * 100}%` : 0,
                      backgroundColor: ELEMENT_COLOR[el],
                    }}
                  />
                </div>
                <span className="text-[12px]">
                  {el} {count}
                </span>
              </div>
            )
          })}
        </div>
        <p className="text-[13px] text-[#b1b1b1]">{elementSummary}</p>
        {timeUnknown && <p className="text-[12px] text-[#888]">6글자 기준</p>}
      </section>

      {/* [4] 십신 */}
      <section className="flex w-full max-w-[345px] flex-col gap-1">
        <h2 className="text-[16px] font-bold">십신</h2>
        {visiblePillars.map((key) => {
          const gods = result.tenGods[key]
          return (
            <div key={key} className="flex flex-col">
              {gods.stem !== '(일간)' && (
                <GlossaryTerm term={`${PILLAR_LABEL[key]} 천간: ${gods.stem}`} description={TEN_GOD_GLOSSARY[gods.stem] ?? ''} />
              )}
              <GlossaryTerm term={`${PILLAR_LABEL[key]} 지지: ${gods.branch}`} description={TEN_GOD_GLOSSARY[gods.branch] ?? ''} />
            </div>
          )
        })}
      </section>

      {/* [5] 신살 */}
      {sinsalTags.length > 0 && (
        <section className="flex w-full max-w-[345px] flex-col gap-2">
          <h2 className="text-[16px] font-bold">신살</h2>
          <div className="flex flex-wrap gap-2">
            {sinsalTags.map((tag) => (
              <GlossaryTerm
                key={tag}
                term={tag}
                description={SINSAL_GLOSSARY[tag] ?? ''}
                className="min-w-[100px] rounded-[4px] bg-white/5 px-3"
              />
            ))}
          </div>
          <p className="text-[12px] text-[#888]">신살은 좋고 나쁨이 아니라 성향의 특징을 가리키는 이름표입니다</p>
        </section>
      )}

      {/* 안내 배너 3종 */}
      <section className="flex w-full max-w-[345px] flex-col gap-2 text-[12px] text-[#888]">
        <p>※ 연주는 1월 1일이 아니라 입춘(2월 초)을 기준으로 바뀌어요.</p>
        <p>※ 진태양시 보정 경계 시각 근처에서는 시주가 달라질 수 있어요.</p>
        {timeUnknown && <p>※ 시간을 몰라 시주 없이 계산했어요. 오행도 6글자(시주 제외) 기준입니다.</p>}
      </section>

      <Link to="/" className="text-[14px] text-[#ec1e79] underline">
        입력 화면으로 돌아가기
      </Link>
    </div>
  )
}
