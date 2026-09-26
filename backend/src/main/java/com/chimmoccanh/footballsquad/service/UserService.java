package com.chimmoccanh.footballsquad.service;

import com.chimmoccanh.footballsquad.dto.request.UpdateUserRequest;
import com.chimmoccanh.footballsquad.dto.response.UserDto;
import com.chimmoccanh.footballsquad.exception.ResourceNotFoundException;
import com.chimmoccanh.footballsquad.model.User;
import com.chimmoccanh.footballsquad.model.enums.UserStatus;
import com.chimmoccanh.footballsquad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers(UserStatus status) {
        List<User> users;
        if (status != null) {
            users = userRepository.findByStatus(status);
        } else {
            users = userRepository.findAll();
        }
        return users.stream().map(UserDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));
        return UserDto.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public User getUserEntity(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));
    }

    @Transactional
    public UserDto approveUser(UUID id) {
        User user = getUserEntity(id);
        user.setStatus(UserStatus.ACTIVE);
        return UserDto.fromEntity(userRepository.save(user));
    }

    @Transactional
    public UserDto banUser(UUID id) {
        User user = getUserEntity(id);
        user.setStatus(UserStatus.BANNED);
        return UserDto.fromEntity(userRepository.save(user));
    }

    @Transactional
    public UserDto updateUser(UUID id, UpdateUserRequest request) {
        User user = getUserEntity(id);
        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getJerseyNumber() != null) {
            user.setJerseyNumber(request.getJerseyNumber());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail().trim());
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }
        return UserDto.fromEntity(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<UserDto> getActivePlayers() {
        return userRepository.findByStatus(UserStatus.ACTIVE).stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }
}
