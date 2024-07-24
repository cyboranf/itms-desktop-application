package com.pink.itms.validation;

import com.pink.itms.dto.register.RegisterRequestDTO;
import com.pink.itms.dto.user.UserRequestDTO;
import com.pink.itms.exception.user.*;
import com.pink.itms.model.User;
import com.pink.itms.repository.UserRepository;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class UserValidator {
    private final UserRepository userRepository;
    private final TaskValidator taskValidator;

    public UserValidator(UserRepository userRepository, TaskValidator taskValidator) {
        this.userRepository = userRepository;
        this.taskValidator = taskValidator;
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
     * @throws ExistingUsernameException if the username already exists in the system
     * @throws InvalidUsernameException  if the username does not meet length requirements
     * @throws InvalidPasswordException  if the password does not meet complexity requirements
     * @throws InvalidEmailException     if the password and confirm password do not match
     */
    public User userEditValidation(Long id, UserRequestDTO userRequestDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Can not found User with id = " + id));

        // Check if the username meets length requirements
        if (userRequestDTO.getUsername().length() < 6 || userRequestDTO.getUsername().length() > 12) {
            throw new InvalidUsernameException("Username must have between 6 and 12 characters in length.");
        }

        // Check if the email follows a valid email format
        if (!EMAIL_PATTERN.matcher(userRequestDTO.getEmail()).matches()) {
            throw new InvalidEmailException("Email does not follow a valid format.");
        }
        return user;
    }
}
