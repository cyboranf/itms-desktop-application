package com.pink.itms.mapper;

import com.pink.itms.config.security.AesCbcCrypt;
import com.pink.itms.dto.register.RegisterRequestDTO;
import com.pink.itms.dto.register.RegisterResponseDTO;
import com.pink.itms.exception.aes.CipherDefectedException;
import com.pink.itms.exception.aes.InvalidKeyLengthException;
import com.pink.itms.exception.role.RoleNotFoundException;
import com.pink.itms.model.Role;
import com.pink.itms.model.User;
import com.pink.itms.repository.RoleRepository;
import com.pink.itms.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Component
public class RegisterMapper {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;
    private final AesCbcCrypt crypt;

    public RegisterMapper(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, AesCbcCrypt crypt) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.crypt = crypt;
    }

    public User toEntity(RegisterRequestDTO registerRequestDTO) {
        User user = new User();
        user.setUsername(registerRequestDTO.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequestDTO.getPassword()));
        user.setName(registerRequestDTO.getName());
        user.setLastname(registerRequestDTO.getLastname());
        user.setPhoneNumber(registerRequestDTO.getPhoneNumber());
        user.setEmail(registerRequestDTO.getEmail());


        try {
            user.setPesel(crypt.encrypt(registerRequestDTO.getPesel()));
        } catch (InvalidAlgorithmParameterException | IllegalBlockSizeException | BadPaddingException e) {
            throw new CipherDefectedException("Error: PESEL cipher has ben defected.");
        } catch (InvalidKeyException e) {
            throw new InvalidKeyLengthException("Error: AES encryption key length is invalid. Expected 16-byte key");        }


        Role userRole = roleRepository.findByName("User");
        if (userRole != null) {
            Set<Role> roles = new HashSet<>();
            roles.add(userRole);
            user.setRoles(roles);
        } else {
            throw new RoleNotFoundException("Error: Role is not found.");
        }

        return user;
    }

    public RegisterResponseDTO toDTO(User user) {
        RegisterResponseDTO registerResponseDTO = new RegisterResponseDTO();
        registerResponseDTO.setId(user.getId());
        registerResponseDTO.setUsername(user.getUsername());
        registerResponseDTO.setName(user.getName());
        registerResponseDTO.setLastname(user.getLastname());
        registerResponseDTO.setEmail(user.getEmail());
        registerResponseDTO.setPhoneNumber(user.getPhoneNumber());

        try {
            registerResponseDTO.setPesel(crypt.decrypt(user.getPesel()));
        } catch (InvalidAlgorithmParameterException | IllegalBlockSizeException | BadPaddingException e) {
            throw new CipherDefectedException("Error: PESEL cipher has ben defected.");
        } catch (InvalidKeyException e) {
            throw new InvalidKeyLengthException("Error: AES encryption key length is invalid. Expected 16-Byte key");
        }

        return registerResponseDTO;
    }
}
