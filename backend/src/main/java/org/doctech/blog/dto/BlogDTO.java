package org.doctech.blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.doctech.blog.model.BlogCategory;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogDTO {
    private UUID id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private UUID authorId;
    private String authorUsername;
    private String authorAvatarUrl;

    @Builder.Default
    private Set<String> tags = new HashSet<>();

    private Integer likes;

    @Builder.Default
    private BlogCategory category = BlogCategory.GENERAL;

    @PositiveOrZero(message = "Points cost must be zero or positive")
    private Integer pointsCost;

    private boolean published;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdatedAt;

    private boolean hasLiked;

    public boolean isHasLiked() {
        return hasLiked;
    }

    public void setHasLiked(boolean hasLiked) {
        this.hasLiked = hasLiked;
    }
}