package org.doctech.blog.service;

import lombok.RequiredArgsConstructor;
import org.doctech.blog.model.CustomBlogCategory;
import org.doctech.blog.repository.CustomBlogCategoryRepository;
import org.doctech.common.exception.IllegalOperationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class BlogCategoryServiceImpl implements BlogCategoryService {

    private final CustomBlogCategoryRepository customRepo;

    @Override
    public String createCategory(String categoryName) {
        if (categoryName == null || categoryName.trim().isEmpty()) {
            throw new IllegalArgumentException("Category name cannot be empty");
        }

        String normalizedName = categoryName.trim().toUpperCase();

        if (customRepo.existsByName(normalizedName)) {
            return normalizedName;
        }

        CustomBlogCategory newCategory = CustomBlogCategory.builder().name(normalizedName).build();
        customRepo.save(newCategory);
        return normalizedName;
    }

    @Override
    public void deleteCategory(String categoryName) {
        if (categoryName == null || categoryName.trim().isEmpty()) {
            throw new IllegalArgumentException("Category name cannot be empty");
        }

        String normalizedName = categoryName.trim().toUpperCase();

        CustomBlogCategory category = customRepo.findByName(normalizedName)
                .orElseThrow(() -> new IllegalOperationException("Category not found: " + normalizedName));

        customRepo.delete(category);
    }

    @Override
    public String updateCategory(String oldName, String newName) {
        if (oldName == null || oldName.trim().isEmpty()) {
            throw new IllegalArgumentException("Old category name cannot be empty");
        }

        if (newName == null || newName.trim().isEmpty()) {
            throw new IllegalArgumentException("New category name cannot be empty");
        }

        String normalizedOldName = oldName.trim().toUpperCase();
        String normalizedNewName = newName.trim().toUpperCase();

        if (customRepo.existsByName(normalizedNewName)) {
            throw new IllegalOperationException("Category already exists: " + normalizedNewName);
        }

        CustomBlogCategory category = customRepo.findByName(normalizedOldName)
                .orElseThrow(() -> new IllegalOperationException("Category not found: " + normalizedOldName));

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

    @Override
    public Optional<CustomBlogCategory> getCategoryByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return Optional.empty();
        }

        return customRepo.findByName(name.trim().toUpperCase());
    }

    @Override
    @Transactional
    public void createDefaultCategoriesIfNeeded() {
        if (customRepo.count() == 0) {
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