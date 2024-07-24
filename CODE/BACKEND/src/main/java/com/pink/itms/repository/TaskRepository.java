package com.pink.itms.repository;

import com.pink.itms.model.Role;
import com.pink.itms.model.Task;
import com.pink.itms.model.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    Optional<Task> findByIdAndIsActiveTrue(Long id);
    List<Task> findAllByIsActiveTrue();
    List<Task> findAllByUsers_IdAndIsActiveTrue(Long userId);}

