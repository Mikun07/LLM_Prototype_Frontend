import { forwardRef, useId } from 'react'
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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

interface AxisTickProps {
  readonly x?: number
  readonly y?: number
  readonly payload?: {
    readonly value?: string | number
  }
}

interface BarDatum {
  name: string
  smells?: number
  clean?: number
  value?: number
  claude?: number
  chatgpt?: number
}

interface BarChartProps {
  title: string
  ariaLabel: string
  data: BarDatum[]
  mode?: 'stacked' | 'grouped' | 'single'
  cleanLabel?: string
  singleLabel?: string
  smellsLabel?: string
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

function splitAxisLabel(value: string | number | undefined): string[] {
  const text = String(value ?? '')

  if (text.length <= 10) {
    return [text]
  }

  const words = text.split(/\s+/)

  if (words.length === 1) {
    return [text]
  }

  if (words.length === 2) {
    return words
  }

  const midpoint = Math.ceil(words.length / 2)

  return [words.slice(0, midpoint).join(' '), words.slice(midpoint).join(' ')]
}

function AxisTick({ payload, x = 0, y = 0 }: AxisTickProps) {
  const lines = splitAxisLabel(payload?.value)

  return (
    <g transform={`translate(${x},${y})`}>
      <text fill="#475569" fontSize={11} fontWeight={700} textAnchor="middle">
        {lines.map((line, index) => (
          <tspan dy={index === 0 ? 12 : 13} key={`${line}-${index}`} x={0}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  )
}

export const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  ({
    ariaLabel,
    cleanLabel = 'Clean',
    data,
    mode = 'single',
    singleLabel = 'Value',
    smellsLabel = 'Needs review',
    title,
  }, ref) => {
    const cleanGradientId = useId()
    const reviewGradientId = useId()
    const singleGradientId = useId()
    const claudeGradientId = useId()
    const chatgptGradientId = useId()

    return (
      <section
        aria-label={ariaLabel}
        className="relative overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br from-white via-sky-50/60 to-fuchsia-50/70 p-5 shadow-[0_18px_42px_-30px_rgba(79,70,229,0.55)]"
        ref={ref}
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-base font-bold text-slate-900">{title}</h3>
          <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-bold text-slate-500 shadow-sm">
            {data.length} groups
          </span>
        </div>
        <div className="mt-4 h-72">
          <ResponsiveContainer height="100%" width="100%">
            <RechartsBarChart data={data} margin={{ bottom: 8, left: -8, right: 8, top: 8 }}>
              <defs>
                <linearGradient id={cleanGradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
                <linearGradient id={reviewGradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
                <linearGradient id={singleGradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id={claudeGradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#5b5ce2" />
                </linearGradient>
                <linearGradient id={chatgptGradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#cbd5e1" strokeDasharray="4 8" strokeOpacity={0.65} vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="name"
                interval={0}
                height={54}
                tick={<AxisTick />}
                tickLine={false}
                tickMargin={8}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }} />
              <Legend
                iconSize={10}
                iconType="circle"
                wrapperStyle={{ color: '#475569', fontSize: 12, fontWeight: 700, paddingTop: 10 }}
              />
              {mode === 'single' ? (
                <Bar
                  animationDuration={700}
                  barSize={34}
                  dataKey="value"
                  fill={`url(#${singleGradientId})`}
                  name={singleLabel}
                  radius={[10, 10, 4, 4]}
                />
              ) : null}
              {mode === 'stacked' ? (
                <>
                  <Bar
                    animationDuration={700}
                    dataKey="clean"
                    fill={`url(#${cleanGradientId})`}
                    maxBarSize={40}
                    name={cleanLabel}
                    radius={[0, 0, 8, 8]}
                    stackId="result"
                  />
                  <Bar
                    animationDuration={700}
                    dataKey="smells"
                    fill={`url(#${reviewGradientId})`}
                    maxBarSize={40}
                    name={smellsLabel}
                    radius={[8, 8, 0, 0]}
                    stackId="result"
                  />
                </>
              ) : null}
              {mode === 'grouped' ? (
                <>
                  <Bar
                    animationDuration={700}
                    dataKey="claude"
                    fill={`url(#${claudeGradientId})`}
                    maxBarSize={34}
                    name="Claude"
                    radius={[10, 10, 4, 4]}
                  />
                  <Bar
                    animationDuration={700}
                    dataKey="chatgpt"
                    fill={`url(#${chatgptGradientId})`}
                    maxBarSize={34}
                    name="ChatGPT"
                    radius={[10, 10, 4, 4]}
                  />
                </>
              ) : null}
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </section>
    )
  },
)

BarChart.displayName = 'BarChart'
