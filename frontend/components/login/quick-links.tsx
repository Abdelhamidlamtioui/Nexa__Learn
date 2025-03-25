"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function QuickLinks() {
  return (
    <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
        <div className="space-y-2">
          <Button asChild variant="link" className="w-full justify-start">
            <Link href="/register">Register account</Link>
          </Button>
          <Button asChild variant="link" className="w-full justify-start">
            <Link href="/token-economy">Learn about token economy</Link>
          </Button>
          <Button asChild variant="link" className="w-full justify-start">
            <Link href="/help-center">Help center</Link>
          </Button>
          <Button asChild variant="link" className="w-full justify-start">
            <Link href="/community-guidelines">Community guidelines</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

