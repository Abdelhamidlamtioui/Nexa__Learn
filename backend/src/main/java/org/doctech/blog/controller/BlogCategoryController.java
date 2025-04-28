package org.doctech.blog.controller;

import lombok.RequiredArgsConstructor;
import org.doctech.blog.service.BlogCategoryService;
import org.doctech.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST Controller for blog category operations
 */
@RestController
@RequestMapping("/blog-categories")
@RequiredArgsConstructor
public class BlogCategoryController {

    private final BlogCategoryService blogCategoryService;

    /**
     * Get all available blog categories
     */
    @GetMapping
    public ResponseEntity<ApiResponse> getAllCategories() {
        List<String> categories = blogCategoryService.getAllCategories();
        return ResponseEntity.ok(new ApiResponse(true, "Blog categories retrieved successfully", categories));
    }
}
