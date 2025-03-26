import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  username: string;
  avatarUrl?: string;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ username, avatarUrl, size = "md" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-12 w-12 text-base"
  };
  
  return (
    <Avatar className={`${sizeClasses[size]} ring-2 ring-white/20`}>
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt={username} 
          className="h-full w-full object-cover"
        />
      ) : (
        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-medium">
          {username?.[0]?.toUpperCase() || '?'}
        </AvatarFallback>
      )}
    </Avatar>
  );
} 