import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Award, Zap, Calendar } from "lucide-react"

const highlights = [
  {
    title: "How to optimize React performance?",
    type: "Featured Discussion",
    icon: MessageSquare,
    engagement: "50 replies",
    author: "reactninja",
  },
  {
    title: "Building a Serverless API",
    type: "Top Rated Content",
    icon: Award,
    engagement: "4.9 ★ (200 ratings)",
    author: "cloudguru",
  },
  {
    title: "30-Day Coding Challenge",
    type: "Active Challenge",
    icon: Zap,
    engagement: "500 participants",
    deadline: "15 days left",
  },
  {
    title: "AI in Web Development Hackathon",
    type: "Upcoming Event",
    icon: Calendar,
    date: "July 15-17, 2023",
    registration: "Open",
  },
]

export function CommunityHighlights() {
  return (
    <section>
      <h2 className="text-3xl font-bold text-white mb-6">Community Highlights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {highlights.map((highlight, index) => (
          <Card key={index} className="bg-white bg-opacity-10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <highlight.icon className="w-6 h-6" />
                <span>{highlight.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="mb-2">
                {highlight.type}
              </Badge>
              <p>{highlight.engagement}</p>
              {highlight.author && <p>By: {highlight.author}</p>}
              {highlight.deadline && <p className="text-yellow-400">{highlight.deadline}</p>}
              {highlight.date && <p>{highlight.date}</p>}
              {highlight.registration && <p className="text-green-400">Registration: {highlight.registration}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

