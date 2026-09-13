import heart from '../assets/heart.png'
import { PixelButton } from '../components/PixelButton'

type Props = {
  nickname: string
  onUseSaved: () => void
  onNewInput: () => void
}

// Figma 8:32 "Main_저장된 정보있을 경우" / PRD §5.2a
export function SavedInfoScreen({ nickname, onUseSaved, onNewInput }: Props) {
  return (
    <div className="flex min-h-dvh flex-col items-center gap-20 bg-[#1a1a1a] px-6 pt-20 pb-[calc(160px+env(safe-area-inset-bottom))]">
      <div className="flex w-full flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-4">
          <img src={heart} alt="" className="h-16 w-[69px] object-cover" />
          <h1 className="text-[40px] font-bold tracking-[1.6px] text-white">나의 만세력</h1>
        </div>
        <p className="font-['Pretendard'] text-[16px] text-white">
          작성했던 <span className="font-bold text-[#f31bc0]">[{nickname}]</span>님의 정보가 있습니다.
        </p>
      </div>

      <div className="flex w-full max-w-[345px] flex-col gap-10">
        <PixelButton variant="primary" onClick={onUseSaved}>
          작성했던 정보로 확인
        </PixelButton>
        <PixelButton variant="secondary" onClick={onNewInput}>
          새로운 정보 입력
        </PixelButton>
      </div>
    </div>
  )
}
