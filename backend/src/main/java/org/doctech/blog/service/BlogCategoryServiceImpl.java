package org.doctech.blog.service;

import lombok.RequiredArgsConstructor;
import org.doctech.blog.model.CustomBlogCategory;
import org.doctech.blog.repository.CustomBlogCategoryRepository;
import org.doctech.common.exception.IllegalOperationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Implementation of BlogCategoryService
 */
@Service
@RequiredArgsConstructor
@Transactional
public class BlogCategoryServiceImpl implements BlogCategoryService {

    private final CustomBlogCategoryRepository customRepo;

    /**
     * Create a new blog category
     */
    @Override
    public String createCategory(String categoryName) {
        // Validate category name
        if (categoryName == null || categoryName.trim().isEmpty()) {
            throw new IllegalArgumentException("Category name cannot be empty");
        }
        
        // Convert to uppercase for consistent format
        String normalizedName = categoryName.trim().toUpperCase();
        
        // Check if a category with same name already exists
        if (customRepo.existsByName(normalizedName)) {
            return normalizedName;
        }

        // Persist new category
        CustomBlogCategory newCategory = CustomBlogCategory.builder().name(normalizedName).build();
        customRepo.save(newCategory);
        return normalizedName;
    }
    
    /**
     * Delete a blog category
     */
    @Override
    public void deleteCategory(String categoryName) {
        // Validate category name
        if (categoryName == null || categoryName.trim().isEmpty()) {
            throw new IllegalArgumentException("Category name cannot be empty");
        }
        
        // Convert to uppercase for consistent format
        String normalizedName = categoryName.trim().toUpperCase();
        
        // Find the category
        CustomBlogCategory category = customRepo.findByName(normalizedName)
                .orElseThrow(() -> new IllegalOperationException("Category not found: " + normalizedName));
        
        // Delete the category
        customRepo.delete(category);
    }

    /**
     * Update an existing category name
     */
    @Override
    public String updateCategory(String oldName, String newName) {
        // Validate old name
        if (oldName == null || oldName.trim().isEmpty()) {
            throw new IllegalArgumentException("Old category name cannot be empty");
        }
        
        // Validate new name
        if (newName == null || newName.trim().isEmpty()) {
            throw new IllegalArgumentException("New category name cannot be empty");
        }
        
        // Convert to uppercase for consistent format
        String normalizedOldName = oldName.trim().toUpperCase();
        String normalizedNewName = newName.trim().toUpperCase();
        
        // Check if the new name already exists
        if (customRepo.existsByName(normalizedNewName)) {
            throw new IllegalOperationException("Category already exists: " + normalizedNewName);
        }
        
        // Find the category to update
        CustomBlogCategory category = customRepo.findByName(normalizedOldName)
                .orElseThrow(() -> new IllegalOperationException("Category not found: " + normalizedOldName));
        
        // Update the category name
        category.setName(normalizedNewName);
        customRepo.save(category);
        
        return normalizedNewName;
    }

    @Override
    public List<String> getAllCategories() {
        return customRepo.findAll()
                .stream()
                .map(CustomBlogCategory::getName)
                .toList();
    }
    
    /**
     * Get a category by name
     */
    @Override
    public Optional<CustomBlogCategory> getCategoryByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return Optional.empty();
        }
        
        return customRepo.findByName(name.trim().toUpperCase());
    }
    
    /**
     * Create default categories if none exist
     */
    @Override
    @Transactional
    public void createDefaultCategoriesIfNeeded() {
        if (customRepo.count() == 0) {
            // Create default categories
            List<String> defaults = List.of(
                "GENERAL", 
                "TECHNOLOGY", 
                "PROGRAMMING", 
                "DESIGN", 
                "CAREER", 
                "TUTORIAL", 
                "REVIEW", 
                "NEWS", 
                "PROJECT_SHOWCASE", 
                "COMMUNITY"
            );
            
            for (String category : defaults) {
                if (!customRepo.existsByName(category)) {
                    customRepo.save(CustomBlogCategory.builder().name(category).build());
                }
            }
        }
    }
}
