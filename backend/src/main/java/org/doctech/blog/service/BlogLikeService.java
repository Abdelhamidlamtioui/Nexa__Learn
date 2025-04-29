package org.doctech.blog.service;

import org.doctech.blog.dto.BlogDTO;

import java.util.UUID;

/**
 * Service interface for blog like operations
 */
public interface BlogLikeService {
    java.util.List<UUID> getLikedBlogIdsByUserId(UUID userId);
    /**
     * Toggles a like on a blog for a specific user
     * @param blogId The ID of the blog to toggle like on
     * @param userId The ID of the user toggling the like
     * @return Updated BlogDTO with like information
     */
    BlogDTO toggleLike(UUID blogId, UUID userId);

    /**
     * Checks if a user has liked a specific blog
     * @param blogId The ID of the blog
     * @param userId The ID of the user
     * @return True if the user has liked the blog, false otherwise
     */
    boolean hasUserLikedBlog(UUID blogId, UUID userId);

    /**
     * Gets the count of likes for a specific blog
     * @param blogId The ID of the blog
     * @return Count of likes
     */
    int getLikeCount(UUID blogId);
}