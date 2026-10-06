package com.chimmoccanh.footballsquad.service;

import com.chimmoccanh.footballsquad.dto.request.UpdateProfileRequest;
import com.chimmoccanh.footballsquad.dto.request.UpdateUserRequest;
import com.chimmoccanh.footballsquad.dto.response.UserDto;
import com.chimmoccanh.footballsquad.exception.BadRequestException;
import com.chimmoccanh.footballsquad.exception.ResourceNotFoundException;
import com.chimmoccanh.footballsquad.model.User;
import com.chimmoccanh.footballsquad.model.enums.UserStatus;
import com.chimmoccanh.footballsquad.model.enums.UserRole;
import com.chimmoccanh.footballsquad.repository.MatchParticipantRepository;
import com.chimmoccanh.footballsquad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final MatchParticipantRepository participantRepository;
    private final R2StorageService r2StorageService;
    private final PasswordEncoder passwordEncoder;

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
        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            String newUsername = request.getUsername().trim();
            if (!newUsername.equalsIgnoreCase(user.getUsername())) {
                if (userRepository.existsByUsernameIgnoreCaseAndIdNot(newUsername, id)) {
                    throw new BadRequestException("Tên đăng nhập '" + newUsername + "' đã tồn tại trong hệ thống, vui lòng chọn tên khác");
                }
                user.setUsername(newUsername);
            }
        }
        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getJerseyNumber() != null) {
            Integer newJersey = request.getJerseyNumber();
            if (newJersey < 1 || newJersey > 99) {
                throw new BadRequestException("Số áo phải nằm trong khoảng từ 1 đến 99");
            }
            if (!newJersey.equals(user.getJerseyNumber())) {
                if (userRepository.existsByJerseyNumberAndRoleNotAndIdNot(newJersey, UserRole.GUEST, id)) {
                    throw new BadRequestException("Số áo " + newJersey + " đã có cầu thủ khác đăng ký trong hệ thống, vui lòng chọn số khác");
                }
                cedeGuestJerseyNumber(newJersey);
            }
            user.setJerseyNumber(newJersey);
        }
        if (request.getFavoritePosition() != null) {
            user.setFavoritePosition(request.getFavoritePosition().trim());
        }
        if (request.getEmail() != null) {
            String newEmail = request.getEmail().trim();
            if (newEmail.isBlank()) {
                user.setEmail(null);
            } else if (!newEmail.equalsIgnoreCase(user.getEmail())) {
                if (userRepository.existsByEmailIgnoreCaseAndIdNot(newEmail, id)) {
                    throw new BadRequestException("Email '" + newEmail + "' đã được sử dụng bởi tài khoản khác trong hệ thống");
                }
                user.setEmail(newEmail);
            }
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }
        return UserDto.fromEntity(userRepository.save(user));
    }

    @Transactional
    public UserDto updateProfile(UUID id, UpdateProfileRequest request) {
        User user = getUserEntity(id);

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            String newUsername = request.getUsername().trim();
            if (!newUsername.equalsIgnoreCase(user.getUsername())) {
                if (userRepository.existsByUsernameIgnoreCaseAndIdNot(newUsername, id)) {
                    throw new BadRequestException("Tên đăng nhập '" + newUsername + "' đã tồn tại trong hệ thống, vui lòng chọn tên khác");
                }
                user.setUsername(newUsername);
            }
        }

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }

        if (request.getEmail() != null) {
            String newEmail = request.getEmail().trim();
            if (newEmail.isBlank()) {
                user.setEmail(null);
            } else if (!newEmail.equalsIgnoreCase(user.getEmail())) {
                if (userRepository.existsByEmailIgnoreCaseAndIdNot(newEmail, id)) {
                    throw new BadRequestException("Email '" + newEmail + "' đã được sử dụng bởi tài khoản khác trong hệ thống");
                }
                user.setEmail(newEmail);
            }
        }

        if (request.getJerseyNumber() != null) {
            Integer newJersey = request.getJerseyNumber();
            if (newJersey < 1 || newJersey > 99) {
                throw new BadRequestException("Số áo phải nằm trong khoảng từ 1 đến 99");
            }
            if (!newJersey.equals(user.getJerseyNumber())) {
                if (userRepository.existsByJerseyNumberAndRoleNotAndIdNot(newJersey, UserRole.GUEST, id)) {
                    throw new BadRequestException("Số áo " + newJersey + " đã có cầu thủ khác đăng ký trong hệ thống, vui lòng chọn số khác");
                }
                cedeGuestJerseyNumber(newJersey);
            }
            user.setJerseyNumber(newJersey);
        }

        if (request.getFavoritePosition() != null) {
            user.setFavoritePosition(request.getFavoritePosition().trim());
        }

        // Change password if requested
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                throw new BadRequestException("Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
                throw new BadRequestException("Mật khẩu hiện tại không chính xác");
            }
            if (request.getNewPassword().length() < 6) {
                throw new BadRequestException("Mật khẩu mới phải có ít nhất 6 ký tự");
            }
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        }

        User saved = userRepository.save(user);
        return UserDto.fromEntity(saved);
    }

    private void cedeGuestJerseyNumber(Integer jerseyNumber) {
        if (jerseyNumber == null) return;
        List<User> guests = userRepository.findByJerseyNumberAndRole(jerseyNumber, UserRole.GUEST);
        for (User guest : guests) {
            guest.setJerseyNumber(null);
            userRepository.saveAndFlush(guest);
            participantRepository.findByUserId(guest.getId()).forEach(p -> {
                p.setJerseyNumber(null);
                participantRepository.saveAndFlush(p);
            });
        }
    }

    @Transactional(readOnly = true)
    public List<UserDto> getActivePlayers() {
        return userRepository.findByStatus(UserStatus.ACTIVE).stream()
                .filter(u -> u.getRole() != UserRole.GUEST)
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto updateAvatar(UUID id, org.springframework.web.multipart.MultipartFile file) {
        User user = getUserEntity(id);
        String oldAvatarUrl = user.getAvatarUrl();

        String newAvatarUrl = r2StorageService.uploadAvatar(file, id);
        user.setAvatarUrl(newAvatarUrl);
        User saved = userRepository.save(user);

        // Delete old avatar if it was hosted on R2
        if (oldAvatarUrl != null && !oldAvatarUrl.isBlank()) {
            r2StorageService.deleteFile(oldAvatarUrl);
        }

        return UserDto.fromEntity(saved);
    }

    @Transactional
    public UserDto removeAvatar(UUID id) {
        User user = getUserEntity(id);
        String oldAvatarUrl = user.getAvatarUrl();

        user.setAvatarUrl(null);
        User saved = userRepository.save(user);

        if (oldAvatarUrl != null && !oldAvatarUrl.isBlank()) {
            r2StorageService.deleteFile(oldAvatarUrl);
        }

        return UserDto.fromEntity(saved);
    }
}
