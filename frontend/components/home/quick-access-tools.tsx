import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Code, Book, MessageCircle, HelpCircle } from "lucide-react"

const tools = [
  { name: "AI Learning Assistant", icon: Bot, action: "Ask AI" },
  { name: "Code Playground", icon: Code, action: "Start Coding" },
  { name: "Documentation Search", icon: Book, action: "Search Docs" },
  { name: "Community Chat", icon: MessageCircle, action: "Join Chat" },
  { name: "Help Center", icon: HelpCircle, action: "Get Help" },
]

export function QuickAccessTools() {
  return (
    <section>
      <h2 className="text-3xl font-bold text-white mb-6">Quick Access Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {tools.map((tool, index) => (
          <Card key={index} className="bg-white bg-opacity-10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <tool.icon className="w-6 h-6" />
                <span>{tool.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">{tool.action}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

