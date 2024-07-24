package com.pink.itms.dto.user;

import lombok.Data;

@Data
public class UserRequestDTO {
    private String username;
    private String name;
    private String lastname;
    private String pesel;
    private String email;
    private String phoneNumber;
}
