import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const COLORS = {
  Food: '#6366f1',
  Utilities: '#22c55e',
  Entertainment: '#f59e0b',
  Health: '#ec4899',
  Transport: '#14b8a6',
  Shopping: '#f97316',
  Income: '#3b82f6',
  Education: '#a855f7',
}

export default function CategoryChart({ transactions, loading }) {
  const categoryData = transactions
    ? Object.entries(
        transactions
          .filter(t => Number(t.amount) < 0)
          .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + Math.abs(Number(t.amount))
            return acc
          }, {})
      ).map(([name, value]) => ({ name, value }))
    : []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-900">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <Skeleton className="h-64 rounded-lg" /> : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[entry.name] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`PKR ${value.toLocaleString()}`, 'Spent']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}