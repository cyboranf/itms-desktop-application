package com.pink.itms.repository;

import com.pink.itms.model.TaskType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskTypeRepository extends JpaRepository<TaskType, Long> {
    Optional<TaskType> findByName(String name);

    Optional<TaskType> findByIdAndIsActiveTrue(Long id);
    List<TaskType> findAllByIsActiveTrue();
}
