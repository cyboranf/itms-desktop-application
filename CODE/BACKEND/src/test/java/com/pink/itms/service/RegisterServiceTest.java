package com.pink.itms.service;

import com.pink.itms.dto.register.RegisterRequestDTO;
import com.pink.itms.dto.register.RegisterResponseDTO;
import com.pink.itms.mapper.RegisterMapper;
import com.pink.itms.model.User;
import com.pink.itms.repository.UserRepository;
import com.pink.itms.validation.RegisterValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.assertj.core.api.Assertions.assertThat;

public class RegisterServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RegisterMapper registerMapper;

    @Mock
    private RegisterValidator registerValidator;

    @InjectMocks
    private RegisterService registerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateAccount() {
        RegisterRequestDTO requestDTO = new RegisterRequestDTO();
        User user = new User();
        RegisterResponseDTO responseDTO = new RegisterResponseDTO();

        when(registerMapper.toEntity(any(RegisterRequestDTO.class))).thenReturn(user);
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(registerMapper.toDTO(any(User.class))).thenReturn(responseDTO);

        RegisterResponseDTO resultDTO = registerService.createAccount(requestDTO);

        verify(registerValidator).registerValidation(requestDTO);
        verify(registerMapper).toEntity(requestDTO);
        verify(userRepository).save(user);
        verify(registerMapper).toDTO(user);

        assertThat(resultDTO).isSameAs(responseDTO);
    }
}
