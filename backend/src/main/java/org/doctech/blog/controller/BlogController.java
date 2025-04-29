package org.doctech.blog.controller;

import lombok.RequiredArgsConstructor;
import org.doctech.blog.dto.BlogDTO;
import org.doctech.blog.model.BlogStatus;
import org.doctech.blog.service.BlogLikeService;
import org.doctech.blog.service.BlogService;
import org.doctech.common.dto.ApiResponse;
import org.doctech.common.dto.PagedResponse;
import org.doctech.security.model.SecurityUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * REST Controller for blog operations
 */
@RestController
@RequestMapping("/blogs")
@RequiredArgsConstructor
public class BlogController {

    @GetMapping("/liked")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse> getLikedBlogs(Pageable pageable, Authentication authentication) {
        SecurityUser securityUser = (SecurityUser) authentication.getPrincipal();
        java.util.List<UUID> likedBlogIds = blogLikeService.getLikedBlogIdsByUserId(securityUser.getId());
        Page<BlogDTO> blogs = blogService.getBlogsByIds(likedBlogIds, pageable, securityUser.getId());
        org.doctech.common.dto.PagedResponse<BlogDTO> response = org.doctech.common.dto.PagedResponse.of(blogs.getContent(), blogs);
        return ResponseEntity.ok(new ApiResponse(true, "Liked blogs retrieved successfully", response));
    }

    private final BlogService blogService;
    private final BlogLikeService blogLikeService;

