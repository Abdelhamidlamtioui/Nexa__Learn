import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const learningPaths = [
  {
    title: "Full-Stack Web Development",
    difficulty: "Intermediate",
    estimatedTime: "6 months",
    enrolledStudents: 15000,
    completionRate: 75,
    techStack: ["React", "Node.js", "MongoDB"],
    xpReward: 5000,
  },
  {
    title: "Machine Learning Fundamentals",
    difficulty: "Advanced",
    estimatedTime: "4 months",
    enrolledStudents: 12000,
    completionRate: 60,
    techStack: ["Python", "TensorFlow", "Scikit-learn"],
    xpReward: 4000,
  },
  {
    title: "Mobile App Development",
    difficulty: "Intermediate",
    estimatedTime: "5 months",
    enrolledStudents: 10000,
    completionRate: 70,
    techStack: ["React Native", "Firebase", "Redux"],
    xpReward: 4500,
  },
  {
    title: "Cloud Computing & DevOps",
    difficulty: "Advanced",
    estimatedTime: "6 months",
    enrolledStudents: 8000,
    completionRate: 55,
    techStack: ["AWS", "Docker", "Kubernetes"],
    xpReward: 5500,
  },
]

export function FeaturedLearningPaths() {
  return (
    <section>
      <h2 className="text-3xl font-bold text-white mb-6">Featured Learning Paths</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {learningPaths.map((path, index) => (
          <Card key={index} className="bg-white bg-opacity-10 text-white">
            <CardHeader>
              <CardTitle>{path.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Badge variant="secondary">{path.difficulty}</Badge>
                  <span>{path.estimatedTime}</span>
                </div>
                <p>{path.enrolledStudents.toLocaleString()} students enrolled</p>
                <div>
                  <Progress value={path.completionRate} className="h-2" />
                  <p className="text-sm text-right">{path.completionRate}% completion rate</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {path.techStack.map((tech, i) => (
                    <Badge key={i} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <p className="font-bold">Reward: {path.xpReward} XP</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

