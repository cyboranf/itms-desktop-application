package com.pink.itms.mapper;

import com.pink.itms.config.security.AesCbcCrypt;
import com.pink.itms.dto.user.UserRequestDTO;
import com.pink.itms.dto.user.UserResponseDTO;
import com.pink.itms.dto.user.UserResponseWithoutTasksDTO;
import com.pink.itms.exception.aes.CipherDefectedException;
import com.pink.itms.exception.aes.InvalidKeyLengthException;
import com.pink.itms.exception.user.UserNotFoundException;
import com.pink.itms.model.Role;
import com.pink.itms.model.User;
import com.pink.itms.repository.UserRepository;
import com.pink.itms.service.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserMapper {
    private final UserRepository userRepository;
    private final AesCbcCrypt crypt;

    public UserMapper(UserRepository userRepository, AesCbcCrypt crypt) {
        this.userRepository = userRepository;
        this.crypt = crypt;
    }

    public static Set<pdf.generator.model.User> toPdfUserSet(Set<UserResponseWithoutTasksDTO> users) {
        return users.stream()
                .map(UserMapper::toPdfUser)
                .collect(Collectors.toSet());
    }

    public User dtoToEntity(UserRequestDTO userRequestDTO) {
        User user = new User();
        BeanUtils.copyProperties(userRequestDTO, user);
        user.setIsActive(true);
        return user;
    }

    public UserResponseDTO entityToDto(User user) {
        UserResponseDTO userResponseDTO = new UserResponseDTO();
        BeanUtils.copyProperties(user, userResponseDTO);
        userResponseDTO.setTasks(userRepository.findById(user.getId()).orElseThrow(() -> new UserNotFoundException("User not found")).getTasks());
        userResponseDTO.setIsActive(user.getIsActive());
        userResponseDTO.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.joining(", ")));

        return userResponseDTO;
    }

    public UserResponseWithoutTasksDTO entityToDtoWithoutTasks(User user) {
        UserResponseWithoutTasksDTO userResponseWithoutTasksDTO = new UserResponseWithoutTasksDTO();
        userResponseWithoutTasksDTO.setId(user.getId());
        userResponseWithoutTasksDTO.setUsername(user.getUsername());
        userResponseWithoutTasksDTO.setName(user.getName());
        userResponseWithoutTasksDTO.setLastname(user.getLastname());
        try {
            userResponseWithoutTasksDTO.setPesel(crypt.decrypt(user.getPesel()));
        } catch (InvalidAlgorithmParameterException | IllegalBlockSizeException | BadPaddingException e) {
            throw new CipherDefectedException("Error: PESEL cipher has ben defected.");
        } catch (InvalidKeyException e) {
            throw new InvalidKeyLengthException("Error: AES encryption key length is invalid. Expected 16-Byte key");
        }
        userResponseWithoutTasksDTO.setEmail(user.getEmail());
        userResponseWithoutTasksDTO.setPhoneNumber(user.getPhoneNumber());
        userResponseWithoutTasksDTO.setIsActive(user.getIsActive());
        userResponseWithoutTasksDTO.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.joining(", ")));

        return userResponseWithoutTasksDTO;
    }

    public static pdf.generator.model.User toPdfUser(UserResponseWithoutTasksDTO user) {
        pdf.generator.model.User pdfUser = new pdf.generator.model.User();
        pdfUser.setId(user.getId());
        pdfUser.setUsername(user.getUsername());
        pdfUser.setName(user.getName());
        pdfUser.setLastname(user.getLastname());
        pdfUser.setPesel(user.getPesel());
        pdfUser.setEmail(user.getEmail());
        pdfUser.setPhoneNumber(user.getPhoneNumber());
        pdfUser.setActive(user.getIsActive());
        return pdfUser;
    }

    public static List<pdf.generator.model.User> toPdfUserList(List<UserResponseWithoutTasksDTO> users) {
        return users.stream()
                .map(UserMapper::toPdfUser)
                .collect(Collectors.toList());
    }

    public void updateUserFromRequestDTO(UserRequestDTO dto, User user) {
        User tempUser = new User();
        BeanUtils.copyProperties(dto, tempUser, "id", "password", "roles");
        try {
            String encryptedPesel = crypt.encrypt(dto.getPesel());
            tempUser.setPesel(encryptedPesel);
        } catch (InvalidAlgorithmParameterException | IllegalBlockSizeException | BadPaddingException e) {
            throw new CipherDefectedException("Error: PESEL cipher has been defected.");
        } catch (InvalidKeyException e) {
            throw new InvalidKeyLengthException("Error: AES encryption key length is invalid. Expected 16-Byte key");
        }
        BeanUtils.copyProperties(tempUser, user, "id", "password", "roles");
    }
}
