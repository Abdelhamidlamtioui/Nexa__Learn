import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Book, Video, Code, Users } from "lucide-react"

const resources = [
  {
    title: "React Hooks Deep Dive",
    type: "Documentation",
    icon: Book,
    engagement: "5k views",
    reward: "50 XP",
  },
  {
    title: "Building Scalable APIs with Node.js",
    type: "Tutorial",
    icon: Video,
    engagement: "10k views",
    reward: "100 XP",
  },
  {
    title: "Community Project: Open Source CMS",
    type: "Project",
    icon: Code,
    engagement: "500 contributors",
    reward: "200 XP",
  },
  {
    title: "Machine Learning Fundamentals eBook",
    type: "Learning Material",
    icon: Book,
    engagement: "2k downloads",
    reward: "150 XP",
  },
]

export function ResourcesSection() {
  return (
    <section>
      <h2 className="text-3xl font-bold text-white mb-6">Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {resources.map((resource, index) => (
          <Card key={index} className="bg-white bg-opacity-10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <resource.icon className="w-6 h-6" />
                <span>{resource.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">{resource.type}</Badge>
              <p className="mt-2">{resource.engagement}</p>
              <p className="font-bold mt-2">Reward: {resource.reward}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