    // Blog Creation and Management
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse> createBlog(
            @Valid @RequestBody BlogDTO blogDTO,
            Authentication authentication) {
        SecurityUser securityUser = (SecurityUser) authentication.getPrincipal();
        blogDTO.setAuthorId(securityUser.getId());

        // Set initial status as DRAFT
        blogDTO.setStatus(BlogStatus.DRAFT);

        BlogDTO createdBlog = blogService.createBlog(blogDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Blog created successfully", createdBlog));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@blogService.isAuthorOrAdmin(#id, authentication.principal)")
    public ResponseEntity<ApiResponse> updateBlog(
            @PathVariable UUID id,
            @Valid @RequestBody BlogDTO blogDTO,
            Authentication authentication) {
        SecurityUser securityUser = (SecurityUser) authentication.getPrincipal();
        blogDTO.setAuthorId(securityUser.getId());

        BlogDTO updatedBlog = blogService.updateBlog(id, blogDTO);
        return ResponseEntity.ok(new ApiResponse(
                true,
                "Blog updated successfully",
                updatedBlog));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@blogService.isAuthorOrAdmin(#id, principal)")
    public ResponseEntity<ApiResponse> deleteBlog(@PathVariable UUID id) {
        blogService.deleteBlog(id);
        return ResponseEntity.ok(new ApiResponse(true, "Blog deleted successfully", null));
    }

    // Blog Publishing
    @PostMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<ApiResponse> publishBlog(@PathVariable UUID id) {
        return ResponseEntity.ok(new ApiResponse(true, "Blog published successfully",
                blogService.publishBlog(id)));
    }

    // New endpoint for submitting a blog for review
    @PostMapping("/{id}/submit-for-review")
    @PreAuthorize("@blogService.isAuthorOrAdmin(#id, principal)")
    public ResponseEntity<ApiResponse> submitForReview(@PathVariable UUID id) {
        return ResponseEntity.ok(new ApiResponse(true, "Blog submitted for review",
                blogService.submitForReview(id)));
    }

    // Blog Retrieval
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getBlog(@PathVariable UUID id, Authentication authentication) {
        UUID currentUserId = null;
        if (authentication != null && authentication.getPrincipal() instanceof SecurityUser) {
            currentUserId = ((SecurityUser) authentication.getPrincipal()).getId();
        }

        return ResponseEntity.ok(new ApiResponse(true, "Blog retrieved successfully",
                blogService.getBlogById(id, currentUserId)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllBlogs(Pageable pageable, Authentication authentication) {
        UUID currentUserId = null;
        if (authentication != null && authentication.getPrincipal() instanceof SecurityUser) {
            currentUserId = ((SecurityUser) authentication.getPrincipal()).getId();
        }

        Page<BlogDTO> blogs = blogService.getAllBlogs(pageable, currentUserId);
        PagedResponse<BlogDTO> response = PagedResponse.of(blogs.getContent(), blogs);

        return ResponseEntity.ok(new ApiResponse(true, "Blogs retrieved successfully", response));
    }

    // Legacy endpoint - keeping for backward compatibility
    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<ApiResponse> getAdminPendingBlogs(Pageable pageable) { 
        Page<BlogDTO> blogs = blogService.getPendingBlogs(pageable);
        PagedResponse<BlogDTO> response = PagedResponse.of(blogs.getContent(), blogs);
        return ResponseEntity.ok(new ApiResponse(true, "Pending blogs retrieved successfully", response));
    }

    @GetMapping("/published")
    public ResponseEntity<ApiResponse> getPublishedBlogs(Pageable pageable, Authentication authentication) {
        UUID currentUserId = null;
        if (authentication != null && authentication.getPrincipal() instanceof SecurityUser) {
            currentUserId = ((SecurityUser) authentication.getPrincipal()).getId();
        }

        Page<BlogDTO> blogs = blogService.getPublishedBlogs(pageable, currentUserId);
        PagedResponse<BlogDTO> response = PagedResponse.of(blogs.getContent(), blogs);

        return ResponseEntity.ok(new ApiResponse(true, "Published blogs retrieved successfully", response));
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<ApiResponse> getBlogsByAuthor(
            @PathVariable UUID authorId,
            Pageable pageable) {
        Page<BlogDTO> blogs = blogService.getBlogsByAuthor(authorId, pageable);
        PagedResponse<BlogDTO> response = PagedResponse.of(blogs.getContent(), blogs);

        return ResponseEntity.ok(new ApiResponse(true, "Author's blogs retrieved successfully", response));
    }

    @GetMapping("/my-blogs")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse> getMyBlogs(
            Pageable pageable,
            Authentication authentication) {
        SecurityUser securityUser = (SecurityUser) authentication.getPrincipal();
        Page<BlogDTO> blogs = blogService.getBlogsByAuthor(securityUser.getId(), pageable);
        PagedResponse<BlogDTO> response = PagedResponse.of(blogs.getContent(), blogs);

        return ResponseEntity.ok(new ApiResponse(true, "Your blogs retrieved successfully", response));
    }

    // Blog Engagement
    @PostMapping("/{blogId}/toggle-like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse> toggleLike(
            @PathVariable UUID blogId,
            Authentication authentication) {
        SecurityUser securityUser = (SecurityUser) authentication.getPrincipal();
        BlogDTO updatedBlog = blogLikeService.toggleLike(blogId, securityUser.getId());

        return ResponseEntity.ok(new ApiResponse(
                true,
                "Like status updated successfully",
                updatedBlog
        ));
    }

    // Blog Search and Filtering
    @GetMapping("/tag/{tag}")
    public ResponseEntity<ApiResponse> getBlogsByTag(
            @PathVariable String tag,
            Pageable pageable,
            Authentication authentication) {
        UUID currentUserId = null;
        if (authentication != null && authentication.getPrincipal() instanceof SecurityUser) {
            currentUserId = ((SecurityUser) authentication.getPrincipal()).getId();
        }

        Page<BlogDTO> blogs = blogService.getBlogsByTag(tag, pageable, currentUserId);
        PagedResponse<BlogDTO> response = PagedResponse.of(blogs.getContent(), blogs);

        return ResponseEntity.ok(new ApiResponse(true, "Tagged blogs retrieved successfully", response));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchBlogs(
            @RequestParam String query,
            Pageable pageable,
            Authentication authentication) {
        UUID currentUserId = null;
        if (authentication != null && authentication.getPrincipal() instanceof SecurityUser) {
            currentUserId = ((SecurityUser) authentication.getPrincipal()).getId();
        }

        Page<BlogDTO> blogs = blogService.searchBlogs(query, pageable, currentUserId);
        PagedResponse<BlogDTO> response = PagedResponse.of(blogs.getContent(), blogs);

        return ResponseEntity.ok(new ApiResponse(true, "Search results retrieved successfully", response));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse> getPopularBlogs(Pageable pageable, Authentication authentication) {
        UUID currentUserId = null;
        if (authentication != null && authentication.getPrincipal() instanceof SecurityUser) {
            currentUserId = ((SecurityUser) authentication.getPrincipal()).getId();
        }

        Page<BlogDTO> blogs = blogService.getMostPopularBlogs(pageable, currentUserId);
        PagedResponse<BlogDTO> response = PagedResponse.of(blogs.getContent(), blogs);

        return ResponseEntity.ok(new ApiResponse(true, "Popular blogs retrieved successfully", response));
    }

    // Admin endpoints for blog management

    /**
     * Admin endpoint for approving a blog
     */
    @PostMapping("/admin/blogs/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> approveBlog(@PathVariable UUID id) {
        return ResponseEntity.ok(new ApiResponse(true, "Blog approved and published",
                blogService.publishBlog(id)));
    }

    /**
     * Admin endpoint for rejecting a blog
     */
    @PostMapping("/admin/blogs/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> rejectBlog(
            @PathVariable UUID id,
            @RequestBody Map<String, String> requestBody) {
        String reason = requestBody.get("reason");
        return ResponseEntity.ok(new ApiResponse(true, "Blog rejected",
                blogService.rejectBlog(id, reason)));
    }

    /**
     * Admin endpoint to get blogs with pending status
     */
    @GetMapping("/admin/blogs/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getPendingBlogs(Pageable pageable, Authentication authentication) {
        UUID currentUserId = null;
        if (authentication != null && authentication.getPrincipal() instanceof SecurityUser) {
            currentUserId = ((SecurityUser) authentication.getPrincipal()).getId();
        }
        
        Page<BlogDTO> blogs = blogService.getBlogsByStatus(BlogStatus.PENDING, pageable, currentUserId);
        PagedResponse<BlogDTO> response = PagedResponse.of(blogs.getContent(), blogs);
        
        return ResponseEntity.ok(new ApiResponse(true, "Pending blogs retrieved successfully", response));
    }

    /**
     * Admin endpoint to get blogs by status
     */
    @GetMapping("/admin/blogs/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getBlogsByStatus(
            @PathVariable String status,
            Pageable pageable,
            Authentication authentication) {
        UUID currentUserId = null;
        if (authentication != null && authentication.getPrincipal() instanceof SecurityUser) {
            currentUserId = ((SecurityUser) authentication.getPrincipal()).getId();
        }
        
        BlogStatus blogStatus = BlogStatus.valueOf(status.toUpperCase());
        Page<BlogDTO> blogs = blogService.getBlogsByStatus(blogStatus, pageable, currentUserId);
        PagedResponse<BlogDTO> response = PagedResponse.of(blogs.getContent(), blogs);
        
        return ResponseEntity.ok(new ApiResponse(true, status + " blogs retrieved successfully", response));
    }
    
    /**
     * Admin endpoint to get blog statistics
     */
    @GetMapping("/admin/blogs/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getBlogStats() {
        // Get counts for each status
        Map<BlogStatus, Long> statusCounts = new HashMap<>();
        for (BlogStatus status : BlogStatus.values()) {
            long count = blogService.countBlogsByStatus(status);
            statusCounts.put(status, count);
        }
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", statusCounts.values().stream().mapToLong(Long::longValue).sum());
        stats.put("published", statusCounts.getOrDefault(BlogStatus.PUBLISHED, 0L));
        stats.put("pending", statusCounts.getOrDefault(BlogStatus.PENDING, 0L));
        stats.put("draft", statusCounts.getOrDefault(BlogStatus.DRAFT, 0L));
        stats.put("rejected", statusCounts.getOrDefault(BlogStatus.REJECTED, 0L));
        
        return ResponseEntity.ok(new ApiResponse(true, "Blog statistics retrieved successfully", stats));
    }
}