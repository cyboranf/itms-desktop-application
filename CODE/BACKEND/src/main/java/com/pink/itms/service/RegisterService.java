package com.pink.itms.service;

import com.pink.itms.dto.register.RegisterRequestDTO;
import com.pink.itms.dto.register.RegisterResponseDTO;
import com.pink.itms.mapper.RegisterMapper;
import com.pink.itms.model.User;
import com.pink.itms.repository.UserRepository;
import com.pink.itms.validation.RegisterValidator;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

/**
 * Service class for user registration logic.
 */
@Service
@Transactional
public class RegisterService {
    private final UserRepository userRepository;
    private final RegisterMapper registerMapper;
    private final RegisterValidator registerValidator;
    /**
     * Constructor for RegisterService.
     *
     * @param userRepository     the UserRepository instance to interact with user data.
     * @param registerMapper     the RegisterMapper instance for mapping DTOs to entities and vice versa.
     * @param registerValidator  the RegisterValidator instance for validation logic.
     */
    public RegisterService(UserRepository userRepository, RegisterMapper registerMapper, RegisterValidator registerValidator) {
        this.userRepository = userRepository;
        this.registerMapper = registerMapper;
        this.registerValidator = registerValidator;
    }
    /**
     * Creates a new user account.
     *
     * @param registerRequestDTO the DTO containing registration details.
     * @return RegisterResponseDTO containing the response for the registration request.
     */
    public RegisterResponseDTO createAccount(RegisterRequestDTO registerRequestDTO) {
        registerValidator.registerValidation(registerRequestDTO);
        User user = registerMapper.toEntity(registerRequestDTO);
        User savedUser = userRepository.save(user);
        return registerMapper.toDTO(savedUser);
    }
}
