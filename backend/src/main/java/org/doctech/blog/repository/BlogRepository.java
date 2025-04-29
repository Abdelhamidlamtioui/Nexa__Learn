package org.doctech.blog.repository;

import org.doctech.blog.model.Blog;
import org.doctech.blog.model.BlogStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BlogRepository extends JpaRepository<Blog, UUID> {
    @Query("SELECT b FROM Blog b WHERE b.id IN :blogIds")
    Page<Blog> findByIdIn(@Param("blogIds") List<UUID> blogIds, Pageable pageable);

    Page<Blog> findByAuthorId(UUID authorId, Pageable pageable);

    // Replace findByPublishedTrue with findByStatus
    Page<Blog> findByStatus(BlogStatus status, Pageable pageable);
    @Query("SELECT b FROM Blog b WHERE :tag MEMBER OF b.tags AND b.status = :status")
    Page<Blog> findByTagAndStatus(String tag, BlogStatus status, Pageable pageable);

    // Update popular blogs query to filter by status
    @Query("SELECT b FROM Blog b WHERE b.status = :status ORDER BY b.likes DESC")
    Page<Blog> findByStatusOrderByLikesDesc(BlogStatus status, Pageable pageable);

    // Keep this for backward compatibility
    @Query("SELECT b FROM Blog b ORDER BY b.likes DESC")
    Page<Blog> findAllByOrderByLikesDesc(Pageable pageable);

    // Update search to filter by published status
    @Query("SELECT b FROM Blog b WHERE b.status = org.doctech.blog.model.BlogStatus.PUBLISHED AND " +
            "(LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.content) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Blog> searchPublished(@Param("query") String query, Pageable pageable);

    // New method to search all blogs (for admins)
    @Query("SELECT b FROM Blog b WHERE " +
            "(LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.content) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Blog> searchAll(@Param("query") String query, Pageable pageable);

    long countByAuthorId(UUID authorId);

    // Count blogs by status
    long countByStatus(BlogStatus status);
}