import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function StatCard({ title, value, change, icon: Icon, color }) {
  const isPositive = change >= 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={16} className="text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <Badge
          className={`mt-1 ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          variant="secondary"
        >
          {isPositive ? '▲' : '▼'} {Math.abs(change)}% vs last month
        </Badge>
      </CardContent>
    </Card>
  )
}