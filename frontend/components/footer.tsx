import Link from 'next/link'
import { Github, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Nexa Learn</h2>
            <p className="text-sm">Connect, learn, and grow with developers worldwide.</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-pink-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-pink-400 transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-pink-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-pink-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-pink-400 transition-colors"><Github /></a>
              <a href="#" className="hover:text-pink-400 transition-colors"><Twitter /></a>
              <a href="#" className="hover:text-pink-400 transition-colors"><Linkedin /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white border-opacity-20 text-center">
          <p className="text-sm">&copy; 2025 Nexa Learn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

