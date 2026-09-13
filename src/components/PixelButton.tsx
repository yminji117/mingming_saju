import type { ButtonHTMLAttributes } from 'react'
import buttonPrimary from '../assets/button-primary.svg'
import buttonSecondary from '../assets/button-secondary.svg'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

// Figma 2:19/8:54/8:60 — 실제 버튼 노치 에셋(button-primary.svg / button-secondary.svg) 그대로 사용
export function PixelButton({ variant = 'primary', className = '', children, ...props }: Props) {
  const asset = variant === 'primary' ? buttonPrimary : buttonSecondary

  return (
    <button
      className={`relative flex h-[62px] w-full items-center justify-center active:translate-y-[2px] ${className}`}
      {...props}
    >
      <span className="absolute inset-[-6.45%_-1.16%_-19.35%_-1.16%]">
        <img src={asset} alt="" className="block size-full" />
      </span>
      <span className="relative text-[18px] font-normal text-white">{children}</span>
    </button>
  )
}
