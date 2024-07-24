package com.pink.itms.service;

import com.pink.itms.dto.taskType.TaskTypeRequestDTO;
import com.pink.itms.dto.taskType.TaskTypeResponseDTO;
import com.pink.itms.exception.taskType.ExistingTaskTypeNameException;
import com.pink.itms.exception.taskType.TaskTypeNotFoundException;
import com.pink.itms.exception.user.UserNotFoundException;
import com.pink.itms.mapper.TaskTypeMapper;
import com.pink.itms.model.TaskType;
import com.pink.itms.model.User;
import com.pink.itms.repository.TaskTypeRepository;
import com.pink.itms.validation.TaskTypeValidator;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class TaskTypeService {
    TaskTypeRepository taskTypeRepository;
    TaskTypeMapper taskTypeMapper;
    TaskTypeValidator taskTypeValidator;

    public TaskTypeService(TaskTypeRepository taskTypeRepository, TaskTypeMapper taskTypeMapper, TaskTypeValidator taskTypeValidator) {
        this.taskTypeRepository = taskTypeRepository;
        this.taskTypeMapper = taskTypeMapper;
        this.taskTypeValidator = taskTypeValidator;
    }

    /**
     * Creates Entity from request object
     *
     * @param taskTypeRequestDTO request object for entity creation
     * @return {@link TaskTypeResponseDTO} response from created Entity
     * @throws ExistingTaskTypeNameException if type with this name already exists
     */
    public TaskTypeResponseDTO createTaskType(TaskTypeRequestDTO taskTypeRequestDTO) {
        taskTypeValidator.taskTypeValidation(taskTypeRequestDTO);
        TaskType taskType = taskTypeMapper.toEntity(taskTypeRequestDTO);
        TaskType savedTaskType = taskTypeRepository.save(taskType);

        return taskTypeMapper.toDto(savedTaskType);
    }

    /**
     * Deletes entity with given id
     *
     * @param id id of task type to delete
     * @throws TaskTypeNotFoundException if task type doesn't exist
     */
    public void deleteTaskType(long id) {
        TaskType taskType = taskTypeRepository.findById(id)
                .orElseThrow(() -> new TaskTypeNotFoundException("Task type with id " + id + " doesn't exist."));
        taskType.setIsActive(false);
        taskTypeRepository.save(taskType);
    }

    /**
     * Edits exisiting entity pointed by given id
     *
     * @param id                 of entity to edit
     * @param taskTypeRequestDTO values to replace with
     * @return {@link TaskTypeResponseDTO} - rosponse from changed entity
     */
    public TaskTypeResponseDTO editTaskType(Long id, TaskTypeRequestDTO taskTypeRequestDTO) {
        if (taskTypeRepository.findByName(taskTypeRequestDTO.getName()).isPresent()) {
            throw new ExistingTaskTypeNameException("Task type " + taskTypeRequestDTO.getName() + " already exist.");
        }

        TaskType taskType = taskTypeRepository.getById(id);
        taskType.setName(taskTypeRequestDTO.getName());

        return taskTypeMapper.toDto(taskType);
    }

    /**
     * returns all the task types
     *
     * @return {@link List<TaskTypeResponseDTO>} list of DTO responseds
     */
    public List<TaskTypeResponseDTO> getAll() {
        List<TaskTypeResponseDTO> responseDTOList = new ArrayList<>();
        List<TaskType> entitiesList = taskTypeRepository.findAllByIsActiveTrue();

        for (int i = 0; i < entitiesList.size(); i++) {
            responseDTOList.add(taskTypeMapper.toDto(entitiesList.get(i)));
        }

        return responseDTOList;
    }

    /**
     * returns single task type by given id
     *
     * @param id id of task to return
     * @throws TaskTypeNotFoundException if task type does not exists in repository
     * @return {@link TaskTypeResponseDTO}
     */
    public TaskTypeResponseDTO getSingle(long id) {
        taskTypeRepository.findById(id).orElseThrow(() -> new TaskTypeNotFoundException("Task type with id " + id + "doesn't exists"));

        return taskTypeMapper.toDto(taskTypeRepository.getById(id));
    }
}
