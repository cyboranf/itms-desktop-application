package com.pink.itms.repository;

import com.pink.itms.model.Product;
import com.pink.itms.model.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByIsActiveTrue();
}
