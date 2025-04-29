import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { blogService } from "@/services/api";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Code,
    Quote,
    Link as LinkIcon,
    Image,
    Heading1,
    Heading2,
    Save,
    Eye,
    X,
    Plus,
    ChevronDown,
    Loader,
    ArrowLeft
} from "lucide-react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/useAuthStore";

// Type definition for Blog Data
interface BlogData {
    id?: string; 
    title: string;
    content: string;
    categoryName: string;
    tags: string[];
    published: boolean;
    pointsCost: number;
}

// Initial blog data template
const initialBlogData: BlogData = {
    title: "",
    content: "",
    categoryName: "",
    tags: [],
    published: false,
    pointsCost: 0
};

// Category to color mapping
const categoryColors: Record<string, string> = {
    "GENERAL": "bg-gray-500/20 text-gray-500",
    "TECHNOLOGY": "bg-blue-500/20 text-blue-500",
    "PROGRAMMING": "bg-green-500/20 text-green-500",
    "DESIGN": "bg-purple-500/20 text-purple-500",
    "CAREER": "bg-orange-500/20 text-orange-500",
    "TUTORIAL": "bg-pink-500/20 text-pink-500",
    "REVIEW": "bg-cyan-500/20 text-cyan-500",
    "NEWS": "bg-indigo-500/20 text-indigo-500",
    "PROJECT_SHOWCASE": "bg-yellow-500/20 text-yellow-500",
    "COMMUNITY": "bg-red-500/20 text-red-500"
};

