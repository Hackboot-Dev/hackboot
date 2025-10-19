import clsx from 'clsx'

const VARIANTS = {
  violet: {
    grid: '139, 92, 246',
    primary: 'bg-purple-500/20',
    secondary: 'bg-indigo-500/20',
  },
  amber: {
    grid: '245, 158, 11',
    primary: 'bg-amber-500/18',
    secondary: 'bg-pink-500/15',
  },
  aqua: {
    grid: '14, 165, 233',
    primary: 'bg-cyan-500/18',
    secondary: 'bg-emerald-500/18',
  },
  magenta: {
    grid: '236, 72, 153',
    primary: 'bg-fuchsia-500/18',
    secondary: 'bg-purple-500/18',
  },
} as const

type VariantKey = keyof typeof VARIANTS

type DesignBackdropProps = {
  variant?: VariantKey
  intensity?: 'soft' | 'strong'
  position?: 'fixed' | 'absolute'
  className?: string
}

export default function DesignBackdrop({
  variant = 'violet',
  intensity = 'soft',
  position = 'fixed',
  className,
}: DesignBackdropProps) {
  const selected = VARIANTS[variant] ?? VARIANTS.violet
  const opacity = intensity === 'strong' ? 0.1 : 0.05

  return (
    <div
      className={clsx(
        position === 'fixed' ? 'fixed inset-0' : 'absolute inset-0',
        'pointer-events-none -z-10 overflow-hidden',
        className,
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(${selected.grid}, ${opacity}) 1px, transparent 1px), linear-gradient(90deg, rgba(${selected.grid}, ${opacity}) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />
      <div
        className={clsx(
          'absolute top-1/4 -left-32 h-[28rem] w-[28rem] rounded-full blur-3xl animate-float',
          selected.primary,
        )}
      />
      <div
        className={clsx(
          'absolute bottom-20 -right-24 h-[28rem] w-[28rem] rounded-full blur-[120px] animate-float-delayed',
          selected.secondary,
        )}
      />
    </div>
  )
}
