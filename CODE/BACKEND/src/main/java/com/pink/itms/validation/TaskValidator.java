package com.pink.itms.validation;

import com.pink.itms.dto.task.TaskRequestDTO;
import com.pink.itms.exception.task.*;
import com.pink.itms.exception.taskType.InvalidTaskTypeException;
import com.pink.itms.exception.taskType.TaskTypeNotFoundException;
import com.pink.itms.mapper.TaskMapper;
import com.pink.itms.model.Task;
import com.pink.itms.repository.TaskRepository;
import com.pink.itms.repository.TaskTypeRepository;
import org.springframework.stereotype.Component;

@Component
public class TaskValidator {

    private final TaskTypeRepository taskTypeRepository;
    private final TaskMapper taskMapper;
    private final TaskRepository taskRepository;

    public TaskValidator(TaskTypeRepository taskTypeRepository, TaskMapper taskMapper, TaskRepository taskRepository) {
        this.taskTypeRepository = taskTypeRepository;
        this.taskMapper = taskMapper;
        this.taskRepository = taskRepository;
    }

    //TODO jak bedzie reszta class to wtedy poprawic walidacje np. czy type istnieje itp :D
    public void validateCreate(TaskRequestDTO taskRequestDTO) {
        if (taskRequestDTO.getName() == null || taskRequestDTO.getName().isEmpty()) {
            throw new InvalidTaskNameException("Task name must not be empty");
        }

        if (taskRequestDTO.getDescription() == null || taskRequestDTO.getDescription().isEmpty()) {
            throw new InvalidTaskDescriptionException("Task description must not be empty");
        }

        if (taskRequestDTO.getPriority() <= 0) {
            throw new InvalidTaskPriorityException("Task priority must be a positive integer");
        }

        if (taskRequestDTO.getType_id() == null || taskRequestDTO.getType_id() <= 0) {
            throw new InvalidTaskTypeException("Task type ID must be specified and must be a positive integer");
        }

        taskTypeRepository.findById(taskRequestDTO.getType_id())
                .orElseThrow(() -> new InvalidTaskTypeException("Task type with id = " + taskRequestDTO.getType_id() + " does not exist"));

    }

    public Task validateUpdate(Long taskId, TaskRequestDTO taskRequestDTO) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task with id = " + taskId + " does not exist"));

        if (task.getName() == null || task.getName().isEmpty()) {
            throw new InvalidTaskNameException("Task name must not be empty");
        }

        if (task.getDescription() == null || task.getDescription().isEmpty()) {
            throw new InvalidTaskDescriptionException("Task description must not be empty");
        }

        if (task.getState() <= 0) {
            throw new InvalidTaskStateException("Task state must be a positive integer");
        }

        if (task.getPriority() <= 0) {
            throw new InvalidTaskPriorityException("Task priority must be a positive integer");
        }

        if (task.getType() == null || task.getType().getId() == null || task.getType().getId() <= 0) {
            throw new InvalidTaskTypeException("Task type ID must be specified and must be a positive integer");
        }

        taskTypeRepository.findById(task.getType().getId())
                .orElseThrow(() -> new TaskTypeNotFoundException("Task type with id = " + task.getType().getId() + " does not exist"));

        return task;
    }
}