export function BlogEditor({ blogId = null }) {
    const router = useRouter();
    const { toast } = useToast();
    const { isAuthenticated, user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(!!blogId);
    const [activeTab, setActiveTab] = useState("write");
    const [blogData, setBlogData] = useState<BlogData>(initialBlogData);
    const [originalBlog, setOriginalBlog] = useState<BlogData | null>(null);
    const [newTag, setNewTag] = useState("");
    const [previewHTML, setPreviewHTML] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(!!blogId);
    const [isDirty, setIsDirty] = useState(false);

    // Categories state
    const [categories, setCategories] = useState<string[]>([]);
    
    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await blogService.getCategories();
                if (response.data && response.data.success) {
                    const fetched = response.data.data;
                    const names = fetched.map((c: any) => (typeof c === "string" ? c : c.name));
                    setCategories(names);
                } else {
                    console.error('Failed to fetch categories:', response.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        
        fetchCategories();
    }, []);

    // Fetch blog data if editing
    useEffect(() => {
        // Check authentication
        if (!isAuthenticated) {
            toast({
                title: "Authentication Required",
                description: "Please log in to create or edit blogs",
                variant: "destructive",
            });
            router.push("/login");
            return;
        }

        // Fetch blog data if editing
        const fetchBlog = async () => {
            if (!blogId) return;

            try {
                setIsFetching(true);
                const response = await blogService.getBlogById(blogId);

                if (response.data && response.data.success) {
                    const blog = response.data.data;
                    setBlogData({
                        title: blog.title || "",
                        content: blog.content || "",
                        categoryName: blog.categoryName || "",
                        tags: blog.tags || [],
                        published: blog.published || false,
                        pointsCost: blog.pointsCost || 0
                    });
                    setOriginalBlog(blog);
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to load blog post",
                        variant: "destructive",
                    });
                    router.push("/dev-forum/blog");
                }
            } catch (error) {
                console.error("Error fetching blog:", error);
                toast({
                    title: "Error",
                    description: (error as any).response?.data?.message || "Failed to load blog post",
                    variant: "destructive",
                });
                router.push("/dev-forum/blog");
            } finally {
                setIsFetching(false);
            }
        };

        fetchBlog();
    }, [blogId, isAuthenticated, router, toast]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlogData(prev => ({
            ...prev,
            [name]: value
        }));
        setIsDirty(true);
    };

    // Handle numeric input changes
    const handleNumericChange = (e) => {
        const { name, value } = e.target;
        const numericValue = parseInt(value, 10);
        setBlogData(prev => ({
            ...prev,
            [name]: isNaN(numericValue) ? 0 : numericValue
        }));
        setIsDirty(true);
    };

    // Handle tag input
    const handleAddTag = () => {
        if (newTag.trim() && !blogData.tags.includes(newTag.trim())) {
            setBlogData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag("");
            setIsDirty(true);
        }
    };

    // Handle tag removal
    const handleRemoveTag = (tagToRemove) => {
        setBlogData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
        setIsDirty(true);
    };

    // Generate preview when switching to preview tab
    const handleTabChange = (value) => {
        setActiveTab(value);
        if (value === "preview") {
            // In a real app, you'd use a proper markdown parser or sanitize HTML
            setPreviewHTML(blogData.content);
        }
    };

    // Insert markdown formatting
    const insertFormatting = (format) => {
        const textarea = document.getElementById("content");
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = blogData.content;
        const selectedText = text.substring(start, end);

        let insertion;
        switch (format) {
            case "bold":
                insertion = `**${selectedText || "bold text"}**`;
                break;
            case "italic":
                insertion = `*${selectedText || "italic text"}*`;
                break;
            case "list":
                insertion = `\n- ${selectedText || "list item"}\n- another item\n`;
                break;
            case "ordered-list":
                insertion = `\n1. ${selectedText || "list item"}\n2. another item\n`;
                break;
            case "code":
                insertion = selectedText ? `\`${selectedText}\`` : "```\ncode block\n```";
                break;
            case "quote":
                insertion = `\n> ${selectedText || "quote"}\n`;
                break;
            case "link":
                insertion = selectedText ? `[${selectedText}](url)` : "[link text](url)";
                break;
            case "image":
                insertion = "![alt text](image-url)";
                break;
            case "h1":
                insertion = `\n# ${selectedText || "Heading 1"}\n`;
                break;
            case "h2":
                insertion = `\n## ${selectedText || "Heading 2"}\n`;
                break;
            default:
                insertion = selectedText;
        }

        const newText = text.substring(0, start) + insertion + text.substring(end);
        setBlogData(prev => ({ ...prev, content: newText }));
        setIsDirty(true);

        // Set focus back to textarea with cursor at the right position
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + insertion.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    // Handle form submission
    const handleSubmit = async (publishMode:any) => {
        if (!blogData.title || !blogData.content) {
            toast({
                title: "Validation Error",
                description: "Title and content are required",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const isPublish = publishMode === "publish";
            const dataToSubmit = {
                ...blogData,
                categoryName: blogData.categoryName,
                published: isPublish // true only when explicitly publishing (admin flow)
            };

            let response;

            if (isEditing) {
                // Update existing blog
                response = await blogService.updateBlog(blogId, dataToSubmit);

                // With the approval workflow, submit for review instead of direct publishing
                if (isPublish && !originalBlog.published) {
                    await blogService.submitForReview(blogId);
                }
            } else {
                // Create new blog
                response = await blogService.createBlog(dataToSubmit);
                
                // Submit for review if publishing a new blog
                if (isPublish && response.data && response.data.success) {
                    const newBlogId = response.data.data.id;
                    await blogService.submitForReview(newBlogId);
                }
            }

            if (response.data && response.data.success) {
                const blog = response.data.data;
                setBlogData({
                    title: blog.title || "",
                    content: blog.content || "",
                    categoryName: blog.categoryName || "",
                    tags: blog.tags || [],
                    published: blog.published || false,
                    pointsCost: blog.pointsCost || 0
                });
                
                toast({
                    title: "Success",
                    description: isEditing
                        ? (isPublish ? "Blog submitted for review successfully" : "Blog saved as draft successfully")
                        : (isPublish ? "Blog submitted for review successfully" : "Blog created as draft successfully"),
                    variant: "default",
                });

                // Navigate to the blog post
                const blogIdToView = isEditing ? (originalBlog?.id || response.data.data.id) : response.data.data.id;
                router.push(`/dev-forum/blog/${blogIdToView}`);
            } else {
                throw new Error("Failed to save blog");
            }
        } catch (error) {
            console.error("Error saving blog:", error);
            toast({
                title: "Error",
                description: (error as any).response?.data?.message || "Failed to save blog",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Check for unsaved changes before navigating away
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = ''; // This is required for Chrome
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDirty]);

    // Handle cancel
    const handleCancel = () => {
        if (isDirty) {
            if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
                router.push("/dev-forum/blog");
            }
        } else {
            router.push("/dev-forum/blog");
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white">
                <Loader className="animate-spin h-8 w-8 mb-4" />
                <p>Loading blog data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white py-12 px-4">
            <div className="container mx-auto max-w-5xl">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-yellow-500">
                        {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
                    </h1>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 text-white border-white/20 hover:bg-white/10"
                        onClick={handleCancel}
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Blogs
                    </Button>
                </div>

                <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none mb-8">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Blog Editor</span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="text-white border-white/20 hover:bg-white/10"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white"
                                    onClick={() => handleSubmit("next")}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Eye className="mr-2 h-4 w-4" />
                                    )}
                                    Next
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <Label htmlFor="title" className="text-white">Blog Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={blogData.title}
                                    onChange={handleChange}
                                    placeholder="Enter an engaging title for your blog post"
                                    className="bg-white bg-opacity-10 border-white/20 text-white mt-1"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <Label htmlFor="category" className="text-white">Category</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between mt-1 border-white/20 text-white"
                                            disabled={isLoading}
                                        >
                                            {blogData.categoryName || "Select a category"}
                                            <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[200px] bg-gray-800 border-white/20 text-white">
                                        {categories.map(category => (
                                            <DropdownMenuItem
                                                key={category}
                                                className="hover:bg-gray-700 cursor-pointer"
                                                onClick={() => {
                                                    setBlogData(prev => ({ ...prev, categoryName: category }));
                                                    setIsDirty(true);
                                                }}
                                            >
                                                <span className={`w-2 h-2 rounded-full mr-2 ${(categoryColors as Record<string, string>)[category]?.split(' ')[0] || 'bg-gray-500'}`}></span>
                                                {category}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Tags */}
                            <div>
                                <Label htmlFor="tags" className="text-white">Tags</Label>
                                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                    {blogData.tags.map(tag => (
                                        <Badge
                                            key={tag}
                                            className="bg-blue-500/20 text-blue-500 flex items-center gap-1"
                                        >
                                            {tag}
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() => handleRemoveTag(tag)}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        id="newTag"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="Add tag"
                                        className="bg-white bg-opacity-10 border-white/20 text-white"
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                        disabled={isLoading}
                                    />
                                    <Button
                                        variant="outline"
                                        className="border-white/20 text-white"
                                        onClick={handleAddTag}
                                        disabled={isLoading}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Points Cost */}
                            <div>
                                <Label htmlFor="pointsCost" className="text-white">Reader Points Cost (0 for free)</Label>
                                <Input
                                    id="pointsCost"
                                    name="pointsCost"
                                    type="number"
                                    min="0"
                                    value={blogData.pointsCost}
                                    onChange={handleNumericChange}
                                    placeholder="0"
                                    className="bg-white bg-opacity-10 border-white/20 text-white mt-1"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Content Editor */}
                            <div>
                                <Label htmlFor="content" className="text-white">Blog Content</Label>
                                <Tabs defaultValue="write" onValueChange={handleTabChange}>
                                    <div className="flex justify-between items-center">
                                        <TabsList className="bg-white bg-opacity-10 mb-2">
                                            <TabsTrigger value="write" className="data-[state=active]:bg-blue-700">Write</TabsTrigger>
                                            <TabsTrigger value="preview" className="data-[state=active]:bg-blue-700">Preview</TabsTrigger>
                                        </TabsList>

                                        {activeTab === "write" && (
                                            <div className="flex flex-wrap gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-white"
                                                    onClick={() => insertFormatting("bold")}
                                                    disabled={isLoading}
                                                >
                                                    <Bold className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-white"
                                                    onClick={() => insertFormatting("italic")}
                                                    disabled={isLoading}
                                                >
                                                    <Italic className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-white"
                                                    onClick={() => insertFormatting("h1")}
                                                    disabled={isLoading}
                                                >
                                                    <Heading1 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-white"
                                                    onClick={() => insertFormatting("h2")}
                                                    disabled={isLoading}
                                                >
                                                    <Heading2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-white"
                                                    onClick={() => insertFormatting("list")}
                                                    disabled={isLoading}
                                                >
                                                    <List className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-white"
                                                    onClick={() => insertFormatting("ordered-list")}
                                                    disabled={isLoading}
                                                >
                                                    <ListOrdered className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-white"
                                                    onClick={() => insertFormatting("code")}
                                                    disabled={isLoading}
                                                >
                                                    <Code className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-white"
                                                    onClick={() => insertFormatting("quote")}
                                                    disabled={isLoading}
                                                >
                                                    <Quote className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-white"
                                                    onClick={() => insertFormatting("link")}
                                                    disabled={isLoading}
                                                >
                                                    <LinkIcon className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-white"
                                                    onClick={() => insertFormatting("image")}
                                                    disabled={isLoading}
                                                >
                                                    <Image className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <TabsContent value="write">
                                        <Textarea
                                            id="content"
                                            name="content"
                                            value={blogData.content}
                                            onChange={handleChange}
                                            placeholder="Write your blog content using Markdown..."
                                            className="min-h-[400px] text-white bg-white bg-opacity-10 border-white/20 font-mono"
                                            disabled={isLoading}
                                        />
                                    </TabsContent>

                                    <TabsContent value="preview">
                                        <div className="min-h-[400px] p-4 bg-white bg-opacity-10 border border-white/20 rounded-md overflow-y-auto prose prose-invert max-w-none">
                                            {previewHTML ? (
                                                <div style={{ whiteSpace: "pre-wrap" }}>{previewHTML}</div>
                                            ) : (
                                                <div className="text-gray-400 italic">
                                                    Preview will appear here. Start writing in the "Write" tab.
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between">
                        <div className="flex items-center">
                            {blogData.categoryName && (
                                <Badge className={categoryColors[blogData.categoryName]}>
                                    {blogData.categoryName}
                                </Badge>
                            )}
                            <p className="ml-2 text-gray-300">
                                {isEditing && originalBlog && originalBlog.published ? "Published" : "Draft"}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="text-white border-white/20 hover:bg-white/10"
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white"
                                onClick={() => handleSubmit("next")}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Eye className="mr-2 h-4 w-4" />
                                )}
                                Next
                            </Button>
                        </div>
                    </CardFooter>
                </Card>

                {/* Markdown Cheatsheet Card */}
                {/* <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none">
                    <CardHeader>
                        <CardTitle>Markdown Cheatsheet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="font-bold mb-1">Text Formatting</p>
                                <ul className="space-y-1 text-gray-300">
                                    <li><code className="bg-blue-900/40 px-2 py-0.5 rounded">**bold**</code> - <strong>bold</strong></li>
                                    <li><code className="bg-blue-900/40 px-2 py-0.5 rounded">*italic*</code> - <em>italic</em></li>
                                    <li><code className="bg-blue-900/40 px-2 py-0.5 rounded">`code`</code> - <code>code</code></li>
                                </ul>
                            </div>

                            <div>
                                <p className="font-bold mb-1">Headers</p>
                                <ul className="space-y-1 text-gray-300">
                                    <li><code className="bg-blue-900/40 px-2 py-0.5 rounded"># Heading 1</code></li>
                                    <li><code className="bg-blue-900/40 px-2 py-0.5 rounded">## Heading 2</code></li>
                                    <li><code className="bg-blue-900/40 px-2 py-0.5 rounded">### Heading 3</code></li>
                                </ul>
                            </div>

                            <div>
                                <p className="font-bold mb-1">Lists</p>
                                <ul className="space-y-1 text-gray-300">
                                    <li><code className="bg-blue-900/40 px-2 py-0.5 rounded">- item</code> - Bullet point</li>
                                    <li><code className="bg-blue-900/40 px-2 py-0.5 rounded">1. item</code> - Numbered list</li>
                                </ul>
                            </div>

                            <div>
                                <p className="font-bold mb-1">Others</p>
                                <ul className="space-y-1 text-gray-300">
                                    <li><code className="bg-blue-900/40 px-2 py-0.5 rounded">[link](url)</code> - <a href="#" className="text-blue-400">link</a></li>
                                    <li><code className="bg-blue-900/40 px-2 py-0.5 rounded">![alt](img-url)</code> - Image</li>
                                    <li><code className="bg-blue-900/40 px-2 py-0.5 rounded">&gt; quote</code> - Blockquote</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card> */}
            </div>
        </div>
    );
}