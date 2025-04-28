package org.doctech.blog.model;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Enum representing blog categories
 */
public enum BlogCategory {
    GENERAL,
    TECHNOLOGY,
    PROGRAMMING,
    DESIGN,
    CAREER,
    TUTORIAL,
    REVIEW,
    NEWS,
    PROJECT_SHOWCASE,
    COMMUNITY;
    
    /**
     * Get a list of all available category names
     */
    public static List<String> getAvailableCategories() {
        return Arrays.stream(BlogCategory.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }
}