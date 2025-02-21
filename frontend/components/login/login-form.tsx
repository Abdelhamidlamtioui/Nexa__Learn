// LoginForm.tsx
"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import { FaGoogle, FaGithub } from "react-icons/fa"
import { motion } from "framer-motion"
import {useState} from "react";

interface LoginFormProps {
  onSubmit: (formData: { username: string; password: string }) => void;
  isSubmitting: boolean;
  error?: string;
}

export function LoginForm({ onSubmit, isSubmitting, error }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ username, password })
  }

  return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
        <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="bg-white bg-opacity-20 border-none text-white placeholder-gray-400"
                    placeholder="Enter your username"
                    autoFocus
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white bg-opacity-20 border-none text-white placeholder-gray-400 pr-10"
                      placeholder="Enter your password"
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" checked={rememberMe} onCheckedChange={() => setRememberMe(!rememberMe)} />
                  <Label htmlFor="remember">Remember me</Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-blue-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                ) : (
                    "Log in"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 p-6 pt-0">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-gray-400">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
              className="w-full border-indigo-600 hover:bg-indigo-600/10 text-white transition-all duration-200"
            >
              Connect Web3 Wallet
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
  )
}