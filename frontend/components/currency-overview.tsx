import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CurrencyOverviewProps {
  totalBalance: number
}

export function CurrencyOverview({ totalBalance }: CurrencyOverviewProps) {
  const usdEquivalent = totalBalance * 0.1 // Assuming 1 TT = $0.10 USD

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <CardHeader>
        <CardTitle>Total Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{totalBalance.toLocaleString()} TT</div>
        <div className="text-lg mt-2">≈ ${usdEquivalent.toFixed(2)} USD</div>
      </CardContent>
    </Card>
  )
}

