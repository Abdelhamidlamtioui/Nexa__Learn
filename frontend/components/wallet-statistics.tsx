import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const earningData = [
  { name: "Jan", amount: 400 },
  { name: "Feb", amount: 300 },
  { name: "Mar", amount: 200 },
  { name: "Apr", amount: 278 },
  { name: "May", amount: 189 },
  { name: "Jun", amount: 239 },
]

const recentTransactions = [
  { id: 1, type: "Earned", amount: 50, currency: "TT", date: "2023-07-15" },
  { id: 2, type: "Spent", amount: 20, currency: "IC", date: "2023-07-14" },
  { id: 3, type: "Received", amount: 100, currency: "DC", date: "2023-07-13" },
]

export function WalletStatistics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Earning Velocity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            Chart placeholder - Recharts not supported
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentTransactions.map((transaction) => (
              <li key={transaction.id} className="flex justify-between items-center">
                <span>
                  {transaction.type} {transaction.amount} {transaction.currency}
                </span>
                <span className="text-sm text-gray-500">{transaction.date}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

