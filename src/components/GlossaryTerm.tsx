import { useState } from 'react'

type Props = {
  term: string
  description: string
  className?: string
}

// PRD §5.3 [4][5] — hover 아님, 탭으로만 펼침/접힘. 탭 영역 44px 이상.
export function GlossaryTerm({ term, description, className = '' }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-[44px] w-full items-center justify-between gap-2 text-left text-[14px] text-white"
      >
        <span>{term}</span>
        <span className="text-[12px] text-[#b1b1b1]">{open ? '접기' : '설명'}</span>
      </button>
      {open && <p className="pb-2 text-[13px] leading-[1.5] text-[#b1b1b1]">{description}</p>}
    </div>
  )
}
