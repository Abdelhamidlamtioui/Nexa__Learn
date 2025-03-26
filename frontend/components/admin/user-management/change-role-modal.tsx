import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Loader2 } from "lucide-react"
import { useUserStore } from "@/stores/useUserStore"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  roles: Role[];
}

interface ChangeRoleModalProps {
  open: boolean
  onClose: () => void
  selectedUsers: string[]
}

const AVAILABLE_ROLES = [
  { id: "STUDENT", label: "Student", name: "STUDENT" },
  { id: "INSTRUCTOR", label: "Instructor", name: "INSTRUCTOR" },
  { id: "MODERATOR", label: "Moderator", name: "MODERATOR" },
  { id: "ADMIN", label: "Admin", name: "ADMIN" }
]

export function ChangeRoleModal({ open, onClose, selectedUsers }: ChangeRoleModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [hasRoleDifferences, setHasRoleDifferences] = useState(false)
  const { users, updateUserRoles } = useUserStore()

  // Reset selected roles when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedRoles([])
      setHasRoleDifferences(false)
    }
  }, [open])

  // Initialize with user's current roles
  useEffect(() => {
    if (open && selectedUsers.length > 0 && users.length > 0) {
      // Get all selected users' data
      const selectedUsersData = users.filter(user => selectedUsers.includes(user.id))
      
      if (selectedUsersData.length > 0) {
        // Get first user's roles as initial state
        const firstUserRoles = selectedUsersData[0].roles.map(role => role.name)
        
        // Check if all users have the same roles
        const hasRoleDiffs = selectedUsersData.some(user => {
          const userRoleNames = user.roles.map(role => role.name)
          return !userRoleNames.every(role => firstUserRoles.includes(role)) || 
                 !firstUserRoles.every(role => userRoleNames.includes(role))
        })

        setSelectedRoles(firstUserRoles)
        setHasRoleDifferences(hasRoleDiffs && selectedUsers.length > 1)
      }
    }
  }, [open, selectedUsers, users])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedRoles.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one role",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await Promise.all(selectedUsers.map(userId => updateUserRoles(userId, selectedRoles)))
      toast({
        title: "Success",
        description: `Successfully updated roles for ${selectedUsers.length} users`,
      })
      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user roles",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleRole = (roleName: string) => {
    setSelectedRoles(current => 
      current.includes(roleName)
        ? current.filter(name => name !== roleName)
        : [...current, roleName]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#1a2744] text-white border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Change User Roles
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Change roles for {selectedUsers.length} selected users. Users can have multiple roles.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {hasRoleDifferences && (
            <Alert className="bg-amber-900/50 border-amber-700 text-amber-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Selected users have different roles. Showing first user's roles.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {AVAILABLE_ROLES.map((role) => (
              <div key={role.id} className="flex items-center space-x-3">
                <Checkbox
                  id={role.id}
                  checked={selectedRoles.includes(role.name)}
                  onCheckedChange={() => toggleRole(role.name)}
                  className="border-gray-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <Label
                  htmlFor={role.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-200"
                >
                  {role.label}
                </Label>
              </div>
            ))}
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
              disabled={loading || selectedRoles.length === 0}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Roles'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 