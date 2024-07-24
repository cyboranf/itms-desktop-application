package com.pink.itms.service;

import com.pink.itms.dto.taskType.TaskTypeRequestDTO;
import com.pink.itms.dto.taskType.TaskTypeResponseDTO;
import com.pink.itms.mapper.TaskTypeMapper;
import com.pink.itms.model.Task;
import com.pink.itms.model.TaskType;
import com.pink.itms.repository.TaskTypeRepository;
import com.pink.itms.validation.TaskTypeValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class TaskTypeServiceTest {
    @Mock
    private TaskTypeRepository taskTypeRepository;

    @Mock
    private TaskTypeMapper taskTypeMapper;

    @Mock
    private TaskTypeValidator taskTypeValidator;

    @Mock
    private TaskTypeRequestDTO requestMock;

    @InjectMocks
    private TaskTypeService taskTypeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createTaskType() {
        TaskTypeRequestDTO requestDTO = new TaskTypeRequestDTO();
        TaskType taskType = new TaskType();
        TaskTypeResponseDTO responseDTO = new TaskTypeResponseDTO();

        when(taskTypeMapper.toEntity(any(TaskTypeRequestDTO.class))).thenReturn(taskType);
        when(taskTypeRepository.save(any(TaskType.class))).thenReturn(taskType);
        when(taskTypeMapper.toDto(any(TaskType.class))).thenReturn(responseDTO);

        TaskTypeResponseDTO resultDTO = taskTypeService.createTaskType(requestDTO);

        verify(taskTypeValidator).taskTypeValidation(requestDTO);
        verify(taskTypeMapper).toEntity(requestDTO);
        verify(taskTypeRepository).save(taskType);
        verify(taskTypeMapper).toDto(taskType);

        assertThat(resultDTO).isSameAs(responseDTO);
    }

    @Test
    void deleteTaskType() {

    }

    @Test
    void editTaskType() {


    }

    @Test
    void getAll() {
    }

    @Test
    void getSingle() {
    }
}