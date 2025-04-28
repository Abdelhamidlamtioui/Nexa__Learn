package org.doctech.blog.service;

import org.doctech.blog.model.CustomBlogCategory;
import java.util.List;
import java.util.Optional;

public interface BlogCategoryService {
    String createCategory(String categoryName);
    void deleteCategory(String categoryName);
    String updateCategory(String oldName, String newName);
    List<String> getAllCategories();
    Optional<CustomBlogCategory> getCategoryByName(String name);
    void createDefaultCategoriesIfNeeded();
}