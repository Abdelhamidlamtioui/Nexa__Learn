import { useState, useEffect } from "react"
import { MessageSquare, X, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true)
      setTimeout(() => {
        setMessages([
          { role: "ai", content: "Hi! I'm DocBuddy, your AI assistant. How can I help you with the documentation?" },
        ])
        setIsTyping(false)
      }, 1000)
    }
  }, [isOpen, messages.length])

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { role: "user", content: input }])
      setInput("")
      setIsTyping(true)
      // Simulating AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "I'm here to help! Could you please provide more context about your question?" },
        ])
        setIsTyping(false)
      }, 1000)
    }
  }

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 rounded-full shadow-lg bg-gradient-to-r from-primary-start to-primary-end text-white hover:from-primary-end hover:to-primary-start transition-all duration-300 floating-effect"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="mr-2 h-4 w-4" /> DocBuddy
      </Button>
      {isOpen && (
        <Card
          className={`fixed ${isMinimized ? "bottom-4 right-4 w-auto" : "bottom-20 right-4 w-80"} shadow-xl transition-all duration-300 floating-effect gradient-border`}
        >
          <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-primary-start to-primary-end text-white">
            <CardTitle className="text-lg font-semibold text-white">DocBuddy AI</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:text-gray-200"
              >
                <ChevronUp className={`h-4 w-4 transition-transform duration-300 ${isMinimized ? "rotate-180" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          {!isMinimized && (
            <CardContent>
              <div className="h-64 overflow-y-auto mb-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg ${message.role === "ai" ? "bg-gray-100 dark:bg-gray-700" : "bg-gradient-to-r from-primary-start to-primary-end text-white"}`}
                  >
                    <strong>{message.role === "ai" ? "DocBuddy:" : "You:"}</strong> {message.content}
                  </div>
                ))}
                {isTyping && (
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <strong>DocBuddy:</strong> <span className="animate-pulse">Typing...</span>
                  </div>
                )}
              </div>
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Ask DocBuddy..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-grow mr-2 text-white bg-white bg-opacity-10"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-primary-start to-primary-end text-white hover:from-primary-end hover:to-primary-start"
                >
                  Send
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  )
}

