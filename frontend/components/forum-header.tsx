"use client"

import {useEffect, useState} from "react"
import Link from "next/link"
import { Bell, User, Sun, Moon, Settings, DollarSign, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "@/contexts/theme-context"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {authService} from "@/services/api";

export function ForumHeader() {
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)


    useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    window.location.href = '/login'
  }


    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            setIsAuthenticated(true)
            // Fetch user data to get the avatar
            authService
                .getCurrentUser()
                .then((response) => {
                    const user = response.data.data
                    setAvatarUrl(user.avatar || null)
                })
                .catch((error) => {
                    console.error("Failed to fetch user data:", error)
                })
        } else {
            setIsAuthenticated(false)
        }
    }, [])

  const NavLinks = () => (
    <>
      <Link href="/" className="text-white hover:text-pink-400 transition-colors">
        Home
      </Link>
      <Link href="/dev-forum/trending" className="text-white hover:text-pink-400 transition-colors">
        Trending
      </Link>
      <Link href="/dev-forum/latest" className="text-white hover:text-pink-400 transition-colors">
        Latest
      </Link>
      <Link href="/dev-forum/documentation" className="text-white hover:text-pink-400 transition-colors">
        Documentation
      </Link>
    </>
  )

  return (
    <header className="border-b border-white border-opacity-20 bg-gradient-to-r from-indigo-900 to-purple-900 dark:from-gray-800 dark:to-gray-900 backdrop-filter backdrop-blur-lg bg-opacity-30">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-2xl font-bold text-white">
          NexaLearn
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <NavLinks />
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-white hover:text-pink-400">
            <Bell className="h-5 w-5" />
          </Button>
          <Button onClick={toggleTheme} variant="ghost" size="icon" className="text-white hover:text-pink-400">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          {!isAuthenticated ? (
              <>
                <div className="hidden md:block">
                  <Button variant="outline" asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
                <div className="hidden md:block">
                  <Button variant="outline" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                </div>
              </>
          ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={avatarUrl || "https://res.cloudinary.com/hxwhau759/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1713822899/default_images/jlkamkirtzmtuiruyiwo.png"} alt="User Avatar" />
                      <AvatarFallback>US</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" 
                  align="end" 
                  forceMount
                >
                  <DropdownMenuItem 
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    asChild
                  >
                    <Link href="/dev-forum/me">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    asChild
                  >
                    <Link href="/dev-forum/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={handleLogout}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-pink-400">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                <NavLinks />
                <Link href="/register" className="text-white hover:text-pink-400 transition-colors">
                  Register
                </Link>
                <Link href="/login" className="text-white hover:text-pink-400 transition-colors">
                  Login
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

