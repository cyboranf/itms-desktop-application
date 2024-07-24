package com.pink.itms.service;

import com.pink.itms.dto.task.TaskRequestDTO;
import com.pink.itms.dto.task.TaskResponseDTO;
import com.pink.itms.exception.product.ProductNotFoundException;
import com.pink.itms.exception.task.TaskNotFoundException;
import com.pink.itms.exception.warehouse.WarehouseNotFoundException;
import com.pink.itms.mapper.TaskMapper;
import com.pink.itms.model.Product;
import com.pink.itms.model.Task;
import com.pink.itms.repository.ProductRepository;
import com.pink.itms.repository.TaskRepository;
import com.pink.itms.validation.TaskValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private TaskValidator taskValidator;

    @Mock
    private TaskMapper taskMapper;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private TaskService taskService;

    private Task task;
    private TaskRequestDTO taskRequestDTO;
    private TaskResponseDTO taskResponseDTO;
    private Product product;

    @BeforeEach
    void setUp() {
        task = new Task();
        task.setId(1L);
        task.setProducts(new HashSet<Product>());
        task.setIsActive(true);

        taskRequestDTO = new TaskRequestDTO();
        taskRequestDTO.setName("Test Task");

        taskResponseDTO = new TaskResponseDTO();
        taskResponseDTO.setId(1L);
        taskResponseDTO.setName("Test Task");

        product = new Product();
        product.setId(1L);
    }

    @Test
    void createTask() {
        when(taskMapper.toEntity(taskRequestDTO)).thenReturn(task);
        when(taskRepository.save(task)).thenReturn(task);
        when(taskMapper.toDto(task)).thenReturn(taskResponseDTO);

        TaskResponseDTO result = taskService.createTask(taskRequestDTO);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Task", result.getName());
    }

    @Test
    void getTaskById() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskMapper.toDto(task)).thenReturn(taskResponseDTO);

        TaskResponseDTO result = taskService.getTaskById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Task", result.getName());
    }

    @Test
    void getTaskByIdThrowsException() {
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> taskService.getTaskById(1L));
    }

    @Test
    void deleteTask() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        taskService.deleteTask(1L);

        verify(taskRepository, times(1)).save(task);
        assertFalse(task.getIsActive());
    }

    @Test
    void deleteTaskThrowsException() {
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(WarehouseNotFoundException.class, () -> taskService.deleteTask(1L));
    }

    @Test
    void getAll() {
        List<Task> tasks = Arrays.asList(task);
        when(taskRepository.findAllByIsActiveTrue()).thenReturn(tasks);
        when(taskMapper.toDto(task)).thenReturn(taskResponseDTO);

        List<TaskResponseDTO> result = taskService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Task", result.get(0).getName());
    }

//    @Test
//    void getFilteredTasks() {
//        List<Task> tasks = Arrays.asList(task);
//        when(taskRepository.findAll()).thenReturn(tasks);
//        when(taskMapper.toDto(task)).thenReturn(taskResponseDTO);
//
////        List<TaskResponseDTO> result = taskService.getFilteredTasks(null, null, null, null);
//
//        assertNotNull(result);
//        assertEquals(1, result.size());
//        assertEquals("Test Task", result.get(0).getName());
//    }

    @Test
    void editTask() {
        when(taskValidator.validateUpdate(1L, taskRequestDTO)).thenReturn(task);
        when(taskRepository.save(task)).thenReturn(task);
        when(taskMapper.toDto(task)).thenReturn(taskResponseDTO);

        TaskResponseDTO result = taskService.editTask(1L, taskRequestDTO);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Task", result.getName());
    }

    @Test
    void attachProduct() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        taskService.attachProduct(1L, 1L);

        verify(taskRepository, times(1)).save(task);
        assertTrue(task.getProducts().contains(product));
    }

    @Test
    void attachProductThrowsTaskNotFoundException() {
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class, () -> taskService.attachProduct(1L, 1L));
    }

    @Test
    void attachProductThrowsProductNotFoundException() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class, () -> taskService.attachProduct(1L, 1L));
    }
}