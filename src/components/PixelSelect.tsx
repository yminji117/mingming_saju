import type { SelectHTMLAttributes } from 'react'

// 네이티브 <select> 그대로 사용 (PRD §5.2 — 커스텀 드롭다운 금지). Bezel 안에 넣어 쓴다.
export function PixelSelect({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`h-full w-full appearance-none bg-transparent text-[16px] text-black focus:outline-none ${className}`}
      {...props}
    />
  )
}
