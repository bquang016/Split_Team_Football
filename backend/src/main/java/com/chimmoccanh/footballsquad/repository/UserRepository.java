package com.chimmoccanh.footballsquad.repository;

import com.chimmoccanh.footballsquad.model.User;
import com.chimmoccanh.footballsquad.model.enums.UserRole;
import com.chimmoccanh.footballsquad.model.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByUsernameIgnoreCase(String username);
    boolean existsByUsernameIgnoreCaseAndIdNot(String username, UUID id);
    boolean existsByEmail(String email);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCaseAndIdNot(String email, UUID id);
    boolean existsByJerseyNumber(Integer jerseyNumber);
    boolean existsByJerseyNumberAndIdNot(Integer jerseyNumber, UUID id);
    boolean existsByJerseyNumberAndRoleNot(Integer jerseyNumber, UserRole role);
    boolean existsByJerseyNumberAndRoleNotAndIdNot(Integer jerseyNumber, UserRole role, UUID id);
    List<User> findByJerseyNumberAndRole(Integer jerseyNumber, UserRole role);
    List<User> findByStatus(UserStatus status);
    List<User> findByRole(UserRole role);
    long countByRole(UserRole role);
}
