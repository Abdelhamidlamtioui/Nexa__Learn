import { ArrowBigUp, ArrowBigDown, MessageSquare, Code } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface PostCardProps {
  title: string;
  author: string;
  content: string;
  category: string;
  votes: number;
  comments: number;
  codeSnippet: string;
  onComment?: () => void;
}

export function PostCard({ title, author, content, category, votes, comments, codeSnippet, onComment }: PostCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
          <Badge variant="outline" className="ml-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white border-none">
            {category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback>{author && author.length > 0 ? author[0].toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-300">{author || 'Anonymous'}</span>
        </div>
        <p className="text-sm mb-4 text-gray-200 line-clamp-3">{content}</p>
        {codeSnippet && (
          <div className="bg-gray-800 p-2 rounded-md overflow-x-auto mb-4">
            <pre className="text-xs text-gray-300">
              <code>{codeSnippet}</code>
            </pre>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-500">
            <ArrowBigUp className="mr-1 h-4 w-4" />
            <span className="text-sm font-medium">{votes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-500">
            <ArrowBigDown className="h-4 w-4" />
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-300 hover:text-white"
          onClick={onComment}
        >
          <MessageSquare className="mr-1 h-4 w-4" />
          <span className="text-sm font-medium">{comments}</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

