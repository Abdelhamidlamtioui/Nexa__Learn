"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Flame, Clock, Star } from 'lucide-react'

const trendingFilters = [
  { name: 'Hot', icon: Flame, color: 'text-orange-500' },
  { name: 'New', icon: Clock, color: 'text-blue-500' },
  { name: 'Top', icon: Star, color: 'text-yellow-500' },
]

export function TrendingFilter() {
  const [activeFilter, setActiveFilter] = useState('Hot')

  return (
    <nav className="mb-8">
      <ul className="flex space-x-2 overflow-x-auto pb-2">
        {trendingFilters.map((filter) => (
          <li key={filter.name}>
            <Button
              variant={activeFilter === filter.name ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.name)}
              className={`rounded-full ${activeFilter === filter.name ? 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white' : 'text-white border-white hover:bg-white hover:text-purple-900'}`}
            >
              <filter.icon className={`mr-2 h-4 w-4 ${filter.color}`} />
              {filter.name}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

