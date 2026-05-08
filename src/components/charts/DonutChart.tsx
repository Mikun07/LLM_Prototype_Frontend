import { forwardRef } from 'react'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

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

export const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>(
  ({ ariaLabel, data, title }, ref) => (
    <section
      aria-label={ariaLabel}
      className="rounded border border-border bg-white p-4"
      ref={ref}
    >
      <h3 className="font-display text-lg font-semibold text-brand-900">{title}</h3>
      <div className="mt-3 h-64">
        <ResponsiveContainer height="100%" width="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={54} nameKey="name" outerRadius={86}>
              {data.map((entry) => (
                <Cell fill={entry.color} key={entry.name} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  ),
)

DonutChart.displayName = 'DonutChart'

