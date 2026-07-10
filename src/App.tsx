import { DashboardStep } from './components/steps/DashboardStep'
import { ConfigureStep } from './components/steps/ConfigureStep'
import { RunStep } from './components/steps/RunStep'
import { UploadStep } from './components/steps/UploadStep'
import { ReqSmellLogo } from './components/shared/ReqSmellLogo'
import { ToastViewport } from './components/shared/ToastViewport'
import { WizardStepper } from './components/shared/WizardStepper'
import { useAppSelector } from './store/hooks'

export function App() {
  const currentStep = useAppSelector((state) => state.wizard.step)

  return (
    <main className="min-h-screen bg-gradient-surface px-4 py-6 text-slate-950 sm:px-6 md:px-10 md:py-8">
      <ToastViewport />
      <section className="mx-auto flex max-w-7xl flex-col gap-6 md:gap-8">
        <header className="relative overflow-hidden rounded-2xl bg-gradient-brand p-6 text-white shadow-lg md:p-8">
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <ReqSmellLogo />
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-right backdrop-blur-sm">
              <p className="text-xs text-indigo-200">Powered by</p>
              <p className="font-mono text-sm font-bold text-white">Claude &amp; ChatGPT</p>
            </div>
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
