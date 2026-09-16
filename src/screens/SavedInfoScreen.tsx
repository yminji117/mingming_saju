import { useState } from 'react'
import heart from '../assets/heart.png'
import { PixelButton } from '../components/PixelButton'

type Props = {
  nickname: string
  onUseSaved: () => void
  onNewInput: () => void
  onDelete: () => void
}

// Figma 8:32 "Main_저장된 정보있을 경우" / PRD §5.2a
export function SavedInfoScreen({ nickname, onUseSaved, onNewInput, onDelete }: Props) {
  const [showDeletePopup, setShowDeletePopup] = useState(false)

  return (
    <div className="flex min-h-dvh flex-col items-center gap-[60px] bg-[#1a1a1a] px-4 pt-[60px] pb-[calc(160px+env(safe-area-inset-bottom))]">
      <div className="flex flex-col items-center gap-4">
        <img src={heart} alt="" className="h-16 w-[69px] object-cover" />
        <h1 className="text-[40px] font-bold tracking-[1.6px] text-white">나의 만세력</h1>
      </div>

      <div className="flex w-full flex-1 flex-col items-center gap-6">
        <div className="flex h-[51px] w-full items-center justify-center">
          <p className="font-['Pretendard'] text-[16px] text-white">
            <span className="font-bold text-[#f31bc0]">[{nickname}]</span>님의 정보가 있습니다.
          </p>
        </div>

        <div className="flex w-full flex-1 flex-col items-center justify-between">
          <div className="flex w-full max-w-[345px] flex-col gap-10">
            <PixelButton variant="primary" onClick={onUseSaved}>
              작성했던 정보로 확인
            </PixelButton>
            <PixelButton variant="secondary" onClick={onNewInput}>
              새로운 정보 입력
            </PixelButton>
          </div>

          <button
            type="button"
            onClick={() => setShowDeletePopup(true)}
            className="min-h-[44px] py-1 font-['Pretendard'] text-[14px] text-[#aeaeae]"
          >
            작성했던 정보 삭제
          </button>
        </div>
      </div>

      {showDeletePopup && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 px-6">
          <div className="flex w-full max-w-[310px] flex-col items-center gap-[27px] rounded-[10px] bg-white px-10 py-9">
            <p className="text-center font-['Pretendard'] text-[16px] font-medium leading-[24px] text-[#0a0a0a]">
              저장된 정보를 삭제하시겠습니까?
            </p>
            <div className="flex w-full gap-[10px]">
              <button
                type="button"
                onClick={() => setShowDeletePopup(false)}
                className="min-h-[44px] flex-1 rounded-[4px] border border-[#d2d5db] bg-white font-['Pretendard'] text-[16px] text-[#0a0a0a]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeletePopup(false)
                  onDelete()
                }}
                className="min-h-[44px] flex-1 rounded-[4px] border border-[#013dff] bg-[#0a0a0a] font-['Pretendard'] text-[16px] text-white"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
