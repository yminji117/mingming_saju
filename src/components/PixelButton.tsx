import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

// ponytail: Figma는 버튼 테두리가 톱니 모양(SVG Union) — 여기선 하드 오프셋 그림자로
// 근사했다. 픽셀 노치 모양이 꼭 필요해지면 그때 SVG 에셋으로 교체.
export function PixelButton({ variant = 'primary', className = '', ...props }: Props) {
  const base =
    'w-full h-[62px] rounded-[4px] font-bold text-[20px] tracking-[1px] transition-transform duration-100 active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-40 disabled:pointer-events-none'
  const variantClass =
    variant === 'primary'
      ? 'bg-[#ec1e79] text-white shadow-[4px_4px_0_0_#000] active:shadow-[2px_2px_0_0_#000]'
      : 'bg-black text-white border-2 border-white shadow-[4px_4px_0_0_#000] active:shadow-[2px_2px_0_0_#000]'

  return <button className={`${base} ${variantClass} ${className}`} {...props} />
}
