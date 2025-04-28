package org.doctech.blog.controller;

import lombok.RequiredArgsConstructor;
import org.doctech.blog.service.BlogCategoryService;
import org.doctech.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller for admin blog category operations
 */
@RestController
@RequestMapping("/blogs/admin/blog-categories")
@RequiredArgsConstructor
public class BlogCategoryAdminController {

    private final BlogCategoryService blogCategoryService;

    /**
     * Create a new blog category
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> createCategory(@RequestBody Map<String, String> request) {
        String categoryName = request.get("name");
        String createdName = blogCategoryService.createCategory(categoryName);
        return ResponseEntity.ok(new ApiResponse(true, "Blog category created successfully", createdName));
    }

    /**
     * Delete a blog category
     */
    @DeleteMapping("/{categoryName}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteCategory(@PathVariable String categoryName) {
        blogCategoryService.deleteCategory(categoryName);
        return ResponseEntity.ok(new ApiResponse(true, "Blog category deleted successfully", null));
    }
}
