package com.pink.itms.dto.user;

import com.pink.itms.model.Task;
import lombok.Data;

import java.util.Set;

@Data
public class UserResponseDTO {
    private Long id;
    private String username;
    private String name;
    private String lastname;
    private String pesel;
    private String email;
    private String phoneNumber;
    private Set<Task> tasks;
    private Boolean isActive;
    private String roles;
}
