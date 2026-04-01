type StatusTone = 'success' | 'warning' | 'danger' | 'info'

const toneClasses: Record<StatusTone, string> = {
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
  info: 'bg-secondary/15 text-secondary',
}

export function StatusBadge({
  label,
  tone = 'info',
}: {
  label: string
  tone?: StatusTone
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}
    >
      {label}
    </span>
  )
}
