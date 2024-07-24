package com.pink.itms.dto.user;

import lombok.Data;

@Data
public class UserResponseWithoutTasksDTO {
    private Long id;
    private String username;
    private String name;
    private String lastname;
    private String pesel;
    private String email;
    private String phoneNumber;
    private Boolean isActive;
    private String roles;

}
