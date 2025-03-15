import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function LearningPathIntegration() {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Learning Paths</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white bg-opacity-10 text-white">
          <CardHeader>
            <CardTitle>Full-Stack Web Development</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Master the art of building complete web applications from front to back.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">HTML/CSS</Badge>
              <Badge variant="secondary">JavaScript</Badge>
              <Badge variant="secondary">React</Badge>
              <Badge variant="secondary">Node.js</Badge>
              <Badge variant="secondary">MongoDB</Badge>
            </div>
            <p className="text-sm">Recommended next course: Advanced React Patterns</p>
          </CardContent>
        </Card>
        <Card className="bg-white bg-opacity-10 text-white">
          <CardHeader>
            <CardTitle>Data Science Specialist</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Dive deep into data analysis, machine learning, and statistical modeling.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">Python</Badge>
              <Badge variant="secondary">R</Badge>
              <Badge variant="secondary">SQL</Badge>
              <Badge variant="secondary">Machine Learning</Badge>
              <Badge variant="secondary">Data Visualization</Badge>
            </div>
            <p className="text-sm">Recommended next course: Advanced Machine Learning Algorithms</p>
          </CardContent>
        </Card>
        <Card className="bg-white bg-opacity-10 text-white">
          <CardHeader>
            <CardTitle>Cloud Computing and DevOps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Learn to build, deploy, and manage scalable applications in the cloud.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">AWS</Badge>
              <Badge variant="secondary">Docker</Badge>
              <Badge variant="secondary">Kubernetes</Badge>
              <Badge variant="secondary">CI/CD</Badge>
              <Badge variant="secondary">Infrastructure as Code</Badge>
            </div>
            <p className="text-sm">Recommended next course: Kubernetes for Production Environments</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

