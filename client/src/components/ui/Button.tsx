import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

function getButtonClasses(variant: ButtonVariant) {
  const base =
    'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

  switch (variant) {
    case 'primary':
      return `${base} bg-primary text-white shadow-ambient`
    case 'secondary':
      return `${base} border border-ghost bg-surface-high text-foreground`
    default:
      return `${base} text-muted`
  }
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  children: ReactNode
}

export function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button className={`${getButtonClasses(variant)} ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}

type ButtonLinkProps = LinkProps & {
  variant?: ButtonVariant
  children: ReactNode
  className?: string
}

export function ButtonLink({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={`${getButtonClasses(variant)} ${className}`.trim()} {...props}>
      {children}
    </Link>
  )
}
