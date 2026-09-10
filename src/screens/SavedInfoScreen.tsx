import { PixelButton } from '../components/PixelButton'

type Props = {
  nickname: string
  onUseSaved: () => void
  onNewInput: () => void
}

// Figma 8:32 "Main_저장된 정보있을 경우" / PRD §5.2a
export function SavedInfoScreen({ nickname, onUseSaved, onNewInput }: Props) {
  return (
    <div className="flex min-h-dvh flex-col items-center bg-[#1a1a1a] px-6 pt-20 pb-[calc(40px+env(safe-area-inset-bottom))]">
      <div className="flex flex-col items-center gap-4">
        <span className="text-[40px]">💗</span>
        <h1 className="font-['Mona10'] text-[40px] font-bold tracking-[1.6px] text-white">나의 만세력</h1>
      </div>

      <p className="mt-6 text-center text-[16px] text-white">
        작성했던 '{nickname}'님 정보가 있습니다.
      </p>

      <div className="mt-20 flex w-full max-w-[345px] flex-col gap-10">
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
