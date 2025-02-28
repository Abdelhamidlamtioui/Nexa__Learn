import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"

export function SearchBar() {
  return (
    <div className="relative">
      <Input 
        type="search" 
        placeholder="Search discussions..." 
        className="pl-10 pr-4 py-2 w-64 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-full text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
    </div>
  )
}

