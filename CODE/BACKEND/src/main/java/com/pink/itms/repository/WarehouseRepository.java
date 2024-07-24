package com.pink.itms.repository;

import com.pink.itms.model.TaskType;
import com.pink.itms.model.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    Optional<Warehouse> findByIdAndIsActiveTrue(Long id);
    List<Warehouse> findAllByIsActiveTrue();
}
