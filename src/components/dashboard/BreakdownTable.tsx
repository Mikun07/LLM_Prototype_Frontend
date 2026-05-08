import type { BreakdownValue } from '../../types'
import { formatPercentage } from '../../utils/formatters'

interface BreakdownTableProps {
  readonly title: string
  readonly rows: BreakdownValue[]
}

export function BreakdownTable({ rows, title }: BreakdownTableProps) {
  return (
    <section className="rounded border border-border bg-white p-4">
      <h3 className="font-display text-lg font-semibold text-brand-900">{title}</h3>
      <table className="mt-3 w-full text-left text-sm">
        <thead className="text-xs uppercase text-slate-500">
          <tr>
            <th className="py-2">Group</th>
            <th className="py-2">Total</th>
            <th className="py-2">Smells</th>
            <th className="py-2">Rate</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className="border-t border-border" key={row.name}>
              <td className="py-2 font-medium text-slate-800">{row.name}</td>
              <td className="py-2 font-mono">{row.total}</td>
              <td className="py-2 font-mono text-smell">{row.smells}</td>
              <td className="py-2 font-mono">{formatPercentage(row.smellRate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

