import type { HTMLAttributes } from 'react'

// pixel-design-skill.md §4 입력창 스펙 — 흰 배경 + 눌린 느낌의 inset 베젤
export function Bezel({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`relative flex items-center rounded-[4px] bg-white shadow-[inset_0_3px_0_0_rgba(0,0,0,0.4)] ${className}`}
      {...props}
    />
  )
}
