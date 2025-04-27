package org.doctech.blog.service;

import lombok.RequiredArgsConstructor;
import org.doctech.blog.dto.BlogDTO;
import org.doctech.blog.mapper.BlogMapper;
import org.doctech.blog.model.Blog;
import org.doctech.blog.model.BlogStatus;
import org.doctech.blog.repository.BlogRepository;
import org.doctech.common.exception.BlogNotFoundException;
import org.doctech.common.exception.IllegalOperationException;
import org.doctech.common.exception.UserNotFoundException;
import org.doctech.common.utils.ValidationUtils;
import org.doctech.security.model.SecurityUser;
import org.doctech.user.model.User;
import org.doctech.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Implementation of BlogService for blog operations
 */
@Service
@RequiredArgsConstructor
@Transactional
public class BlogServiceImpl implements BlogService {

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final BlogMapper blogMapper;
    private final BlogLikeService blogLikeService;

    @Override
    public BlogDTO createBlog(BlogDTO blogDTO) {
        ValidationUtils.validate(blogDTO);

        User author = userRepository.findById(blogDTO.getAuthorId())
                .orElseThrow(() -> new UserNotFoundException("Author not found with id: " + blogDTO.getAuthorId()));

        Blog blog = blogMapper.toEntity(blogDTO);
        blog.setAuthor(author);

        // All new blogs start as drafts
        blog.setStatus(BlogStatus.DRAFT);

        Blog savedBlog = blogRepository.save(blog);
        return blogMapper.toDTO(savedBlog);
    }

    @Override
    public BlogDTO updateBlog(UUID id, BlogDTO blogDTO) {
        Blog blog = findBlogById(id);
        validateBlogUpdateEligibility(id);

        blog.setTitle(blogDTO.getTitle());
        blog.setContent(blogDTO.getContent());
        blog.setTags(blogDTO.getTags());
        blog.setPointsCost(blogDTO.getPointsCost());
        blog.setCategory(blogDTO.getCategory());

        // If status was updated, update it
        if (blogDTO.getStatus() != null) {
            blog.setStatus(blogDTO.getStatus());
        }

        Blog updatedBlog = blogRepository.save(blog);
        return blogMapper.toDTO(updatedBlog);
    }

    @Override
    public void deleteBlog(UUID id) {
        if (!blogRepository.existsById(id)) {
            throw new BlogNotFoundException("Blog not found with id: " + id);
        }
        blogRepository.deleteById(id);
    }

    @Override
    public BlogDTO publishBlog(UUID id) {
        Blog blog = findBlogById(id);

        if (blog.getStatus() == BlogStatus.PUBLISHED) {
            throw new IllegalStateException("Blog is already published");
        }

        // Only approved blogs or admin-created blogs can be published directly
        if (blog.getStatus() != BlogStatus.PENDING && blog.getStatus() != BlogStatus.DRAFT) {
            throw new IllegalStateException("Only pending or draft blogs can be published");
        }

        blog.publish();
        Blog savedBlog = blogRepository.save(blog);
        return blogMapper.toDTO(savedBlog);
    }

