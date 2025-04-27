package org.doctech.blog.model;

/**
 * Represents the possible statuses of a blog post
 */
public enum BlogStatus {
    DRAFT,      // Saved but not submitted for review
    PENDING,    // Submitted for review but not approved yet
    PUBLISHED,  // Approved and publicly viewable
    REJECTED,   // Rejected by moderator/admin
    ARCHIVED    // Previously published but now archived
}