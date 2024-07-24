package com.pink.itms.mapper;

import com.pink.itms.dto.product.ProductResponseDTO;
import com.pink.itms.dto.task.TaskRequestDTO;
import com.pink.itms.dto.task.TaskResponseDTO;
import com.pink.itms.dto.user.UserResponseWithoutTasksDTO;
import com.pink.itms.dto.warehouse.WarehouseResponseDTO;
import com.pink.itms.exception.taskType.TaskTypeNotFoundException;
import com.pink.itms.model.Task;
import com.pink.itms.model.TaskType;
import com.pink.itms.repository.TaskTypeRepository;
import org.springframework.stereotype.Component;
import pdf.generator.model.Tasks;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TaskMapper {
    private final UserMapper userMapper;
    private final ProductMapper productMapper;
    private final WarehouseMapper warehouseMapper;
    private final TaskTypeRepository taskTypeRepository;

    public TaskMapper(UserMapper userMapper, ProductMapper productMapper, WarehouseMapper warehouseMapper, TaskTypeRepository taskTypeRepository) {
        this.userMapper = userMapper;
        this.productMapper = productMapper;
        this.warehouseMapper = warehouseMapper;
        this.taskTypeRepository = taskTypeRepository;
    }

    public Task toEntity(TaskRequestDTO taskRequestDTO) {
        Task task = new Task();
        task.setId(taskRequestDTO.getId());
        task.setName(taskRequestDTO.getName());
        task.setDescription(taskRequestDTO.getDescription());
        task.setState(0);
        task.setPriority(taskRequestDTO.getPriority());
        task.setType(taskTypeRepository.findById(taskRequestDTO.getType_id()).orElseThrow(() -> new TaskTypeNotFoundException("task type not found!")));
        if (taskRequestDTO.getStartDate() != null) task.setStartDate(taskRequestDTO.getStartDate());
        if (taskRequestDTO.getEndDate() != null) task.setEndDate(taskRequestDTO.getEndDate());
        task.setIsActive(true);

        return task;
    }

    public TaskResponseDTO toDto(Task task) {
        TaskResponseDTO responseDTO = new TaskResponseDTO();
        responseDTO.setId(task.getId());
        responseDTO.setName(task.getName());
        responseDTO.setDescription(task.getDescription());
        responseDTO.setState(task.getState());
        responseDTO.setPriority(task.getPriority());
        responseDTO.setCreationDate(task.getCreationDate());
        responseDTO.setStartDate(task.getStartDate());
        responseDTO.setEndDate(task.getEndDate());
        responseDTO.setIsActive(task.getIsActive());

        if (task.getType() == null) responseDTO.setType("None");
        else responseDTO.setType(task.getType().getName());

        if (task.getUsers() != null) {
            responseDTO.setUsers(task.getUsers().stream()
                    .map(userMapper::entityToDtoWithoutTasks)
                    .collect(Collectors.toSet()));
        }

        if (task.getProducts() != null) {
            responseDTO.setProducts(task.getProducts().stream()
                    .map(productMapper::toDto)
                    .collect(Collectors.toSet()));
        }

        if (task.getWarehouses() != null) {
            responseDTO.setWarehouses(task.getWarehouses().stream()
                    .map(warehouseMapper::toDto)
                    .collect(Collectors.toSet()));
        }

        return responseDTO;
    }

    public static Tasks toPdfTask(TaskResponseDTO taskDTO) {
        Tasks task = new Tasks();
        task.setId(taskDTO.getId());
        task.setName(taskDTO.getName());
        task.setDescription(taskDTO.getDescription());
        task.setState(taskDTO.getState());
        task.setPriority(taskDTO.getPriority());
        task.setCreationDate(taskDTO.getCreationDate());
        task.setStartDate(taskDTO.getStartDate());
        task.setEndDate(taskDTO.getEndDate());
        task.setActive(taskDTO.getIsActive());


        task.setUsers(UserMapper.toPdfUserSet(taskDTO.getUsers()));
        task.setProducts(ProductMapper.toPdfProductSet(taskDTO.getProducts()));
        task.setWarehouses(WarehouseMapper.toPdfWarehouseSet(taskDTO.getWarehouses()));

        return task;
    }

    public static List<Tasks> toPdfTaskList(List<TaskResponseDTO> tasks) {
        return tasks.stream()
                .map(TaskMapper::toPdfTask)
                .collect(Collectors.toList());
    }
}
