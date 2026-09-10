type Option<T extends string> = { label: string; value: T }

type Props<T extends string> = {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
}

export function SegmentToggle<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div className="flex h-[44px] w-full overflow-hidden rounded-[4px] border-2 border-white">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 text-[16px] font-bold transition-colors ${
            value === opt.value ? 'bg-[#ec1e79] text-white' : 'bg-transparent text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
