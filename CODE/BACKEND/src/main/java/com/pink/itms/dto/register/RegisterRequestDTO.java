package com.pink.itms.dto.register;

import lombok.Data;
import lombok.Getter;

@Data
public class RegisterRequestDTO {
    @Getter
    private String username;
    private String password;
    private String confirmPassword;
    private String email;
    @Getter
    private String name;
    private String lastname;
    private String pesel;
    private String phoneNumber;

}
