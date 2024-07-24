package com.pink.itms.model;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;

import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "product")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String code;
    private double width;
    private double height;
    private double length;
    private double weight;
    private Boolean isActive = true;

    @JsonBackReference
    @ManyToMany(mappedBy = "products")
    private Set<Task> tasks;
    @JsonManagedReference
    @OneToMany(mappedBy = "product")
    private Set<Warehouse> warehouses; // Set of products in the warehouse

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
