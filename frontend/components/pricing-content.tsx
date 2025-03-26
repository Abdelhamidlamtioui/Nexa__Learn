import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const pricingPlans = [
  {
    title: "Basic",
    price: "Free",
    features: [
      "Access to basic courses",
      "Community forum participation",
      "Weekly coding challenges",
      "100 Tech Tokens (TT) welcome bonus",
    ],
    cta: "Get Started",
  },
  {
    title: "Pro",
    price: "$19.99/month",
    features: [
      "All Basic features",
      "Access to a curated selection of premium courses",
      "Priority support",
      "Monthly webinars with industry experts",
      "500 Tech Tokens (TT) monthly",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    title: "Enterprise",
    price: "Custom",
    features: [
      "All Pro features",
      "Custom learning paths",
      "Dedicated account manager",
      "Team collaboration tools",
      "1000 Tech Tokens (TT) monthly",
    ],
    cta: "Contact Sales",
  },
]

export function PricingContent() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {pricingPlans.map((plan, index) => (
        <Card key={index} className={`relative ${plan.popular ? "border-pink-500" : ""}`}>
          {plan.popular && <Badge className="absolute top-0 right-0 m-4 bg-pink-500">Most Popular</Badge>}
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{plan.title}</CardTitle>
            <p className="text-3xl font-bold">{plan.price}</p>
          </CardHeader>
          <CardContent>
            <ul className="mb-6 space-y-2">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="w-full">{plan.cta}</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

