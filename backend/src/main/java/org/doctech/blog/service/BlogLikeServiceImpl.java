package org.doctech.blog.service;

import lombok.RequiredArgsConstructor;
import org.doctech.blog.dto.BlogDTO;
import org.doctech.blog.mapper.BlogMapper;
import org.doctech.blog.model.Blog;
import org.doctech.blog.repository.BlogLikesRepository;
import org.doctech.blog.repository.BlogRepository;
import org.doctech.common.exception.BlogNotFoundException;
import org.doctech.common.exception.UserNotFoundException;
import org.doctech.user.model.User;
import org.doctech.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Implementation of BlogLikeService for like operations
 */
@Service
@RequiredArgsConstructor
@Transactional
public class BlogLikeServiceImpl implements BlogLikeService {
    @Override
    @Transactional(readOnly = true)
    public java.util.List<UUID> getLikedBlogIdsByUserId(UUID userId) {
        return blogLikesRepository.findLikedBlogIdsByUserId(userId);
    }

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final BlogLikesRepository blogLikesRepository;
    private final BlogMapper blogMapper;

    @Override
    @Transactional
    public BlogDTO toggleLike(UUID blogId, UUID userId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new BlogNotFoundException("Blog not found with id: " + blogId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        boolean newLikeState = blog.toggleLike(user);
        Blog updatedBlog = blogRepository.save(blog);

        BlogDTO dto = blogMapper.toDTO(updatedBlog);
        dto.setHasLiked(newLikeState);

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasUserLikedBlog(UUID blogId, UUID userId) {
        return blogLikesRepository.existsByBlogIdAndUserId(blogId, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public int getLikeCount(UUID blogId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new BlogNotFoundException("Blog not found with id: " + blogId));
        return blog.getLikesCount();
    }
}