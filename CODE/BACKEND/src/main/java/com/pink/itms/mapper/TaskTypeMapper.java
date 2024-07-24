package com.pink.itms.mapper;

import com.pink.itms.dto.taskType.TaskTypeRequestDTO;
import com.pink.itms.dto.taskType.TaskTypeResponseDTO;
import com.pink.itms.model.TaskType;
import org.springframework.stereotype.Component;

@Component
public class TaskTypeMapper {
    public TaskType toEntity(TaskTypeRequestDTO taskTypeRequestDTO) {
        TaskType taskType = new TaskType();
        taskType.setName(taskTypeRequestDTO.getName());
        taskType.setIsActive(true);

        return taskType;
    }

    public TaskTypeResponseDTO toDto(TaskType taskType) {
        TaskTypeResponseDTO taskTypeResponseDTO = new TaskTypeResponseDTO();
        taskTypeResponseDTO.setId(taskType.getId());
        taskTypeResponseDTO.setName(taskType.getName());
        taskTypeResponseDTO.setIsActive(taskType.getIsActive());

        return taskTypeResponseDTO;
    }
}