    @Override
    public BlogDTO submitForReview(UUID id) {
        Blog blog = findBlogById(id);

        if (blog.getStatus() != BlogStatus.DRAFT) {
            throw new IllegalStateException("Only draft blogs can be submitted for review");
        }

        blog.submitForReview();
        Blog savedBlog = blogRepository.save(blog);
        return blogMapper.toDTO(savedBlog);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public BlogDTO approveBlog(UUID id) {
        Blog blog = findBlogById(id);

        if (blog.getStatus() != BlogStatus.PENDING) {
            throw new IllegalStateException("Only pending blogs can be approved");
        }

        blog.publish();
        Blog savedBlog = blogRepository.save(blog);
        return blogMapper.toDTO(savedBlog);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public BlogDTO rejectBlog(UUID id, String reason) {
        Blog blog = findBlogById(id);

        if (blog.getStatus() != BlogStatus.PENDING) {
            throw new IllegalStateException("Only pending blogs can be rejected");
        }

        blog.reject(reason);
        Blog savedBlog = blogRepository.save(blog);
        return blogMapper.toDTO(savedBlog);
    }

    @Override
    @Transactional(readOnly = true)
    public BlogDTO getBlogById(UUID id, UUID currentUserId) {
        Blog blog = findBlogById(id);
        BlogDTO blogDTO = blogMapper.toDTO(blog);

        if (currentUserId != null) {
            blogDTO.setHasLiked(blogLikeService.hasUserLikedBlog(id, currentUserId));
        }

        return blogDTO;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BlogDTO> getAllBlogs(Pageable pageable, UUID currentUserId) {
        // Check if we're sorting by likes
        if (pageable.getSort().stream()
                .anyMatch(order -> order.getProperty().equals("likes"))) {

            // Create a new pageable without the sort
            Pageable pageableWithoutSort = PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize()
            );

            // Use the custom query method for sorting by likes
            return blogRepository.findAllByOrderByLikesDesc(pageableWithoutSort)
                    .map(blog -> enrichDTOWithLikeStatus(blog, currentUserId));
        }

        // Use the default method for other sorts
        return blogRepository.findAll(pageable)
                .map(blog -> enrichDTOWithLikeStatus(blog, currentUserId));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BlogDTO> getPublishedBlogs(Pageable pageable, UUID currentUserId) {
        return blogRepository.findByStatus(BlogStatus.PUBLISHED, pageable)
                .map(blog -> enrichDTOWithLikeStatus(blog, currentUserId));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BlogDTO> getBlogsByStatus(BlogStatus status, Pageable pageable, UUID currentUserId) {
        return blogRepository.findByStatus(status, pageable)
                .map(blog -> enrichDTOWithLikeStatus(blog, currentUserId));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BlogDTO> getBlogsByAuthor(UUID authorId, Pageable pageable) {
        validateAuthorExists(authorId);
        return blogRepository.findByAuthorId(authorId, pageable)
                .map(blogMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BlogDTO> getBlogsByTag(String tag, Pageable pageable, UUID currentUserId) {
        return blogRepository.findByTagAndStatus(tag, BlogStatus.PUBLISHED, pageable)
                .map(blog -> enrichDTOWithLikeStatus(blog, currentUserId));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BlogDTO> searchBlogs(String query, Pageable pageable, UUID currentUserId) {
        return blogRepository.searchPublished(query, pageable)
                .map(blog -> enrichDTOWithLikeStatus(blog, currentUserId));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BlogDTO> getMostPopularBlogs(Pageable pageable, UUID currentUserId) {
        return blogRepository.findByStatusOrderByLikesDesc(BlogStatus.PUBLISHED, pageable)
                .map(blog -> enrichDTOWithLikeStatus(blog, currentUserId));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    @Transactional(readOnly = true)
    public Page<BlogDTO> getPendingBlogs(Pageable pageable) {
        return blogRepository.findByStatus(BlogStatus.PENDING, pageable)
                .map(blogMapper::toDTO);
    }

    @Override
    public boolean isAuthorOrAdmin(UUID blogId, Object principal) {
        Blog blog = findBlogById(blogId);
        SecurityUser securityUser = (SecurityUser) principal;

        return blog.getAuthor().getId().equals(securityUser.getId()) ||
                securityUser.getAuthorities().stream()
                        .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN") ||
                                auth.getAuthority().equals("ROLE_MODERATOR"));
    }

    @Override
    public void validateBlogUpdateEligibility(UUID blogId) {
        Blog blog = findBlogById(blogId);
        if (blog.getStatus() == BlogStatus.PUBLISHED) {
            throw new IllegalOperationException("Published blogs cannot be updated");
        }
    }

    // Helper methods

    private Blog findBlogById(UUID id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new BlogNotFoundException("Blog not found with id: " + id));
    }

    private void validateAuthorExists(UUID authorId) {
        if (!userRepository.existsById(authorId)) {
            throw new UserNotFoundException("Author not found with id: " + authorId);
        }
    }

    private BlogDTO enrichDTOWithLikeStatus(Blog blog, UUID userId) {
        BlogDTO dto = blogMapper.toDTO(blog);

        if (userId != null) {
            dto.setHasLiked(blogLikeService.hasUserLikedBlog(blog.getId(), userId));
        } else {
            dto.setHasLiked(false);
        }

        return dto;
    }
}