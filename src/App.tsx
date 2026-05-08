import { DashboardStep } from './components/steps/DashboardStep'
import { ConfigureStep } from './components/steps/ConfigureStep'
import { RunStep } from './components/steps/RunStep'
import { UploadStep } from './components/steps/UploadStep'
import { WizardStepper } from './components/shared/WizardStepper'
import { useAppSelector } from './store/hooks'

export function App() {
  const currentStep = useAppSelector((state) => state.wizard.step)

  return (
    <main className="min-h-screen bg-surface px-10 py-8 text-slate-950">
      <section className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="flex items-end justify-between border-b border-border pb-6">
          <div>
            <p className="font-mono text-sm uppercase tracking-wide text-brand-600">
              ReqSmell
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-brand-900">
              Requirements smell analysis
            </h1>
          </div>
          <div className="rounded border border-border bg-white px-4 py-3 text-right">
            <p className="text-sm text-slate-500">Version</p>
            <p className="font-mono text-lg font-semibold text-brand-900">2.2.0</p>
          </div>
        </header>

        <WizardStepper currentStep={currentStep} />

        {currentStep === 'upload' ? <UploadStep /> : null}
        {currentStep === 'configure' ? <ConfigureStep /> : null}
        {currentStep === 'run' ? <RunStep /> : null}
        {currentStep === 'dashboard' ? <DashboardStep /> : null}
      </section>
    </main>
  )
}
