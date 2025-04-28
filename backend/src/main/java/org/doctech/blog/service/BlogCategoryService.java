package org.doctech.blog.service;

import org.doctech.blog.model.CustomBlogCategory;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for blog category operations
 */
public interface BlogCategoryService {
    
    /**
     * Create a new category. If the name matches one of the default enum values
     * it will simply return that name, otherwise a new custom category entry
     * will be persisted.
     * @param categoryName category name in UPPERCASE_WITH_UNDERSCORES format
     * @return canonical category name
     */
    String createCategory(String categoryName);
    
    /**
     * Delete a blog category
     */
    void deleteCategory(String categoryName);
    
    /**
     * Rename an existing category
     * @param oldName existing category name
     * @param newName desired new name
     * @return updated canonical name
     */
    String updateCategory(String oldName, String newName);
    
    /**
     * Retrieve all available categories
     * @return list of category names
     */
    List<String> getAllCategories();
    
    /**
     * Get a category by name
     * @param name the category name
     * @return optional containing the category if found
     */
    Optional<CustomBlogCategory> getCategoryByName(String name);
    
    /**
     * Create default categories if none exist
     */
    void createDefaultCategoriesIfNeeded();
}
