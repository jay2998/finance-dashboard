import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function SpendingChart({ transactions, loading }) {
  const monthlyData = transactions
    ? Object.entries(
        transactions.reduce((acc, t) => {
          const parsed = new Date(t.date)
          if (isNaN(parsed)) return acc
          const month = parsed.toLocaleString('default', { month: 'short' })
          acc[month] = (acc[month] || 0) + Math.abs(Number(t.amount))
          return acc
        }, {})
      ).map(([month, spending]) => ({ month, spending }))
    : []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-900">Monthly Spending</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <Skeleton className="h-64 rounded-lg" /> : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                formatter={(value) => [`PKR ${value.toLocaleString()}`, 'Spending']}
              />
              <Line
                type="monotone"
                dataKey="spending"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ fill: '#6366f1', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}