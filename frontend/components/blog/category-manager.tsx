import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { blogService } from "@/services/api";
import { Loader } from "lucide-react";

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
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    // Note: Since categories are managed as a Java enum,
    // we can't truly add/delete them at runtime without recompiling the backend.
    // This component only displays the available categories.

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-yellow-500 mb-6">
                    Blog Categories
                </h1>
                
                <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none mb-8">
                    <CardHeader>
                        <CardTitle>Available Categories</CardTitle>
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
                                        className="p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                                    >
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
                        
                        <div className="flex justify-center mt-8">
                            <div className="bg-amber-500/20 text-amber-500 p-4 rounded-lg max-w-md text-center">
                                <p className="text-sm">
                                    Note: Categories are defined in the backend as Java enum values.
                                    To add new categories, the backend code must be modified and recompiled.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
