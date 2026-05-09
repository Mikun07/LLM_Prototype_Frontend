import { Info } from 'lucide-react'

interface MetadataGuideProps {
  readonly location: 'upload' | 'dashboard'
}

const descriptions = [
  {
    name: 'Domain',
    text: 'The part of the system the requirement belongs to, such as Orders, Security, Accounts, or Reporting.',
  },
  {
    name: 'Type',
    text: 'The requirement category. FR means functional requirement. NFR means non-functional requirement, such as security, usability, backup, or performance.',
  },
  {
    name: 'Project',
    text: 'The project, module, or dataset group the requirement came from. This helps separate results when one file contains work from different sources.',
  },
]

export function MetadataGuide({ location }: MetadataGuideProps) {
  const summary =
    location === 'upload'
      ? 'These columns are optional, but they make the analysis easier to filter and understand.'
      : 'These fields help explain where each result belongs in the report.'

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br from-white via-sky-50/60 to-fuchsia-50/70 p-5 shadow-[0_18px_42px_-30px_rgba(79,70,229,0.55)]">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/85 text-brand-700 shadow-sm">
          <Info aria-hidden="true" className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-display text-base font-bold text-slate-900">
            What domain, type, and project mean
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{summary}</p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {descriptions.map((item) => (
          <div className="rounded-xl border border-white/70 bg-white/70 p-3 shadow-sm" key={item.name}>
            <dt className="text-sm font-bold text-slate-900">{item.name}</dt>
            <dd className="mt-1 text-sm leading-6 text-slate-600">{item.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
