package com.pink.itms.dto.register;

import com.pink.itms.model.Role;
import lombok.Data;

import java.util.Set;

@Data
public class RegisterResponseDTO {
    private Long id;
    private String username;
    private String name;
    private String lastname;
    private String pesel;
    private String email;
    private String phoneNumber;

}
