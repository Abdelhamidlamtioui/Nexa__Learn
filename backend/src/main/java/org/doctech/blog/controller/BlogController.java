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
import java.util.UUID;

/**
 * REST Controller for blog operations
 */
@RestController
@RequestMapping("/blogs")
@RequiredArgsConstructor
public class BlogController {

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
}