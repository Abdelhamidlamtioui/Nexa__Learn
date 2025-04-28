package org.doctech.blog.repository;

import java.util.Optional;
import org.doctech.blog.model.CustomBlogCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for custom blog categories
 */
@Repository
public interface CustomBlogCategoryRepository extends JpaRepository<CustomBlogCategory, Long> {
    
    /**
     * Find a custom category by its name
     * @param name the category name
     * @return optional containing the custom category or empty if not found
     */
    Optional<CustomBlogCategory> findByName(String name);
    
    /**
     * Check if a custom category with the given name exists
     * @param name the category name
     * @return true if exists, false otherwise
     */
    boolean existsByName(String name);
}
