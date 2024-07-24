package com.pink.itms.dto.login;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Data
public class LoginResponseDTO {
    private Long id;
    private String accessToken;
    private String tokenType = "Bearer";
    private String userName;
    private Collection<?> rank;

    public LoginResponseDTO(Long id, String accessToken, String userName, Collection<?> rank) {
        this.id = id;
        this.accessToken = accessToken;
        this.userName = userName;
        this.rank = rank;
    }
}
