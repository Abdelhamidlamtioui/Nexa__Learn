import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Award, BadgeIcon as Certificate } from "lucide-react"

const achievements = [
  {
    title: "Code Ninja",
    type: "Platform Badge",
    icon: Trophy,
    description: "Completed 100 coding challenges",
    rarity: "Rare",
  },
  {
    title: "Community Champion",
    type: "Special Reward",
    icon: Star,
    description: "Top contributor for 3 consecutive months",
    rarity: "Epic",
  },
  {
    title: "Full Stack Master",
    type: "Learning Milestone",
    icon: Award,
    description: "Completed the Full Stack Development path",
    xp: "5000 XP",
  },
  {
    title: "AI Specialist",
    type: "Certification Path",
    icon: Certificate,
    description: "Artificial Intelligence certification",
    progress: "2/5 modules completed",
  },
]

export function AchievementShowcase() {
  return (
    <section>
      <h2 className="text-3xl font-bold text-white mb-6">Achievement Showcase</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((achievement, index) => (
          <Card key={index} className="bg-white bg-opacity-10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <achievement.icon className="w-6 h-6" />
                <span>{achievement.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="mb-2">
                {achievement.type}
              </Badge>
              <p className="text-sm mb-2">{achievement.description}</p>
              {achievement.rarity && <p className="text-yellow-400">Rarity: {achievement.rarity}</p>}
              {achievement.xp && <p className="text-green-400">{achievement.xp}</p>}
              {achievement.progress && <p>{achievement.progress}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

