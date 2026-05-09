import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from 'lucide-react'
import { useEffect, type ComponentType } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  dismissToast,
  type ToastMessage,
  type ToastTone,
} from '../../store/slices/toastSlice'

const toastDurationMs = 7000

interface ToneStyle {
  Icon: ComponentType<{ className?: string }>
  border: string
  icon: string
  iconBackground: string
  title: string
}

const toneStyles: Record<ToastTone, ToneStyle> = {
  error: {
    Icon: XCircle,
    border: 'border-smell-border',
    icon: 'text-smell',
    iconBackground: 'bg-smell-light',
    title: 'text-red-950',
  },
  info: {
    Icon: Info,
    border: 'border-brand-200',
    icon: 'text-brand-600',
    iconBackground: 'bg-brand-50',
    title: 'text-brand-950',
  },
  success: {
    Icon: CheckCircle2,
    border: 'border-clean-border',
    icon: 'text-clean',
    iconBackground: 'bg-clean-light',
    title: 'text-emerald-950',
  },
  warning: {
    Icon: AlertTriangle,
    border: 'border-warn-border',
    icon: 'text-warn',
    iconBackground: 'bg-warn-light',
    title: 'text-amber-950',
  },
}

function ToastCard({ toast }: { toast: ToastMessage }) {
  const dispatch = useAppDispatch()
  const style = toneStyles[toast.tone]
  const liveMode = toast.tone === 'error' ? 'assertive' : 'polite'

  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      dispatch(dismissToast(toast.id))
    }, toastDurationMs)

    return () => {
      globalThis.clearTimeout(timer)
    }
  }, [dispatch, toast.id])

  return (
    <article
      aria-live={liveMode}
      className={[
        'pointer-events-auto flex min-h-20 gap-3 rounded-lg border bg-white p-4 shadow-xl shadow-slate-900/10',
        style.border,
      ].join(' ')}
      role={toast.tone === 'error' ? 'alert' : 'status'}
    >
      <span
        className={[
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
          style.iconBackground,
        ].join(' ')}
      >
        <style.Icon aria-hidden="true" className={['h-5 w-5', style.icon].join(' ')} />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className={['text-sm font-bold', style.title].join(' ')}>{toast.title}</h2>
        <p className="mt-1 text-sm leading-5 text-slate-700">{toast.message}</p>
      </div>
      <button
        aria-label="Dismiss alert"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        onClick={() => dispatch(dismissToast(toast.id))}
        type="button"
      >
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </article>
  )
}

export function ToastViewport() {
  const toasts = useAppSelector((state) => state.toast.items)

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3 sm:right-6 sm:top-6">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
