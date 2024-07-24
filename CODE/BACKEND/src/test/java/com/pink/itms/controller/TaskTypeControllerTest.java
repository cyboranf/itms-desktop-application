//package com.pink.itms.controller;
//
//import com.pink.itms.dto.taskType.TaskTypeRequestDTO;
//import com.pink.itms.dto.taskType.TaskTypeResponseDTO;
//import com.pink.itms.service.TaskTypeService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//
//import java.util.ArrayList;
//import java.util.List;
//
//import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.when;
//
//class TaskTypeControllerTest {
//
//    @Mock
//    private TaskTypeService taskTypeService;
//
//    @InjectMocks
//    private TaskTypeController taskTypeController;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    void createTaskType() {
//        TaskTypeResponseDTO responseDTO = new TaskTypeResponseDTO();
//        TaskTypeRequestDTO requestDTO = new TaskTypeRequestDTO();
//        when(taskTypeService.createTaskType(any(TaskTypeRequestDTO.class))).thenReturn(responseDTO);
//
//        ResponseEntity<?> response = taskTypeController.createTaskType(requestDTO);
//
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
//        assertThat(response.getBody()).isEqualTo(responseDTO);
//    }
//
//    @Test
//    void editTaskType() {
//        long id = 1;
//        TaskTypeResponseDTO responseDTO = new TaskTypeResponseDTO();
//        TaskTypeRequestDTO requestDTO = new TaskTypeRequestDTO();
//        when(taskTypeService.editTaskType(any(Long.class), any(TaskTypeRequestDTO.class))).thenReturn(responseDTO);
//
//        ResponseEntity<?> response = taskTypeController.editTaskType(id, requestDTO);
//
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
//        assertThat(response.getBody()).isEqualTo(responseDTO);
//    }
//
//    @Test
//    void deleteTaskType() {
//        long id = 1;
//        TaskTypeResponseDTO responseDTO = new TaskTypeResponseDTO();
//
//        ResponseEntity<?> response = taskTypeController.deleteTaskType(id);
//
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
//    }
//
//    @Test
//    void getallTasksTypes() {
//        List<TaskTypeResponseDTO> responseDTOList = new ArrayList<>();
//        when(taskTypeService.getAll()).thenReturn(responseDTOList);
//
//        ResponseEntity<?> response = taskTypeController.getallTasksTypes();
//
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
//        assertThat(response.getBody()).isEqualTo(responseDTOList);
//    }
//
//    @Test
//    void getSignleTaskType() {
//        long id = 1;
//        TaskTypeResponseDTO responseDTO = new TaskTypeResponseDTO();
//        when(taskTypeService.getSingle(any(Long.class))).thenReturn(responseDTO);
//
//        ResponseEntity<?> response = taskTypeController.getSignleTaskType(id);
//
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
//        assertThat(response.getBody()).isEqualTo(responseDTO);
//    }
//}