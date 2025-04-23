package org.doctech.user.service;

import org.doctech.common.exception.*;
import org.doctech.user.dto.UserDTO;
import org.doctech.user.dto.UserStatisticsDTO;
import org.doctech.user.mapper.UserMapper;
import org.doctech.user.model.Role;
import org.doctech.user.model.User;
import org.doctech.user.model.UserRole;
import org.doctech.user.repository.RoleRepository;
import org.doctech.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class   UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;


    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;
    private UserDTO testUserDTO;
    private Role testRole;
    private UUID userId;
    private final String email = "test@example.com";
    private final String username = "testuser";
    private final String password = "password";
    private final String encodedPassword = "encodedPassword";

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();

        testRole = new Role();
        testRole.setId(UUID.randomUUID());
        testRole.setName(UserRole.STUDENT.name());

        testUser = User.builder()
                .id(userId)
                .email(email)
                .username(username)
                .passwordHash(encodedPassword)
                .enabled(true)
                .points(500)
                .level(1)
                .createdAt(LocalDateTime.now().minusDays(30))
                .lastLogin(LocalDateTime.now().minusDays(5))
                .build();
        testUser.addRole(testRole);

        testUserDTO = new UserDTO();
        testUserDTO.setId(userId);
        testUserDTO.setEmail(email);
        testUserDTO.setUsername(username);
        testUserDTO.setEnabled(true);
        testUserDTO.setRoles(Set.of(UserRole.STUDENT.name()));
    }

    @Test
    void registerUser_Success() {
        // Arrange
        when(userRepository.existsByEmail(email)).thenReturn(false);
        when(userRepository.existsByUsername(username)).thenReturn(false);
        when(roleRepository.findByName(UserRole.STUDENT.name())).thenReturn(Optional.of(testRole));
        when(passwordEncoder.encode(password)).thenReturn(encodedPassword);
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(userMapper.toDTO(testUser)).thenReturn(testUserDTO);

        // Act
        UserDTO result = userService.registerUser(email, username, password, UserRole.STUDENT);

        // Assert
        assertNotNull(result);
        assertEquals(email, result.getEmail());
        assertEquals(username, result.getUsername());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User capturedUser = userCaptor.getValue();

        assertEquals(email, capturedUser.getEmail());
        assertEquals(username, capturedUser.getUsername());
        assertEquals(encodedPassword, capturedUser.getPasswordHash());
        assertTrue(capturedUser.getRoles().contains(testRole));
    }

    @Test
    void registerUser_EmailAlreadyExists_ThrowsException() {
        // Arrange
        when(userRepository.existsByEmail(email)).thenReturn(true);

        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () ->
                userService.registerUser(email, username, password, UserRole.STUDENT));

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void registerUser_UsernameAlreadyExists_ThrowsException() {
        // Arrange
        when(userRepository.existsByEmail(email)).thenReturn(false);
        when(userRepository.existsByUsername(username)).thenReturn(true);

        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () ->
                userService.registerUser(email, username, password, UserRole.STUDENT));

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void registerUser_RoleNotFound_ThrowsException() {
        // Arrange
        when(userRepository.existsByEmail(email)).thenReturn(false);
        when(userRepository.existsByUsername(username)).thenReturn(false);
        when(roleRepository.findByName(UserRole.STUDENT.name())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RoleNotFoundException.class, () ->
                userService.registerUser(email, username, password, UserRole.STUDENT));

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void getUserById_Success() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userMapper.toDTO(testUser)).thenReturn(testUserDTO);

        // Act
        UserDTO result = userService.getUserById(userId);

        // Assert
        assertNotNull(result);
        assertEquals(userId, result.getId());
        assertEquals(email, result.getEmail());
    }

    @Test
    void getUserById_UserNotFound_ThrowsException() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> userService.getUserById(userId));
    }

    @Test
    void getUserByEmail_Success() {
        // Arrange
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));
        when(userMapper.toDTO(testUser)).thenReturn(testUserDTO);

        // Act
        UserDTO result = userService.getUserByEmail(email);

        // Assert
        assertNotNull(result);
        assertEquals(email, result.getEmail());
    }

    @Test
    void getUserByEmail_UserNotFound_ThrowsException() {
        // Arrange
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> userService.getUserByEmail(email));
    }

    @Test
    void getUserByUsername_Success() {
        // Arrange
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(userMapper.toDTO(testUser)).thenReturn(testUserDTO);

        // Act
        UserDTO result = userService.getUserByUsername(username);

        // Assert
        assertNotNull(result);
        assertEquals(username, result.getUsername());
    }

    @Test
    void getUserByUsername_UserNotFound_ThrowsException() {
        // Arrange
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> userService.getUserByUsername(username));
    }

    @Test
    void getAllUsers_Success() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        List<User> users = List.of(testUser);
        Page<User> userPage = new PageImpl<>(users, pageable, users.size());

        when(userRepository.findAll(pageable)).thenReturn(userPage);
        when(userMapper.toDTO(testUser)).thenReturn(testUserDTO);

        // Act
        Page<UserDTO> result = userService.getAllUsers(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testUserDTO, result.getContent().get(0));
    }

    @Test
    void getUsersByRole_Success() {
        // Arrange
        when(userRepository.findByRoleName(UserRole.STUDENT.name())).thenReturn(List.of(testUser));
        when(userMapper.toDTO(testUser)).thenReturn(testUserDTO);

        // Act
        List<UserDTO> result = userService.getUsersByRole(UserRole.STUDENT);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testUserDTO, result.get(0));
    }

    @Test
    void updateUser_Success() {
        // Arrange
        UserDTO updatedDTO = new UserDTO();
        updatedDTO.setId(userId);
        updatedDTO.setEmail("updated@example.com");
        updatedDTO.setUsername("updateduser");
        updatedDTO.setEnabled(true);

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmail("updated@example.com")).thenReturn(false);
        when(userRepository.existsByUsername("updateduser")).thenReturn(false);
        when(userRepository.save(testUser)).thenReturn(testUser);
        when(userMapper.toDTO(testUser)).thenReturn(updatedDTO);

        // Act
        UserDTO result = userService.updateUser(userId, updatedDTO);

        // Assert
        assertNotNull(result);
        assertEquals("updated@example.com", result.getEmail());
        assertEquals("updateduser", result.getUsername());

        verify(userRepository).save(testUser);
    }

    @Test
    void updateUser_EmailAlreadyExists_ThrowsException() {
        // Arrange
        UserDTO updatedDTO = new UserDTO();
        updatedDTO.setId(userId);
        updatedDTO.setEmail("existing@example.com");
        updatedDTO.setUsername(username);

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () -> userService.updateUser(userId, updatedDTO));

        verify(userRepository, never()).save(any());
    }

    @Test
    void updateUser_UsernameAlreadyExists_ThrowsException() {
        // Arrange
        UserDTO updatedDTO = new UserDTO();
        updatedDTO.setId(userId);
        updatedDTO.setEmail(email);
        updatedDTO.setUsername("existingUsername");

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        // Removed unnecessary stubbing for existsByEmail
        when(userRepository.existsByUsername("existingUsername")).thenReturn(true);

        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () -> userService.updateUser(userId, updatedDTO));

        verify(userRepository, never()).save(any());
    }

    @Test
    void deleteUser_Success() {
        // Arrange
        when(userRepository.existsById(userId)).thenReturn(true);
        doNothing().when(userRepository).deleteById(userId);

        // Act
        userService.deleteUser(userId);

        // Assert
        verify(userRepository).deleteById(userId);
    }

    @Test
    void deleteUser_UserNotFound_ThrowsException() {
        // Arrange
        when(userRepository.existsById(userId)).thenReturn(false);

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> userService.deleteUser(userId));

        verify(userRepository, never()).deleteById(any());
    }

    @Test
    void addRole_Success() {
        // Arrange
        Role newRole = new Role();
        newRole.setId(UUID.randomUUID());
        newRole.setName(UserRole.INSTRUCTOR.name());

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(roleRepository.findByName(UserRole.INSTRUCTOR.name())).thenReturn(Optional.of(newRole));
        when(userRepository.save(testUser)).thenReturn(testUser);
        when(userMapper.toDTO(testUser)).thenReturn(testUserDTO);

        // Act
        UserDTO result = userService.addRole(userId, UserRole.INSTRUCTOR.name());

        // Assert
        assertNotNull(result);
        verify(userRepository).save(testUser);
        assertTrue(testUser.getRoles().contains(newRole));
    }

    @Test
    void addRole_UserNotFound_ThrowsException() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, () ->
                userService.addRole(userId, UserRole.INSTRUCTOR.name()));

        verify(userRepository, never()).save(any());
    }

    @Test
    void addRole_RoleNotFound_ThrowsException() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(roleRepository.findByName(UserRole.INSTRUCTOR.name())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RoleNotFoundException.class, () ->
                userService.addRole(userId, UserRole.INSTRUCTOR.name()));

        verify(userRepository, never()).save(any());
    }

    @Test
    void removeRole_Success() {
        // Arrange
        Role secondRole = new Role();
        secondRole.setId(UUID.randomUUID());
        secondRole.setName(UserRole.INSTRUCTOR.name());
        testUser.addRole(secondRole);

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(roleRepository.findByName(UserRole.STUDENT.name())).thenReturn(Optional.of(testRole));
        when(userRepository.save(testUser)).thenReturn(testUser);
        when(userMapper.toDTO(testUser)).thenReturn(testUserDTO);

        // Act
        UserDTO result = userService.removeRole(userId, UserRole.STUDENT.name());

        // Assert
        assertNotNull(result);
        verify(userRepository).save(testUser);
        assertFalse(testUser.getRoles().contains(testRole));
    }

    @Test
    void removeRole_LastRole_ThrowsException() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(roleRepository.findByName(UserRole.STUDENT.name())).thenReturn(Optional.of(testRole));

        // Act & Assert
        assertThrows(IllegalStateException.class, () ->
                userService.removeRole(userId, UserRole.STUDENT.name()));

        verify(userRepository, never()).save(any());
    }

    @Test
    void updateLastLogin_Success() {
        // Arrange
        LocalDateTime beforeUpdate = testUser.getLastLogin();
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(testUser)).thenReturn(testUser);

        // Act
        userService.updateLastLogin(userId);

        // Assert
        verify(userRepository).save(testUser);
        assertNotNull(testUser.getLastLogin());
        if (beforeUpdate != null) {
            assertTrue(testUser.getLastLogin().isAfter(beforeUpdate));
        }
    }

    @Test
    void toggleUserEnabled_Success() {
        // Arrange
        boolean initialEnabled = testUser.isEnabled();
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(testUser)).thenReturn(testUser);
        when(userMapper.toDTO(testUser)).thenReturn(testUserDTO);

        // Act
        UserDTO result = userService.toggleUserEnabled(userId);

        // Assert
        assertNotNull(result);
        verify(userRepository).save(testUser);
        assertEquals(!initialEnabled, testUser.isEnabled());
    }

    @Test
    void existsByEmail_ReturnsTrue() {
        // Arrange
        when(userRepository.existsByEmail(email)).thenReturn(true);

        // Act
        boolean result = userService.existsByEmail(email);

        // Assert
        assertTrue(result);
    }

    @Test
    void existsByUsername_ReturnsTrue() {
        // Arrange
        when(userRepository.existsByUsername(username)).thenReturn(true);

        // Act
        boolean result = userService.existsByUsername(username);

        // Assert
        assertTrue(result);
    }

    @Test
    void countByRole_ReturnsCorrectCount() {
        // Arrange
        when(userRepository.countByRoleName(UserRole.STUDENT.name())).thenReturn(10L);

        // Act
        long result = userService.countByRole(UserRole.STUDENT);

        // Assert
        assertEquals(10L, result);
    }

    @Test
    void isCurrentUser_ReturnsTrueForMatchingUser() {
        // Act
        boolean result = userService.isCurrentUser(userId, testUser);

        // Assert
        assertTrue(result);
    }

    @Test
    void isCurrentUser_ReturnsFalseForNonMatchingUser() {
        // Arrange
        User differentUser = User.builder().id(UUID.randomUUID()).build();

        // Act
        boolean result = userService.isCurrentUser(userId, differentUser);

        // Assert
        assertFalse(result);
    }

    @Test
    void updateUserAvatar_Success() {
        // Arrange
        String avatarUrl = "https://example.com/avatar.png";
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(testUser)).thenReturn(testUser);

        // Act
        User result = userService.updateUserAvatar(userId, avatarUrl);

        // Assert
        assertNotNull(result);
        assertEquals(avatarUrl, result.getAvatar());
        verify(userRepository).save(testUser);
    }

    @Test
    void updatePassword_Success() {
        // Arrange
        String currentPassword = "oldPassword";
        String newPassword = "newPassword";
        String newEncodedPassword = "newEncodedPassword";

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(currentPassword, encodedPassword)).thenReturn(true);
        when(passwordEncoder.encode(newPassword)).thenReturn(newEncodedPassword);
        when(userRepository.save(testUser)).thenReturn(testUser);

        // Act
        userService.updatePassword(userId, currentPassword, newPassword);

        // Assert
        assertEquals(newEncodedPassword, testUser.getPasswordHash());
        verify(userRepository).save(testUser);
    }

    @Test
    void updatePassword_IncorrectCurrentPassword_ThrowsException() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", encodedPassword)).thenReturn(false);

        // Act & Assert
        assertThrows(InvalidCredentialsException.class, () ->
                userService.updatePassword(userId, "wrongPassword", "newPassword"));

        verify(userRepository, never()).save(any());
    }

    @Test
    void getUserStatistics_ReturnsCorrectStats() {
        // Arrange
        when(userRepository.countByCredentialsNonExpired(true)).thenReturn(100L);
        when(userRepository.countByCreatedAtAfter(any())).thenReturn(10L);
        when(userRepository.countByRoleName(UserRole.STUDENT.name())).thenReturn(80L);
        when(userRepository.countByRoleName(UserRole.INSTRUCTOR.name())).thenReturn(20L);
        when(userRepository.findAll()).thenReturn(List.of(testUser));

        // Act
        UserStatisticsDTO result = userService.getUserStatistics();

        // Assert
        assertNotNull(result);
        assertEquals(100L, result.getTotalActiveUsers());
        assertEquals(10L, result.getNewUsersToday());
        assertEquals(80L, result.getTotalStudents());
        assertEquals(20L, result.getTotalInstructors());
        assertTrue(result.getAvgEngagement() >= 0);
    }

    @Test
    void updateUserStatus_Success() {
        // Arrange
        boolean newStatus = false;
        testUser.getRoles().clear();
        testUser.addRole(testRole); // Add STUDENT role (not ADMIN)

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(testUser)).thenReturn(testUser);
        when(userMapper.toDTO(testUser)).thenReturn(testUserDTO);

        // Act
        UserDTO result = userService.updateUserStatus(userId, newStatus);

        // Assert
        assertNotNull(result);
        verify(userRepository).save(testUser);
        assertEquals(newStatus, testUser.isEnabled());
    }

    @Test
    void updateUserStatus_DisablingAdmin_ThrowsException() {
        // Arrange
        Role adminRole = new Role();
        adminRole.setId(UUID.randomUUID());
        adminRole.setName("ADMIN");

        testUser.getRoles().clear();
        testUser.addRole(adminRole);

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        // Act & Assert
        assertThrows(IllegalOperationException.class, () ->
                userService.updateUserStatus(userId, false));

        verify(userRepository, never()).save(any());
    }

    @Test
    void getFilteredUsers_WithRoleFilter_Success() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        List<User> users = List.of(testUser);
        Page<User> userPage = new PageImpl<>(users, pageable, users.size());

        when(userRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(userPage);
        when(userMapper.toDTO(testUser)).thenReturn(testUserDTO);

        // Act
        Page<UserDTO> result = userService.getFilteredUsers(
                List.of(UserRole.STUDENT.name()), null, null, null, null, null, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testUserDTO, result.getContent().get(0));

        verify(userRepository).findAll(any(Specification.class), eq(pageable));
    }

    @Test
    void updateUserRoles_Success() {
        // Arrange
        List<String> newRoles = List.of(UserRole.INSTRUCTOR.name());
        Role instructorRole = new Role();
        instructorRole.setId(UUID.randomUUID());
        instructorRole.setName(UserRole.INSTRUCTOR.name());

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(roleRepository.findByName(UserRole.INSTRUCTOR.name())).thenReturn(Optional.of(instructorRole));
        when(userRepository.save(testUser)).thenReturn(testUser);
        when(userMapper.toDTO(testUser)).thenReturn(testUserDTO);

        // Act
        UserDTO result = userService.updateUserRoles(userId, newRoles);

        // Assert
        assertNotNull(result);
        verify(userRepository).save(testUser);
        assertEquals(1, testUser.getRoles().size());
        assertTrue(testUser.getRoles().contains(instructorRole));
        assertFalse(testUser.getRoles().contains(testRole));
    }
}