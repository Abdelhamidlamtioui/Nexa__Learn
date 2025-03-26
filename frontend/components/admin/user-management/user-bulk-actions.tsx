import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, Send, UserCog, Trash2 } from "lucide-react"
import { ChangeRoleModal } from "./change-role-modal"
import { useUserStore } from "@/stores/useUserStore"
import { useToast } from "@/components/ui/use-toast"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UserBulkActionsProps {
  selectedUsers: string[]
}

export function UserBulkActions({ selectedUsers }: UserBulkActionsProps) {
  const hasSelection = selectedUsers.length > 0
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const { deleteUser } = useUserStore()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) return
    
    setIsDeleting(true)
    let successCount = 0
    let errorCount = 0
    
    // Process deletions sequentially to avoid overloading the server
    for (const userId of selectedUsers) {
      try {
        await deleteUser(userId)
        successCount++
      } catch (error) {
        console.error('Failed to delete user:', userId, error)
        errorCount++
      }
    }
    
    setIsDeleting(false)
    setIsDeleteConfirmOpen(false)
    
    // Show appropriate toast message based on results
    if (errorCount === 0) {
      toast({
        title: "Success",
        description: `Successfully deleted ${successCount} user${successCount !== 1 ? 's' : ''}`,
      })
    } else if (successCount === 0) {
      toast({
        title: "Error",
        description: `Failed to delete ${errorCount} user${errorCount !== 1 ? 's' : ''}`,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Partial Success",
        description: `Deleted ${successCount} user${successCount !== 1 ? 's' : ''}, but failed to delete ${errorCount}`,
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          disabled={!hasSelection}
          className="bg-[#2a3754] border-gray-700 text-white hover:bg-[#3a4764] hover:text-white"
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button 
          variant="outline" 
          disabled={!hasSelection}
          className="bg-[#2a3754] border-gray-700 text-white hover:bg-[#3a4764] hover:text-white"
        >
          <Send className="mr-2 h-4 w-4" />
          Message
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              disabled={!hasSelection}
              className="bg-[#2a3754] border-gray-700 text-white hover:bg-[#3a4764] hover:text-white"
            >
              <UserCog className="mr-2 h-4 w-4" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="bg-[#2a3754] border border-gray-700 text-white min-w-[160px]"
            style={{ backgroundColor: '#2a3754' }}
          >
            <DropdownMenuItem 
              className="hover:bg-[#3a4764] focus:bg-[#3a4764] text-white cursor-pointer"
              onClick={() => setIsChangeRoleModalOpen(true)}
            >
              Change Role
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="hover:bg-red-600/90 focus:bg-red-600/90 text-red-500 hover:text-white focus:text-white cursor-pointer"
              onClick={() => setIsDeleteConfirmOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ChangeRoleModal
        open={isChangeRoleModalOpen}
        onClose={() => setIsChangeRoleModalOpen(false)}
        selectedUsers={selectedUsers}
      />

      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent className="bg-[#1a2744] border border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete {selectedUsers.length} selected user{selectedUsers.length !== 1 ? 's' : ''}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
              onClick={(e) => {
                e.preventDefault()
                handleDeleteSelected()
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

