package com.pink.itms.model;

import javax.persistence.*;
import lombok.Data;

import java.util.Set;

@Entity
@Table(name = "type")
@Data
public class TaskType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Boolean isActive = true;
    @OneToMany(mappedBy = "type")
    private Set<Task> tasks;

    @Override
    public String toString() {
        return "TaskType{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
