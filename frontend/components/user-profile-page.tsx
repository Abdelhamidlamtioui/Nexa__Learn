import { ForumHeader } from "@/components/forum-header"
import { UserProfile } from "@/components/user-profile"

export function UserProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <ForumHeader />
      <main className="flex-grow container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-8">
          My Profile
        </h1>
        <UserProfile />
      </main>
    </div>
  )
}

