import { Activity, BarChart3, FileText, Settings } from 'lucide-react'
import { useAppSelector } from './store/hooks'
import type { WizardStep } from './types'

const steps: { key: WizardStep; label: string; icon: typeof FileText }[] = [
  { key: 'upload', label: 'Upload', icon: FileText },
  { key: 'configure', label: 'Configure', icon: Settings },
  { key: 'run', label: 'Run', icon: Activity },
  { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
]

export function App() {
  const currentStep = useAppSelector((state) => state.wizard.step)

  return (
    <main className="min-h-screen bg-surface px-10 py-8 text-slate-950">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="border-b border-border pb-6">
          <p className="font-mono text-sm uppercase tracking-wide text-brand-600">
            ReqSmell Frontend
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-brand-900">
            Environment ready
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
            React, TypeScript, Vite, Redux Toolkit, Tailwind, Recharts, and
            client-side PDF tooling are wired for the requirements smell
            detection prototype.
          </p>
        </header>

        <nav
          aria-label="Wizard progress"
          className="grid grid-cols-4 gap-3"
        >
          {steps.map((step) => {
            const Icon = step.icon
            const isActive = step.key === currentStep

            return (
              <div
                key={step.key}
                className={[
                  'flex items-center gap-3 rounded border px-4 py-3',
                  isActive
                    ? 'border-brand-500 bg-brand-50 text-brand-900'
                    : 'border-border bg-white text-slate-600',
                ].join(' ')}
              >
                <Icon aria-hidden="true" className="h-5 w-5" />
                <span className="font-medium">{step.label}</span>
              </div>
            )
          })}
        </nav>

        <section className="grid grid-cols-3 gap-4">
          <div className="rounded border border-border bg-white p-5">
            <h2 className="font-display text-xl font-semibold text-brand-900">
              API boundary
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Backend traffic is centralized in src/api/client.ts with Vite
              proxying /api to localhost:8000.
            </p>
          </div>

          <div className="rounded border border-border bg-white p-5">
            <h2 className="font-display text-xl font-semibold text-brand-900">
              Redux state
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Wizard and analysis slices are in place for upload flow, run
              progress, reports, and errors.
            </p>
          </div>

          <div className="rounded border border-border bg-white p-5">
            <h2 className="font-display text-xl font-semibold text-brand-900">
              Quality gates
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Strict TypeScript, ESLint, Vitest, and production build scripts
              are available through npm.
            </p>
          </div>
        </section>
      </section>
    </main>
  )
}

