package com.pink.itms.validation;

import com.pink.itms.dto.register.RegisterRequestDTO;
import com.pink.itms.exception.user.*;
import com.pink.itms.repository.UserRepository;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class RegisterValidator {
    private final UserRepository userRepository;

    public RegisterValidator(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,50}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    /**
     * Validates the registration request data with the following rules:
     * - Username must be unique.
     * - Username must be between 6 and 12 characters in length.
     * - Password must be between 8 and 50 characters, contain at least one special character, and one number.
     * - Password and Confirm Password fields must match.
     * - Email must follow a valid email format.
     *
     * @param registerRequestDTO the registration request data transfer object
     * @throws ExistingUsernameException if the username already exists in the system
     * @throws InvalidUsernameException  if the username does not meet length requirements
     * @throws InvalidPasswordException  if the password does not meet complexity requirements
     * @throws InvalidEmailException     if the password and confirm password do not match
     */
    public void registerValidation(RegisterRequestDTO registerRequestDTO) {
        // Check if the username already exists
        if (userRepository.findByUsername(registerRequestDTO.getUsername()).isPresent() && userRepository.findByUsername(registerRequestDTO.getUsername()).get().getIsActive()) {
            throw new ExistingUsernameException("Account with username: " + registerRequestDTO.getUsername() + " already exists.");
        }
        // Check if the username meets length requirements
        if (registerRequestDTO.getUsername().length() < 6 || registerRequestDTO.getUsername().length() > 12) {
            throw new InvalidUsernameException("Username must have between 6 and 12 characters in length.");
        }
        // Check if the password meets the pattern requirements
        if (!PASSWORD_PATTERN.matcher(registerRequestDTO.getPassword()).matches()) {
            throw new InvalidPasswordException("Password must be between 8 and 50 characters, include at least one special character and one number.");
        }
        // Check if password and confirm password fields match
        if (!registerRequestDTO.getPassword().equals(registerRequestDTO.getConfirmPassword())) {
            throw new PasswordNotMatchingException("Password field and Confirm Password field are not the same.");
        }
        // Check if the email follows a valid email format
        if (!EMAIL_PATTERN.matcher(registerRequestDTO.getEmail()).matches()) {
            throw new InvalidEmailException("Email does not follow a valid format.");
        }
        if (userRepository.findByEmail(registerRequestDTO.getEmail()).isPresent() && userRepository.findByEmail(registerRequestDTO.getEmail()).get().getIsActive()) {
            throw new ExistingEmailException("Account with email: " + registerRequestDTO.getEmail() + " already exists.");
        }
    }
}
