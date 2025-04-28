package org.doctech.blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
// import org.doctech.blog.model.BlogCategory; - not using enum anymore
import org.doctech.blog.model.BlogStatus;

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
    private String categoryName = "GENERAL";

    @PositiveOrZero(message = "Points cost must be zero or positive")
    private Integer pointsCost;

    // Replace boolean published with status enum
    @Builder.Default
    private BlogStatus status = BlogStatus.DRAFT;

    // Add a rejectionReason field
    private String rejectionReason;

    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdatedAt;

    private boolean hasLiked;

    // Helper method for backward compatibility
    public boolean isPublished() {
        return status == BlogStatus.PUBLISHED;
    }

    public boolean isHasLiked() {
        return hasLiked;
    }

    public void setHasLiked(boolean hasLiked) {
        this.hasLiked = hasLiked;
    }
}