"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle, Bell, Menu, Search } from "lucide-react"

export function GlobalElements() {
  const [showHelp, setShowHelp] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <>
      <div className="fixed bottom-4 right-4 space-y-2">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-lg"
          onClick={() => setShowHelp(!showHelp)}
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-lg"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="h-6 w-6" />
        </Button>
      </div>

      {showHelp && (
        <Card className="fixed bottom-16 right-4 w-64 bg-white bg-opacity-90 backdrop-blur-lg shadow-lg">
          <CardContent className="p-4">
            <h3 className="font-bold mb-2">Need Help?</h3>
            <p className="text-sm mb-2">How can we assist you today?</p>
            <Button className="w-full">Contact Support</Button>
          </CardContent>
        </Card>
      )}

      {showNotifications && (
        <Card className="fixed bottom-16 right-4 w-64 bg-white bg-opacity-90 backdrop-blur-lg shadow-lg">
          <CardContent className="p-4">
            <h3 className="font-bold mb-2">Notifications</h3>
            <ul className="text-sm space-y-2">
              <li>New course available: AI Ethics</li>
              <li>Your project received 5 stars!</li>
              <li>Community challenge starts tomorrow</li>
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="fixed top-4 left-4 md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div className="fixed top-4 right-4">
        <Button variant="ghost" size="icon">
          <Search className="h-6 w-6" />
        </Button>
      </div>

      <div className="fixed bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-lg rounded-full px-3 py-1 text-sm font-medium shadow-lg">
        Balance: 1000 TT
      </div>
    </>
  )
}

