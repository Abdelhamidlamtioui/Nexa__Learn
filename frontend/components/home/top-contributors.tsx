"use client"

import { useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const contributors = [
  {
    username: "techguru",
    avatar: "/avatars/01.png",
    level: 30,
    achievements: ["Code Wizard", "Helpful Hero"],
    techTokens: 15000,
    contribution: "500+ answers",
  },
  {
    username: "aiexpert",
    avatar: "/avatars/02.png",
    level: 28,
    achievements: ["AI Pioneer", "Top Writer"],
    techTokens: 12000,
    contribution: "20 tutorials",
  },
  {
    username: "devops_master",
    avatar: "/avatars/03.png",
    level: 25,
    achievements: ["Cloud Champion", "CI/CD Expert"],
    techTokens: 10000,
    contribution: "50 project contributions",
  },
  {
    username: "ux_designer",
    avatar: "/avatars/04.png",
    level: 22,
    achievements: ["Design Guru", "Accessibility Advocate"],
    techTokens: 8000,
    contribution: "30 design challenges",
  },
  {
    username: "security_ninja",
    avatar: "/avatars/05.png",
    level: 20,
    achievements: ["Bug Hunter", "Encryption Expert"],
    techTokens: 7500,
    contribution: "100 security audits",
  },
]

export function TopContributors() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      let scrollAmount = 0
      const scrollSpeed = 0.5
      const maxScroll = scrollElement.scrollWidth - scrollElement.clientWidth

      const scroll = () => {
        scrollAmount += scrollSpeed
        if (scrollAmount > maxScroll) {
          scrollAmount = 0
        }
        scrollElement.scrollLeft = scrollAmount
        requestAnimationFrame(scroll)
      }

      const animation = requestAnimationFrame(scroll)

      return () => cancelAnimationFrame(animation)
    }
  }, [])

  return (
    <section className="overflow-hidden">
      <h2 className="text-3xl font-bold text-white mb-6">Top Contributors</h2>
      <div ref={scrollRef} className="flex space-x-4 overflow-x-hidden">
        {contributors.map((contributor, index) => (
          <Card key={index} className="bg-white bg-opacity-10 text-white flex-shrink-0 w-64">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar>
                  <AvatarImage src={contributor.avatar} />
                  <AvatarFallback>{contributor.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">{contributor.username}</p>
                  <p className="text-sm">Level {contributor.level}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {contributor.achievements.map((achievement, i) => (
                    <Badge key={i} variant="secondary">
                      {achievement}
                    </Badge>
                  ))}
                </div>
                <p>{contributor.techTokens.toLocaleString()} TT</p>
                <p className="text-sm">{contributor.contribution}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

