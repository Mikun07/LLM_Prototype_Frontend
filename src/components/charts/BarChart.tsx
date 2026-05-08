import { forwardRef } from 'react'
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
}

export const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  ({ ariaLabel, data, mode = 'single', title }, ref) => (
    <section
      aria-label={ariaLabel}
      className="rounded border border-border bg-white p-4"
      ref={ref}
    >
      <h3 className="font-display text-lg font-semibold text-brand-900">{title}</h3>
      <div className="mt-3 h-64">
        <ResponsiveContainer height="100%" width="100%">
          <RechartsBarChart data={data}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            {mode === 'single' ? <Bar dataKey="value" fill="#3b5bdb" name="Value" /> : null}
            {mode === 'stacked' ? (
              <>
                <Bar dataKey="clean" fill="#16a34a" name="Clean" stackId="result" />
                <Bar dataKey="smells" fill="#dc2626" name="Smells" stackId="result" />
              </>
            ) : null}
            {mode === 'grouped' ? (
              <>
                <Bar dataKey="claude" fill="#3b5bdb" name="Claude" />
                <Bar dataKey="chatgpt" fill="#d97706" name="ChatGPT" />
              </>
            ) : null}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </section>
  ),
)

BarChart.displayName = 'BarChart'

