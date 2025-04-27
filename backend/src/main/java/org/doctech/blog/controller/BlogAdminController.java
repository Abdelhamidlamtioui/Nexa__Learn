package org.doctech.blog.controller;

import lombok.RequiredArgsConstructor;
import org.doctech.blog.dto.BlogDTO;
import org.doctech.blog.model.BlogStatus;
import org.doctech.blog.service.BlogService;
import org.doctech.common.dto.ApiResponse;
import org.doctech.common.dto.PagedResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * REST Controller for blog administration and moderation
 */
@RestController
@RequestMapping("/admin/blogs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
public class BlogAdminController {

    private final BlogService blogService;

    /**
     * Get all pending blogs that need approval
     */
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse> getPendingBlogs(Pageable pageable) {
        Page<BlogDTO> blogs = blogService.getPendingBlogs(pageable);
        PagedResponse<BlogDTO> response = PagedResponse.of(blogs.getContent(), blogs);
        return ResponseEntity.ok(new ApiResponse(true, "Pending blogs retrieved successfully", response));
    }

    /**
     * Get all blogs with specific status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse> getBlogsByStatus(
            @PathVariable BlogStatus status,
            Pageable pageable) {
        Page<BlogDTO> blogs = blogService.getBlogsByStatus(status, pageable, null);
        PagedResponse<BlogDTO> response = PagedResponse.of(blogs.getContent(), blogs);
        return ResponseEntity.ok(new ApiResponse(true, "Blogs retrieved successfully", response));
    }

    /**
     * Approve a pending blog
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse> approveBlog(@PathVariable UUID id) {
        return ResponseEntity.ok(new ApiResponse(true, "Blog approved successfully",
                blogService.approveBlog(id)));
    }

    /**
     * Reject a pending blog
     */
    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse> rejectBlog(
            @PathVariable UUID id,
            @RequestBody Map<String, String> payload) {

        String reason = payload.getOrDefault("reason", "No reason provided");
        return ResponseEntity.ok(new ApiResponse(true, "Blog rejected successfully",
                blogService.rejectBlog(id, reason)));
    }

    /**
     * Get blog statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse> getBlogStats() {
        Map<String, Long> stats = Map.of(
                "DRAFT", blogService.getBlogsByStatus(BlogStatus.DRAFT, Pageable.unpaged(), null).getTotalElements(),
                "PENDING", blogService.getBlogsByStatus(BlogStatus.PENDING, Pageable.unpaged(), null).getTotalElements(),
                "PUBLISHED", blogService.getBlogsByStatus(BlogStatus.PUBLISHED, Pageable.unpaged(), null).getTotalElements(),
                "REJECTED", blogService.getBlogsByStatus(BlogStatus.REJECTED, Pageable.unpaged(), null).getTotalElements(),
                "ARCHIVED", blogService.getBlogsByStatus(BlogStatus.ARCHIVED, Pageable.unpaged(), null).getTotalElements()
        );

        return ResponseEntity.ok(new ApiResponse(true, "Blog statistics retrieved successfully", stats));
    }
}