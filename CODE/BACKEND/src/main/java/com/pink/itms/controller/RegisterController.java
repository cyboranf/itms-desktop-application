package com.pink.itms.controller;

import com.pink.itms.dto.register.RegisterRequestDTO;
import com.pink.itms.dto.register.RegisterResponseDTO;
import com.pink.itms.service.RegisterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
/**
 * Controller class for handling user registration.
 */
@RestController
@RequestMapping("/api")
public class RegisterController {
    private final RegisterService registerService;
    /**
     * Constructor for RegisterController.
     *
     * @param registerService the RegisterService instance to handle registration logic.
     */
    public RegisterController(RegisterService registerService) {
        this.registerService = registerService;
    }
    /**
     * Endpoint to register a new user.
     *
     * @param registerRequestDTO the DTO containing registration details.
     * @return ResponseEntity containing the response DTO with registration status.
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> registerUser(@RequestBody RegisterRequestDTO registerRequestDTO) {
        RegisterResponseDTO registerResponseDTO = registerService.createAccount(registerRequestDTO);
        return new ResponseEntity<>(registerResponseDTO, HttpStatus.CREATED);
    }
}
