import type { BreakdownValue } from '../../types'
import { formatPercentage } from '../../utils/formatters'

interface BreakdownTableProps {
  readonly title: string
  readonly rows: BreakdownValue[]
}

export function BreakdownTable({ rows, title }: BreakdownTableProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br from-white via-sky-50/60 to-fuchsia-50/70 p-5 shadow-[0_18px_42px_-30px_rgba(79,70,229,0.55)]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-base font-bold text-slate-900">{title}</h3>
        <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-bold text-slate-500 shadow-sm">
          {rows.length} groups
        </span>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-slate-500">
            <tr>
              <th className="rounded-l-xl bg-white/70 px-3 py-2 font-bold">Group</th>
              <th className="bg-white/70 px-3 py-2 font-bold">Total</th>
              <th className="bg-white/70 px-3 py-2 font-bold">Needs review</th>
              <th className="rounded-r-xl bg-white/70 px-3 py-2 font-bold">Rate</th>
            </tr>
          </thead>
          <tbody className="before:block before:h-2">
            {rows.map((row) => (
              <tr className="group border-b border-white/70 last:border-b-0" key={row.name}>
                <td className="rounded-l-xl px-3 py-3 font-semibold text-slate-800 transition-colors group-hover:bg-white/75">
                  {row.name}
                </td>
                <td className="px-3 py-3 font-mono font-bold text-slate-700 transition-colors group-hover:bg-white/75">
                  {row.total}
                </td>
                <td className="px-3 py-3 transition-colors group-hover:bg-white/75">
                  <span className="inline-flex min-w-9 items-center justify-center rounded-full bg-rose-100 px-2.5 py-1 font-mono text-xs font-bold text-rose-700 ring-1 ring-rose-200">
                    {row.smells}
                  </span>
                </td>
                <td className="rounded-r-xl px-3 py-3 transition-colors group-hover:bg-white/75">
                  <span className="inline-flex min-w-16 items-center justify-center rounded-full bg-white/80 px-2.5 py-1 font-mono text-xs font-bold text-brand-700 shadow-sm">
                    {formatPercentage(row.smellRate)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
