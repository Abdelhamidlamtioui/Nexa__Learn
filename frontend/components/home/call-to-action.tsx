import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CallToAction() {
  return (
    <section>
      <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="text-3xl">Join Our Learning Community</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Start your journey to tech excellence today and unlock a world of opportunities!</p>
          <ul className="list-disc list-inside mb-6">
            <li>Access to premium courses and resources</li>
            <li>Connect with industry experts and peers</li>
            <li>Earn rewards and build your portfolio</li>
            <li>Stay updated with the latest tech trends</li>
          </ul>
          <p className="mb-4">Join over 100,000 learners who have already started their journey!</p>
          <Button size="lg" className="w-full md:w-auto">
            Get Started Now
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}

