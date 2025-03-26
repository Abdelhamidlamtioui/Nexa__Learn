"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { TrendingUp, Code, Server, Cloud, Smartphone } from 'lucide-react'

const categories = [
  { name: 'All', icon: TrendingUp, color: 'text-blue-500' },
  { name: 'Frontend', icon: Code, color: 'text-green-500' },
  { name: 'Backend', icon: Server, color: 'text-purple-500' },
  { name: 'DevOps', icon: Cloud, color: 'text-orange-500' },
  { name: 'Mobile', icon: Smartphone, color: 'text-pink-500' },
]

export function CategoryFilter() {
  const [activeCategory, setActiveCategory] = useState('All')

  return (
    <nav className="mb-8">
      <ul className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <li key={category.name}>
            <Button
              variant={activeCategory === category.name ? "default" : "outline"}
              onClick={() => setActiveCategory(category.name)}
              className={`rounded-full ${activeCategory === category.name ? 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white' : 'text-white border-white hover:bg-white hover:text-purple-900'}`}
            >
              <category.icon className={`mr-2 h-4 w-4 ${category.color}`} />
              {category.name}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

