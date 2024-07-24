package com.pink.itms.repository;

import com.pink.itms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByIdAndIsActiveTrue(Long id);
    List<User> findAllByIsActiveTrue();
    Optional<User> findByEmail(String email);
    List<User> findAllByRolesNameAndIsActiveTrue(String roleName);
}
