package org.doctech.blog.repository;

import java.util.Optional;
import org.doctech.blog.model.CustomBlogCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomBlogCategoryRepository extends JpaRepository<CustomBlogCategory, Long> {
    Optional<CustomBlogCategory> findByName(String name);
    boolean existsByName(String name);
}