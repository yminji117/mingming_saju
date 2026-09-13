import type { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

// Figma 11:90/3:55 — 20x20 박스. 체크 아이콘은 Figma 에셋 대신 직접 그려서
// 박스 중앙에 맞추고 두께를 조절할 수 있게 했다 (에셋 위치가 안 맞고 너무 얇았음).
export function PixelCheckbox({ label, className = '', id, checked, ...props }: Props) {
  return (
    <label htmlFor={id} className="flex h-[20px] flex-1 cursor-pointer items-center gap-2">
      <span className="relative flex size-[20px] shrink-0 items-center justify-center rounded-[2px] border-2 border-black bg-white">
        <input id={id} type="checkbox" checked={checked} className="peer absolute inset-0 size-full cursor-pointer appearance-none" {...props} />
        {checked && (
          <svg viewBox="0 0 20 20" className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
            <path
              d="M4 10.5L8 14.5L16 5.5"
              fill="none"
              stroke="#f31bc0"
              strokeWidth="3.5"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </svg>
        )}
        <span className="pointer-events-none absolute -inset-[2px] rounded-[inherit] shadow-[inset_0_2px_0_0_rgba(0,0,0,0.4)]" />
      </span>
      <span className={`text-[16px] text-white ${className}`}>{label}</span>
    </label>
  )
}
