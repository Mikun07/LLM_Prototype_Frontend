import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  icon?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-gradient-brand text-white shadow-sm shadow-brand-200 hover:opacity-90 hover:shadow-md',
  secondary: 'border-brand-200 bg-white text-brand-700 hover:bg-brand-50 hover:border-brand-400',
  ghost: 'border-transparent bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  danger: 'border-transparent bg-gradient-warm text-white shadow-sm hover:opacity-90',
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
        'inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-all duration-150',
        'disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none',
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

