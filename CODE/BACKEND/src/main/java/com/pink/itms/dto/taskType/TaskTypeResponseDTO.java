package com.pink.itms.dto.taskType;

import lombok.Data;

@Data
public class TaskTypeResponseDTO {
    private Long id;
    private String name;
    private Boolean isActive;
}
