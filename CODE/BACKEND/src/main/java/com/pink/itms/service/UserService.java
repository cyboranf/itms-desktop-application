package com.pink.itms.service;

import com.pink.itms.dto.user.UserRequestDTO;
import com.pink.itms.dto.user.UserResponseDTO;
import com.pink.itms.dto.user.UserResponseWithoutTasksDTO;
import com.pink.itms.exception.task.TaskNotFoundException;
import com.pink.itms.exception.user.UserNotFoundException;
import com.pink.itms.exception.warehouse.WarehouseNotFoundException;
import com.pink.itms.mapper.UserMapper;
import com.pink.itms.model.Role;
import com.pink.itms.model.Task;
import com.pink.itms.model.User;
import com.pink.itms.model.Warehouse;
import com.pink.itms.repository.RoleRepository;
import com.pink.itms.repository.TaskRepository;
import com.pink.itms.repository.UserRepository;
import com.pink.itms.validation.UserValidator;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final UserValidator userValidator;
    private final TaskRepository taskRepository;
    private final RoleRepository roleRepository;

    public UserService(UserRepository userRepository, UserMapper userMapper, UserValidator userValidator, TaskRepository taskRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.userValidator = userValidator;
        this.taskRepository = taskRepository;
        this.roleRepository = roleRepository;
    }

    public UserResponseDTO editUser(Long userId, UserRequestDTO dto) {
        User user = userValidator.userEditValidation(userId, dto);
        userMapper.updateUserFromRequestDTO(dto, user);
        User savedUser = userRepository.save(user);
        return userMapper.entityToDto(savedUser);
    }

    /**
     * Deletes warehouse with given id
     *
     * @param id id of user to delete
     * @throws UserNotFoundException if user doesn't exist
     */
    public void deleteUser(long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User with id " + id + " doesn't exist."));
        user.setIsActive(false);
        userRepository.save(user);
    }

    /**
     * Get all users
     * @return List of UserResponseDTO
     */
    public List<UserResponseWithoutTasksDTO> getAll() {
        return userRepository.findAllByIsActiveTrue()
                .stream()
                .map(userMapper::entityToDtoWithoutTasks)
                .toList();
    }

    /**
     * attaches user given by userId with task given by tasksId, if said connection already existed, does nothing.
     *
     * @param userId id of user to be attached
     * @param taskId id of task to be attached
     */
    public void attachTask(Long userId, Long taskId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User Not Found"));
        Task task = taskRepository.findById(taskId). orElseThrow(() -> new TaskNotFoundException("Task Not Found"));

        Set<Task> taskSet = user.getTasks();
        taskSet.add(task);
        user.setTasks(taskSet);

        userRepository.save(user);
    }

    public UserResponseWithoutTasksDTO getSelf(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("User Not Found"));
        return userMapper.entityToDtoWithoutTasks(user);
    }

    // give role to User
    public void giveRole(Long userId, String role) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User Not Found"));
        Role newRole = roleRepository.findByName(role);
        user.getRoles().add(newRole);
        userRepository.save(user);
    }

    // Get All Users with role 'User'
    public List<UserResponseWithoutTasksDTO> getAllUsersWithUserRole() {
        return userRepository.findAllByRolesNameAndIsActiveTrue("User")
                .stream()
                .map(userMapper::entityToDtoWithoutTasks)
                .toList();
    }

    // Get all Roles
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    // Get User by ID
    public UserResponseWithoutTasksDTO getById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User Not Found"));
        return userMapper.entityToDtoWithoutTasks(user);
    }
}
