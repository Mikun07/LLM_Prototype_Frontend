import { forwardRef, useId } from 'react'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface ChartTooltipPayload {
  readonly color?: string
  readonly name?: string
  readonly value?: number | string
}

interface ChartTooltipProps {
  readonly active?: boolean
  readonly label?: string | number
  readonly payload?: ChartTooltipPayload[]
}

interface DonutDatum {
  name: string
  value: number
  color: string
}

interface DonutChartProps {
  title: string
  ariaLabel: string
  data: DonutDatum[]
}

function ChartTooltip({ active, label, payload }: ChartTooltipProps) {
  if (active !== true || payload === undefined || payload.length === 0) {
    return null
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-xl shadow-slate-200/70 backdrop-blur">
      <p className="mb-1 font-bold text-slate-900">{label}</p>
      <div className="flex flex-col gap-1">
        {payload.map((item) => (
          <div className="flex items-center gap-2" key={`${item.name}-${item.value}`}>
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color ?? '#64748b' }}
            />
            <span className="text-slate-600">{item.name}</span>
            <span className="ml-auto font-mono font-bold text-slate-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function gradientStops(color: string): { end: string; start: string } {
  if (color.toLowerCase().includes('16a34a')) {
    return { start: '#5eead4', end: '#10b981' }
  }

  if (color.toLowerCase().includes('e11d48') || color.toLowerCase().includes('dc2626')) {
    return { start: '#fb7185', end: '#e11d48' }
  }

  if (color.toLowerCase().includes('3b5bdb') || color.toLowerCase().includes('3b82f6')) {
    return { start: '#a78bfa', end: '#4f46e5' }
  }

  if (color.toLowerCase().includes('d97706')) {
    return { start: '#fbbf24', end: '#f97316' }
  }

  return { start: color, end: color }
}

export const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>(
  ({ ariaLabel, data, title }, ref) => {
    const gradientBaseId = useId()
    const total = data.reduce((sum, item) => sum + item.value, 0)

    return (
      <section
        aria-label={ariaLabel}
        className="relative overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br from-white via-emerald-50/60 to-violet-50/70 p-5 shadow-[0_18px_42px_-30px_rgba(20,184,166,0.55)]"
        ref={ref}
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-base font-bold text-slate-900">{title}</h3>
          <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-bold text-slate-500 shadow-sm">
            {total} total
          </span>
        </div>
        <div className="mt-4 h-72">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <defs>
                {data.map((entry, index) => {
                  const stops = gradientStops(entry.color)
                  const gradientId = `${gradientBaseId}-${index}`

                  return (
                    <linearGradient id={gradientId} key={gradientId} x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor={stops.start} />
                      <stop offset="100%" stopColor={stops.end} />
                    </linearGradient>
                  )
                })}
              </defs>
              <Pie
                animationDuration={750}
                cornerRadius={8}
                data={data}
                dataKey="value"
                innerRadius={62}
                nameKey="name"
                outerRadius={94}
                paddingAngle={4}
                stroke="#ffffff"
                strokeWidth={4}
              >
                {data.map((entry, index) => (
                  <Cell fill={`url(#${gradientBaseId}-${index})`} key={entry.name} />
                ))}
              </Pie>
              <text
                dominantBaseline="middle"
                fill="#0f172a"
                fontSize={26}
                fontWeight={800}
                textAnchor="middle"
                x="50%"
                y="45%"
              >
                {total}
              </text>
              <text
                dominantBaseline="middle"
                fill="#64748b"
                fontSize={12}
                fontWeight={700}
                textAnchor="middle"
                x="50%"
                y="55%"
              >
                checks
              </text>
              <Tooltip content={<ChartTooltip />} />
              <Legend
                iconSize={10}
                iconType="circle"
                wrapperStyle={{ color: '#475569', fontSize: 12, fontWeight: 700, paddingTop: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    )
  },
)

DonutChart.displayName = 'DonutChart'
