package com.pink.itms.dto.task;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TaskRequestDTO {
    private Long id;
    private String name;
    private String description;
    private int priority;
    private Long type_id;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}