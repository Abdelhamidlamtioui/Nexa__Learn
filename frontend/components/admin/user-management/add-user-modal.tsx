import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { userService } from "@/services/api"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useUserStore } from "@/stores/useUserStore"

interface AddUserModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddUserModal({ open, onClose, onSuccess }: AddUserModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const addUser = useUserStore(state => state.addUser)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "STUDENT"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await addUser(formData)
      toast({
        title: "Success",
        description: "User has been created successfully",
      })
      onSuccess()
      onClose()
      setFormData({ username: "", email: "", password: "", role: "STUDENT" })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#1a2744] text-white border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Add New User
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new user account with specific role and permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-300">Username</Label>
            <Input
              id="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="bg-[#2a3754] border-gray-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-[#2a3754] border-gray-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-[#2a3754] border-gray-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-gray-300">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger className="w-full bg-[#2a3754] border-gray-700 text-white focus:ring-purple-500">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent 
                className="bg-[#2a3754] border border-gray-700"
                style={{ backgroundColor: '#2a3754' }}
              >
                <SelectItem 
                  value="STUDENT" 
                  className="text-white hover:bg-[#3a4764] focus:bg-[#3a4764] focus:text-white"
                >
                  Student
                </SelectItem>
                <SelectItem 
                  value="INSTRUCTOR" 
                  className="text-white hover:bg-[#3a4764] focus:bg-[#3a4764] focus:text-white"
                >
                  Instructor
                </SelectItem>
                <SelectItem 
                  value="ADMIN" 
                  className="text-white hover:bg-[#3a4764] focus:bg-[#3a4764] focus:text-white"
                >
                  Admin
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 