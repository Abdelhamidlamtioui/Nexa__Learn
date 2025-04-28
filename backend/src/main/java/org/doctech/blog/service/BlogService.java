package org.doctech.blog.service;

import org.doctech.blog.dto.BlogDTO;
import org.doctech.blog.model.BlogStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

/**
 * Service interface for blog operations
 */
public interface BlogService {
    /**
     * Creates a new blog
     */
    BlogDTO createBlog(BlogDTO blogDTO);

    /**
     * Updates an existing blog
     */
    BlogDTO updateBlog(UUID id, BlogDTO blogDTO);

    /**
     * Retrieves a blog by its ID
     */
    BlogDTO getBlogById(UUID id, UUID currentUserId);

    /**
     * Retrieves all blogs
     */
    Page<BlogDTO> getAllBlogs(Pageable pageable, UUID currentUserId);

    /**
     * Retrieves only published blogs
     */
    Page<BlogDTO> getPublishedBlogs(Pageable pageable, UUID currentUserId);

    /**
     * Retrieves blogs by status
     */
    Page<BlogDTO> getBlogsByStatus(BlogStatus status, Pageable pageable, UUID currentUserId);

    /**
     * Retrieves blogs by a specific author
     */
    Page<BlogDTO> getBlogsByAuthor(UUID authorId, Pageable pageable);

    /**
     * Retrieves blogs by tag
     */
    Page<BlogDTO> getBlogsByTag(String tag, Pageable pageable, UUID currentUserId);

    /**
     * Publishes a blog
     */
    BlogDTO publishBlog(UUID id);

    /**
     * Submits a blog for review
     */
    BlogDTO submitForReview(UUID id);

    /**
     * Approves a blog that was pending review
     */
    BlogDTO approveBlog(UUID id);

    /**
     * Rejects a blog that was pending review
     */
    BlogDTO rejectBlog(UUID id, String reason);

    /**
     * Retrieves the most popular blogs by likes
     */
    Page<BlogDTO> getMostPopularBlogs(Pageable pageable, UUID currentUserId);

    /**
     * Retrieves blogs pending review for admin approval
     */
    Page<BlogDTO> getPendingBlogs(Pageable pageable);

    /**
     * Deletes a blog
     */
    void deleteBlog(UUID id);

    /**
     * Searches for blogs matching the query
     */
    Page<BlogDTO> searchBlogs(String query, Pageable pageable, UUID currentUserId);

    /**
     * Checks if a user is the author of a blog or an admin
     */
    boolean isAuthorOrAdmin(UUID blogId, Object principal);

    /**
     * Validates if a blog can be updated
     */
    void validateBlogUpdateEligibility(UUID blogId);
    
    /**
     * Counts blogs by status
     */
    long countBlogsByStatus(BlogStatus status);
}