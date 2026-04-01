import type { HTMLAttributes, ReactNode } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-ghost bg-surface-high p-6 shadow-ambient ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}
