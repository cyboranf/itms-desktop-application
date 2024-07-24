package com.pink.itms.controller;

import com.pink.itms.dto.register.RegisterRequestDTO;
import com.pink.itms.dto.register.RegisterResponseDTO;
import com.pink.itms.service.RegisterService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.assertj.core.api.Assertions.assertThat;

public class RegisterControllerTest {

    @Mock
    private RegisterService registerService;

    @InjectMocks
    private RegisterController registerController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterUser() {
        RegisterRequestDTO requestDTO = new RegisterRequestDTO();
        RegisterResponseDTO responseDTO = new RegisterResponseDTO();
        when(registerService.createAccount(any(RegisterRequestDTO.class))).thenReturn(responseDTO);

        ResponseEntity<RegisterResponseDTO> response = registerController.registerUser(requestDTO);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isEqualTo(responseDTO);
    }
}
