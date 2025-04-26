package org.doctech.blog.controller;

import lombok.RequiredArgsConstructor;
import org.doctech.blog.model.BlogCategory;
import org.doctech.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

/**
 * REST Controller for blog category operations
 */
@RestController
@RequestMapping("/blog-categories")
@RequiredArgsConstructor
public class BlogCategoryController {

    /**
     * Get all available blog categories
     */
    @GetMapping
    public ResponseEntity<ApiResponse> getAllCategories() {
        List<BlogCategory> categories = Arrays.asList(BlogCategory.values());
        return ResponseEntity.ok(new ApiResponse(true, "Blog categories retrieved successfully", categories));
    }
}
