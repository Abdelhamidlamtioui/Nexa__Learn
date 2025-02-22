"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { FaGoogle, FaGithub } from "react-icons/fa"

interface RegistrationFormProps {
  onSubmit: (formData: any) => void
  isSubmitting: boolean
}

export function RegistrationForm({ onSubmit, isSubmitting }: RegistrationFormProps) {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")
  const [agreeTerms, setAgreeTerms] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ email, username, password, role, agreeTerms })
  }

  return (
    <motion.div
      className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6">Create Your Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white bg-opacity-20 border-none text-white placeholder-gray-400"
          />
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="bg-white bg-opacity-20 border-none text-white placeholder-gray-400"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white bg-opacity-20 border-none text-white placeholder-gray-400"
          />
        </div>
        <div>
          <Label>Role</Label>
          <RadioGroup value={role} onValueChange={setRole} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="student" id="student" />
              <Label htmlFor="student">Student</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="instructor" id="instructor" />
              <Label htmlFor="instructor">Instructor</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" checked={agreeTerms} onCheckedChange={() => setAgreeTerms(!agreeTerms)} />
          <Label htmlFor="terms">I agree to the terms and token economy</Label>
        </div>
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-200 disabled:opacity-50"
        >
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </Button>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-gray-400">Or register with</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="w-full border-indigo-600 hover:bg-indigo-600/10 text-white transition-all duration-200"
            >
              <FaGoogle className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-purple-600 hover:bg-purple-600/10 text-white transition-all duration-200"
            >
              <FaGithub className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4 border-indigo-600 hover:bg-indigo-600/10 text-white transition-all duration-200"
          >
            Connect Web3 Wallet
          </Button>
        </div>
      </form>
    </motion.div>
  )
}

