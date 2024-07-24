package com.pink.itms.service;

import com.pink.itms.dto.user.UserRequestDTO;
import com.pink.itms.dto.user.UserResponseDTO;
import com.pink.itms.dto.user.UserResponseWithoutTasksDTO;
import com.pink.itms.exception.task.TaskNotFoundException;
import com.pink.itms.exception.user.UserNotFoundException;
import com.pink.itms.mapper.UserMapper;
import com.pink.itms.model.Task;
import com.pink.itms.model.User;
import com.pink.itms.repository.TaskRepository;
import com.pink.itms.repository.UserRepository;
import com.pink.itms.validation.UserValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private UserValidator userValidator;

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private UserService userService;

    private User user;
    private UserRequestDTO userRequestDTO;
    private UserResponseDTO userResponseDTO;
    private UserResponseWithoutTasksDTO userResponseWithoutTasksDTO;
    private Task task;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setIsActive(true);
        user.setTasks(new HashSet<>());

        userRequestDTO = new UserRequestDTO();
        userRequestDTO.setName("Test User");

        userResponseDTO = new UserResponseDTO();
        userResponseDTO.setId(1L);
        userResponseDTO.setName("Test User");

        userResponseWithoutTasksDTO = new UserResponseWithoutTasksDTO();
        userResponseWithoutTasksDTO.setId(1L);
        userResponseWithoutTasksDTO.setName("Test User");

        task = new Task();
        task.setId(1L);
    }

    @Test
    void editUser() {
        when(userValidator.userEditValidation(1L, userRequestDTO)).thenReturn(user);
        doNothing().when(userMapper).updateUserFromRequestDTO(userRequestDTO, user);
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.entityToDto(user)).thenReturn(userResponseDTO);

        UserResponseDTO result = userService.editUser(1L, userRequestDTO);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test User", result.getName());
    }

    @Test
    void deleteUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        userService.deleteUser(1L);

        verify(userRepository, times(1)).save(user);
        assertFalse(user.getIsActive());
    }

    @Test
    void deleteUserThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.deleteUser(1L));
    }

    @Test
    void getAll() {
        List<User> users = Arrays.asList(user);
        when(userRepository.findAllByIsActiveTrue()).thenReturn(users);
        when(userMapper.entityToDtoWithoutTasks(user)).thenReturn(userResponseWithoutTasksDTO);

        List<UserResponseWithoutTasksDTO> result = userService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test User", result.get(0).getName());
    }

    @Test
    void attachTask() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        userService.attachTask(1L, 1L);

        verify(userRepository, times(1)).save(user);
        assertTrue(user.getTasks().contains(task));
    }

    @Test
    void attachTaskThrowsUserNotFoundException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.attachTask(1L, 1L));
    }

    @Test
    void attachTaskThrowsTaskNotFoundException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class, () -> userService.attachTask(1L, 1L));
    }
}