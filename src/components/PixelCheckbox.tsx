import type { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

// pixel-design-skill.md §4 체크박스 스펙 — 20x20, border-2 black, inset shadow
export function PixelCheckbox({ label, className = '', id, ...props }: Props) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-[44px] w-full cursor-pointer items-center gap-2"
    >
      <span className="relative flex size-[20px] shrink-0 items-center justify-center rounded-[2px] border-2 border-black bg-white shadow-[inset_0_2px_0_0_rgba(0,0,0,0.4)]">
        <input
          id={id}
          type="checkbox"
          className="peer absolute inset-0 size-full cursor-pointer appearance-none"
          {...props}
        />
        <svg
          viewBox="0 0 16 16"
          className="pointer-events-none hidden size-[14px] peer-checked:block"
          aria-hidden="true"
        >
          <path d="M2 8l4 4 8-8" stroke="black" strokeWidth="2.5" fill="none" />
        </svg>
      </span>
      <span className={`text-[16px] text-white ${className}`}>{label}</span>
    </label>
  )
}
