import { TrendingUp, TrendingDown, Wallet, BadgePoundSterling } from 'lucide-react'
import StatCard from '@/components/StatCard'
import SpendingChart from '@/components/charts/SpendingChart'
import CategoryChart from '@/components/charts/CategoryChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useApi } from '@/lib/useApi'
import { fetchTransactions } from '@/lib/api'

export default function Dashboard() {
  const { data: transactions, loading, error } = useApi(fetchTransactions)

  const recent = transactions ? transactions.slice(0, 5) : []

  const totalIncome = transactions
    ? transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + Number(t.amount), 0)
    : 0

  const totalExpenses = transactions
    ? transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
    : 0

  const balance = totalIncome - totalExpenses

  const stats = [
    { title: 'Total Balance', value: balance, icon: Wallet, color: 'bg-indigo-500', change: 12 },
    { title: 'Monthly Income', value: totalIncome, icon: TrendingUp, color: 'bg-green-500', change: 8 },
    { title: 'Monthly Expenses', value: totalExpenses, icon: TrendingDown, color: 'bg-red-500', change: -3 },
    { title: 'Total Saved', value: balance * 0.8, icon: BadgePoundSterling, color: 'bg-amber-500', change: 5 },
  ]

  if (error) return <p className="text-red-500">Error: {error}</p>

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-slate-900">Dashboard</h1>

      {/* Stat cards - 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        {loading
          ? Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-28 md:h-32 rounded-xl" />
            ))
          : stats.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={`PKR ${Math.round(stat.value).toLocaleString()}`}
                change={stat.change}
                icon={stat.icon}
                color={stat.color}
              />
            ))
        }
      </div>

      {/* Charts - stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SpendingChart transactions={transactions} loading={loading} />
        <CategoryChart transactions={transactions} loading={loading} />
      </div>

      {/* Recent transactions */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <div className="min-w-0 flex-1 mr-2">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{t.description}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{t.date}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="text-xs hidden sm:inline-flex">{t.category}</Badge>
                    <span className={`text-sm font-semibold ${Number(t.amount) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {Number(t.amount) > 0 ? '+' : '-'}PKR {Math.abs(Number(t.amount)).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}