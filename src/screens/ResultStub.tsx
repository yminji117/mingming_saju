import { Link } from 'react-router-dom'
import { computeSaju } from '../lib/sajuPipeline'
import type { SajuFormInput } from '../lib/types'

type Props = {
  input: SajuFormInput
}

// Day 4에 실제 결과 화면(§5.3)으로 교체될 자리. 지금은 계산 파이프라인(Day3)이
// 정확히 도는지 확인하는 용도 — 입력값과 계산된 8글자를 함께 보여준다.
export function ResultStub({ input }: Props) {
  const computation = computeSaju(input)
  const { result, timeUnknown, dstApplied, localMeanTimeOffsetMinutes, solarDate } = computation

  return (
    <div className="flex min-h-dvh flex-col items-center gap-6 bg-[#1a1a1a] px-6 py-20 text-white">
      <h1 className="font-['Mona10'] text-[28px] font-bold">{input.nickname}의 만세력</h1>
      <p className="text-center text-[14px] text-[#b1b1b1]">
        Day 4에 이 자리에 실제 결과 화면이 들어갑니다. 지금은 Day3 계산 파이프라인 확인용이에요.
      </p>

      <div className="w-full max-w-[345px] rounded-[4px] bg-white p-4 text-black">
        <table className="w-full text-center text-[14px]">
          <thead>
            <tr className="text-[12px] text-[#666]">
              <th></th>
              <th>시주</th>
              <th>일주</th>
              <th>월주</th>
              <th>연주</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-[20px] font-bold">
              <td className="text-[12px] text-[#666]">간지</td>
              <td>{timeUnknown ? '?' : result.pillars.hour}</td>
              <td>{result.pillars.day}</td>
              <td>{result.pillars.month}</td>
              <td>{result.pillars.year}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="w-full max-w-[345px] rounded-[4px] bg-white p-4 text-[12px] text-black">
        <p>양력 변환: {solarDate.year}.{String(solarDate.month).padStart(2, '0')}.{String(solarDate.day).padStart(2, '0')}</p>
        <p>서머타임 보정: {timeUnknown ? '해당 없음(시간 미상)' : dstApplied ? '적용됨 (-1시간)' : '해당 없음'}</p>
        <p>
          진태양시 보정: {timeUnknown ? '해당 없음(시간 미상)' : `${localMeanTimeOffsetMinutes.toFixed(1)}분 (${input.city})`}
        </p>
        <p>시간 미상: {timeUnknown ? '예 — 시주 제외하고 계산' : '아니오'}</p>
      </div>

      <Link to="/" className="text-[14px] text-[#ec1e79] underline">
        입력 화면으로 돌아가기
      </Link>
    </div>
  )
}
