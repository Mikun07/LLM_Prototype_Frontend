import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  icon?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border-brand-600 bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'border-border bg-white text-brand-900 hover:border-brand-500',
  ghost: 'border-transparent bg-transparent text-slate-700 hover:bg-slate-100',
  danger: 'border-smell bg-smell text-white hover:bg-red-700',
}

export function Button({
  children,
  className = '',
  disabled,
  icon,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex h-10 items-center justify-center gap-2 rounded border px-4 text-sm font-semibold transition',
        'disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
        variantClasses[variant],
        className,
      ].join(' ')}
      disabled={disabled}
      type={type}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}

