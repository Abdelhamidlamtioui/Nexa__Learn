import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { blogService } from "@/services/api";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";
import { Loader, Plus, Edit, Trash, AlertCircle, X, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Category to color mapping - same as in other components
const categoryColors = {
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

export function CategoryManager() {
    const { toast } = useToast();
    const { user } = useAuthStore();
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState("");
    
    // Check if user is admin or moderator
    const isAdmin = user && user.roles?.some(role => {
        if (typeof role === 'string') {
            return role === 'ADMIN' || role === 'ROLE_ADMIN' || 
                   role === 'MODERATOR' || role === 'ROLE_MODERATOR';
        } else if (role && typeof role === 'object' && 'name' in role) {
            return role.name === 'ADMIN' || role.name === 'ROLE_ADMIN' || 
                   role.name === 'MODERATOR' || role.name === 'ROLE_MODERATOR';
        }
        return false;
    });

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const response = await blogService.getCategories();
                
                if (response.data && response.data.success) {
                    setCategories(response.data.data);
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to load categories",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast({
                    title: "Error",
                    description: error.response?.data?.message || "Failed to load categories",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, [toast]);

    // Handle adding a new category
    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        
        setIsProcessing(true);
        try {
            const response = await blogService.createCategory(newCategoryName.toUpperCase());
            
            if (response.data && response.data.success) {
                toast({
                    title: "Success",
                    description: "Category added successfully",
                    variant: "default",
                });
                
                // Update categories list
                setCategories([...categories, newCategoryName.toUpperCase()]);
                setNewCategoryName("");
                setDialogOpen(false);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to add category",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error adding category:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to add category",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };
    
    // Open delete confirmation dialog
    const openDeleteConfirmation = (category) => {
        setCategoryToDelete(category);
        setConfirmDeleteOpen(true);
    };
    
    // Handle deleting a category
    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;
        
        setIsProcessing(true);
        try {
            const response = await blogService.deleteCategory(categoryToDelete);
            
            if (response.data && response.data.success) {
                toast({
                    title: "Success",
                    description: "Category deleted successfully",
                    variant: "default",
                });
                
                // Update categories list
                setCategories(categories.filter(c => c !== categoryToDelete));
                setCategoryToDelete("");
                setConfirmDeleteOpen(false);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to delete category",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete category",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div>
            <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Available Categories</CardTitle>
                    {isAdmin && (
                        <Button 
                            onClick={() => setDialogOpen(true)}
                            className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white">
                            <Plus className="h-4 w-4 mr-2" /> Add Category
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader className="animate-spin h-8 w-8 mr-2" />
                            <span>Loading categories...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {categories.map((category, index) => (
                                <div 
                                    key={index} 
                                    className="p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all relative"
                                >
                                    {isAdmin && (
                                        <button 
                                            onClick={() => openDeleteConfirmation(category)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    )}
                                    <Badge className={`${categoryColors[category] || 'bg-gray-500/20 text-gray-500'} px-2 py-1 mb-2`}>
                                        {category}
                                    </Badge>
                                    <p className="text-sm text-gray-300 mt-2">
                                        Used for blogs related to {category.toLowerCase().replace('_', ' ')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {!isAdmin && (
                        <div className="flex justify-center mt-8">
                            <div className="bg-amber-500/20 text-amber-500 p-4 rounded-lg max-w-md text-center">
                                <p className="text-sm">
                                    <AlertCircle className="h-4 w-4 inline-block mr-1" />
                                    Only administrators can add or remove blog categories.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            
            {/* Add Category Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="bg-gray-900 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Create a new category for blog posts.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                        <Label htmlFor="categoryName" className="text-white mb-2 block">
                            Category Name
                        </Label>
                        <Input
                            id="categoryName"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Enter category name (e.g. TECHNOLOGY)"
                            className="bg-gray-800 border-white/10 text-white"
                        />
                        <p className="text-sm text-gray-400 mt-2">
                            Note: Category names should be in uppercase with no spaces. Use underscores for multi-word categories.
                        </p>
                    </div>
                    
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setDialogOpen(false)}
                            className="border-white/20 text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddCategory}
                            disabled={!newCategoryName.trim() || isProcessing}
                            className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white"
                        >
                            {isProcessing ? "Adding..." : "Add Category"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {/* Delete Confirmation Dialog */}
            <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
                <DialogContent className="bg-gray-900 border-white/10 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Are you sure you want to delete the category "{categoryToDelete}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md flex items-start">
                            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">
                                Deleting this category will not affect existing blogs, but it will no longer be available for new blogs. 
                                Consider the impact before proceeding.
                            </p>
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setConfirmDeleteOpen(false)}
                            className="border-white/20 text-white"
                        >
                            <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteCategory}
                            disabled={isProcessing}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isProcessing ? "Deleting..." : (
                                <>
                                    <Trash className="h-4 w-4 mr-1" /> Delete Category
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
