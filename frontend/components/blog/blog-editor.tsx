import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
    ChevronDown
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

// Mock blog data if editing
const mockBlog = {
    title: "Getting Started with React Hooks",
    content: "React Hooks are a powerful feature introduced in React 16.8 that allows you to use state and other React features without writing a class...",
    category: "Frontend",
    tags: ["React", "JavaScript", "Hooks"],
    isDraft: true,
    pointsCost: 0
};

export function BlogEditor() {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("write");
    const [blogData, setBlogData] = useState(isEditing ? mockBlog : {
        title: "",
        content: "",
        category: "",
        tags: [],
        isDraft: true,
        pointsCost: 0
    });

    const [newTag, setNewTag] = useState("");
    const [previewHTML, setPreviewHTML] = useState("");

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlogData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle tag input
    const handleAddTag = () => {
        if (newTag.trim() && !blogData.tags.includes(newTag.trim())) {
            setBlogData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag("");
        }
    };

    // Handle tag removal
    const handleRemoveTag = (tagToRemove) => {
        setBlogData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
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

        // Set focus back to textarea with cursor at the right position
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + insertion.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    // Handle form submission
    const handleSubmit = (publishMode) => {
        // Set draft mode based on button clicked
        const dataToSubmit = {
            ...blogData,
            isDraft: publishMode === "draft"
        };

        console.log("Submitting blog:", dataToSubmit);
        // Here you would call your API to save the blog
        alert(`Blog ${publishMode === "draft" ? "saved as draft" : "published"}!`);
    };

    // Category options
    const categories = [
        "Frontend", "Backend", "DevOps", "Mobile", "AI/ML",
        "Database", "Security", "UI/UX", "Career", "Tools"
    ];

    // Category to color mapping
    const categoryColors = {
        "Frontend": "bg-blue-500/20 text-blue-500",
        "Backend": "bg-green-500/20 text-green-500",
        "DevOps": "bg-orange-500/20 text-orange-500",
        "Mobile": "bg-pink-500/20 text-pink-500",
        "AI/ML": "bg-cyan-500/20 text-cyan-500",
        "Database": "bg-yellow-500/20 text-yellow-500",
        "Security": "bg-red-500/20 text-red-500",
        "UI/UX": "bg-indigo-500/20 text-indigo-500",
        "Career": "bg-purple-500/20 text-purple-500",
        "Tools": "bg-gray-500/20 text-gray-500"
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white py-12 px-4">
            <div className="container mx-auto max-w-5xl">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-yellow-500 mb-6">
                    {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
                </h1>

                <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none mb-8">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Blog Editor</span>
                            <div className="flex gap-2">
                                <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                                    Cancel
                                </Button>
                                <Button
                                    variant="default"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleSubmit("draft")}
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Draft
                                </Button>
                                <Button
                                    className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white"
                                    onClick={() => handleSubmit("publish")}
                                >
                                    Publish
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
                                        >
                                            {blogData.category || "Select a category"}
                                            <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[200px] bg-gray-800 border-white/20 text-white">
                                        {categories.map(category => (
                                            <DropdownMenuItem
                                                key={category}
                                                className="hover:bg-gray-700 cursor-pointer"
                                                onClick={() => setBlogData(prev => ({ ...prev, category }))}
                                            >
                                                <span className={`w-2 h-2 rounded-full mr-2 ${categoryColors[category]?.split(' ')[0] || 'bg-gray-500'}`}></span>
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
                                    />
                                    <Button
                                        variant="outline"
                                        className="border-white/20 text-white"
                                        onClick={handleAddTag}
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
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="bg-white bg-opacity-10 border-white/20 text-white mt-1"
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
                                                >
                                                    <Bold className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-white"
                                                    onClick={() => insertFormatting("italic")}
                                                >
                                                    <Italic className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-white"
                                                    onClick={() => insertFormatting("h1")}
                                                >
                                                    <Heading1 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-white"
                                                    onClick={() => insertFormatting("h2")}
                                                >
                                                    <Heading2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-white"
                                                    onClick={() => insertFormatting("list")}
                                                >
                                                    <List className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-white"
                                                    onClick={() => insertFormatting("ordered-list")}
                                                >
                                                    <ListOrdered className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-white"
                                                    onClick={() => insertFormatting("code")}
                                                >
                                                    <Code className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-white"
                                                    onClick={() => insertFormatting("quote")}
                                                >
                                                    <Quote className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-white"
                                                    onClick={() => insertFormatting("link")}
                                                >
                                                    <LinkIcon className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-white"
                                                    onClick={() => insertFormatting("image")}
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
                                        />
                                    </TabsContent>

                                    <TabsContent value="preview">
                                        <div className="min-h-[400px] p-4 bg-white bg-opacity-10 border border-white/20 rounded-md overflow-y-auto prose prose-invert max-w-none">
                                            {previewHTML ? (
                                                <div dangerouslySetInnerHTML={{ __html: previewHTML }} />
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
                            {blogData.category && (
                                <Badge className={categoryColors[blogData.category]}>
                                    {blogData.category}
                                </Badge>
                            )}
                            <p className="ml-2 text-gray-300">
                                {blogData.isDraft ? "Draft" : "Ready to publish"}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                                Cancel
                            </Button>
                            <Button
                                variant="default"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleSubmit("draft")}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Save Draft
                            </Button>
                            <Button
                                className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white"
                                onClick={() => handleSubmit("publish")}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Publish
                            </Button>
                        </div>
                    </CardFooter>
                </Card>

                {/* Markdown Cheatsheet Card */}
                <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none">
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
                </Card>
            </div>
        </div>
    );
}

export default BlogEditor;