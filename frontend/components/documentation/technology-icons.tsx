import {
  Lightbulb,       // Getting Started
  Code,            // Programming Language
  Box,             // Framework
  Package,         // Library
  Layout,          // Frontend
  Server,          // Backend
  BookOpen,        // Resources
  Cpu,             // Advanced
  GitBranch,       // DevOps
  FileJson,        // API
  Wrench,          // Tool
  Database,        // Database
  Cloud,           // Cloud Service
  HelpCircle       // Other/Default
} from "lucide-react"

// Map TechnologyType enum values to their corresponding icons
export const getTechnologyIcon = (type?: string) => {
  if (!type) return HelpCircle; // Use HelpCircle as the default icon
  
  switch (type.toUpperCase()) {
    case "GETTING_STARTED":
      return Lightbulb
    case "PROGRAMMING_LANGUAGE":
      return Code
    case "FRAMEWORK":
      return Box
    case "LIBRARY":
      return Package
    case "FRONTEND":
      return Layout
    case "BACKEND":
      return Server
    case "RESOURCES":
      return BookOpen
    case "ADVANCED":
      return Cpu
    case "DEVOPS":
      return GitBranch
    case "API":
      return FileJson
    case "TOOL":
      return Wrench
    case "DATABASE":
      return Database
    case "CLOUD_SERVICE":
      return Cloud
    case "OTHER":
    default:
      return HelpCircle
  }
}

// Add a function to get color for each technology type
export const getTechnologyColor = (type?: string) => {
  if (!type) return "bg-gray-500/20 text-gray-500"; // Default fallback color
  
  switch (type.toUpperCase()) {
    case "GETTING_STARTED":
      return "bg-blue-500/20 text-blue-500"
    case "PROGRAMMING_LANGUAGE":
      return "bg-purple-500/20 text-purple-500"
    case "FRAMEWORK":
      return "bg-green-500/20 text-green-500"
    case "LIBRARY":
      return "bg-yellow-500/20 text-yellow-500"
    case "FRONTEND":
      return "bg-pink-500/20 text-pink-500"
    case "BACKEND":
      return "bg-indigo-500/20 text-indigo-500"
    case "RESOURCES":
      return "bg-violet-500/20 text-violet-500"
    case "ADVANCED":
      return "bg-amber-500/20 text-amber-500"
    case "DEVOPS":
      return "bg-cyan-500/20 text-cyan-500"
    case "API":
      return "bg-orange-500/20 text-orange-500"
    case "TOOL":
      return "bg-lime-500/20 text-lime-500"
    case "DATABASE":
      return "bg-red-500/20 text-red-500"
    case "CLOUD_SERVICE":
      return "bg-sky-500/20 text-sky-500"
    case "OTHER":
    default:
      return "bg-gray-500/20 text-gray-500"
  }
}

// For TypeScript type safety
export type TechnologyType = 
  | "GETTING_STARTED"
  | "PROGRAMMING_LANGUAGE"
  | "FRAMEWORK"
  | "LIBRARY"
  | "FRONTEND"
  | "BACKEND"
  | "RESOURCES"
  | "ADVANCED"
  | "DEVOPS"
  | "API"
  | "TOOL"
  | "DATABASE"
  | "CLOUD_SERVICE"
  | "OTHER" 