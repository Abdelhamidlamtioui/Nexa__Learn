import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface Currency {
  name: string
  symbol: string
  balance: number
  icon: LucideIcon
  color: string
}

interface CurrencyBreakdownProps {
  currencies: Currency[]
}

export function CurrencyBreakdown({ currencies }: CurrencyBreakdownProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {currencies.map((currency) => (
        <Card key={currency.symbol} className={`bg-gradient-to-r ${currency.color} text-white`}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <currency.icon className="mr-2" />
              {currency.name} ({currency.symbol})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {currency.balance.toLocaleString()} {currency.symbol}
            </div>
            {currency.symbol === "TT" && (
              <div className="mt-2">
                <div>Monthly earning rate: +50 TT</div>
                <div>≈ ${(currency.balance * 0.1).toFixed(2)} USD</div>
              </div>
            )}
            {currency.symbol === "IC" && <div className="mt-2">Special feature access: Enabled</div>}
            {currency.symbol === "DC" && <div className="mt-2">Contribution rewards: Silver tier</div>}
            {currency.symbol === "CS" && <div className="mt-2">Engagement level: Rising Star</div>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

