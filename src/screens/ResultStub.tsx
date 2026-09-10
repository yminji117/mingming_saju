import { Link } from 'react-router-dom'
import type { SajuFormInput } from '../lib/types'

type Props = {
  input: SajuFormInput
}

// Day 4에 실제 결과 화면(§5.3)으로 교체될 자리. 지금은 입력값이 잘 전달/저장됐는지 확인용.
export function ResultStub({ input }: Props) {
  return (
    <div className="flex min-h-dvh flex-col items-center gap-6 bg-[#1a1a1a] px-6 py-20 text-white">
      <h1 className="font-['Mona10'] text-[28px] font-bold">{input.nickname}의 만세력</h1>
      <p className="text-[14px] text-[#b1b1b1]">결과 화면은 Day 4에 만들 예정입니다. 지금은 입력값 확인용 화면이에요.</p>
      <pre className="w-full max-w-[345px] overflow-x-auto rounded-[4px] bg-white p-4 text-[12px] text-black">
        {JSON.stringify(input, null, 2)}
      </pre>
      <Link to="/" className="text-[14px] text-[#ec1e79] underline">
        입력 화면으로 돌아가기
      </Link>
    </div>
  )
}
