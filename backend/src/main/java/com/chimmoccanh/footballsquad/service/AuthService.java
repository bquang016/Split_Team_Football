package com.chimmoccanh.footballsquad.service;

import com.chimmoccanh.footballsquad.dto.request.LoginRequest;
import com.chimmoccanh.footballsquad.dto.request.RefreshTokenRequest;
import com.chimmoccanh.footballsquad.dto.request.RegisterRequest;
import com.chimmoccanh.footballsquad.dto.response.AuthResponse;
import com.chimmoccanh.footballsquad.dto.response.CheckAvailabilityResponse;
import com.chimmoccanh.footballsquad.dto.response.UserDto;
import com.chimmoccanh.footballsquad.exception.BadRequestException;
import com.chimmoccanh.footballsquad.exception.UnauthorizedException;
import com.chimmoccanh.footballsquad.model.User;
import com.chimmoccanh.footballsquad.model.enums.UserRole;
import com.chimmoccanh.footballsquad.model.enums.UserStatus;
import com.chimmoccanh.footballsquad.repository.MatchParticipantRepository;
import com.chimmoccanh.footballsquad.repository.UserRepository;
import com.chimmoccanh.footballsquad.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final MatchParticipantRepository participantRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public UserDto register(RegisterRequest request) {
        String trimmedUsername = request.getUsername().trim();
        if (userRepository.existsByUsernameIgnoreCase(trimmedUsername)) {
            throw new BadRequestException("Tên đăng nhập '" + trimmedUsername + "' đã tồn tại trong hệ thống, vui lòng chọn tên khác");
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            String trimmedEmail = request.getEmail().trim();
            if (userRepository.existsByEmailIgnoreCase(trimmedEmail)) {
                throw new BadRequestException("Email '" + trimmedEmail + "' đã được đăng ký trong hệ thống");
            }
        }

        if (request.getJerseyNumber() != null) {
            Integer jerseyNum = request.getJerseyNumber();
            if (jerseyNum < 1 || jerseyNum > 99) {
                throw new BadRequestException("Số áo thi đấu phải từ 1 đến 99");
            }
            if (userRepository.existsByJerseyNumberAndRoleNot(jerseyNum, UserRole.GUEST)) {
                throw new BadRequestException("Số áo " + jerseyNum + " đã có cầu thủ khác đăng ký trong hệ thống, vui lòng chọn số khác");
            }
            cedeGuestJerseyNumber(jerseyNum);
        }

        User user = User.builder()
                .username(request.getUsername().trim())
                .fullName(request.getFullName().trim())
                .jerseyNumber(request.getJerseyNumber())
                .favoritePosition(request.getFavoritePosition() != null && !request.getFavoritePosition().isBlank() ? request.getFavoritePosition().trim() : null)
                .email(request.getEmail() != null ? request.getEmail().trim() : null)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.PLAYER)
                .status(UserStatus.PENDING)
                .build();

        User savedUser = userRepository.save(user);
        return UserDto.fromEntity(savedUser);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Tên đăng nhập hoặc mật khẩu không chính xác"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Tên đăng nhập hoặc mật khẩu không chính xác");
        }

        if (user.getStatus() == UserStatus.PENDING) {
            throw new UnauthorizedException("Tài khoản của bạn đang chờ quản trị viên phê duyệt");
        }

        if (user.getStatus() == UserStatus.BANNED) {
            throw new UnauthorizedException("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên");
        }

        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getUsername(), user.getRole().name());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId(), user.getUsername());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(UserDto.fromEntity(user))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        if (!tokenProvider.validateToken(token)) {
            throw new UnauthorizedException("Refresh token không hợp lệ hoặc đã hết hạn");
        }

        String username = tokenProvider.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Không tìm thấy người dùng"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new UnauthorizedException("Tài khoản không ở trạng thái hoạt động");
        }

        String newAccessToken = tokenProvider.generateAccessToken(user.getId(), user.getUsername(), user.getRole().name());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(token)
                .tokenType("Bearer")
                .user(UserDto.fromEntity(user))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse quickLogin(java.util.UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.chimmoccanh.footballsquad.exception.ResourceNotFoundException("Không tìm thấy người dùng"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BadRequestException("Tài khoản chưa được kích hoạt hoặc đã bị khóa");
        }

        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getUsername(), user.getRole().name());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId(), user.getUsername());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(UserDto.fromEntity(user))
                .build();
    }

    @Transactional(readOnly = true)
    public java.util.List<UserDto> getQuickUsers() {
        return userRepository.findByStatus(UserStatus.ACTIVE).stream()
                .map(UserDto::fromEntity)
                .collect(java.util.stream.Collectors.toList());
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
    public CheckAvailabilityResponse checkAvailability(String username, String email, Integer jerseyNumber, java.util.UUID excludeUserId, Boolean forGuest) {
        CheckAvailabilityResponse.CheckAvailabilityResponseBuilder builder = CheckAvailabilityResponse.builder()
                .usernameAvailable(true)
                .emailAvailable(true)
                .jerseyNumberAvailable(true);

        if (username != null && !username.isBlank()) {
            String trimmed = username.trim();
            boolean exists = excludeUserId != null
                    ? userRepository.existsByUsernameIgnoreCaseAndIdNot(trimmed, excludeUserId)
                    : userRepository.existsByUsernameIgnoreCase(trimmed);
            if (exists) {
                builder.usernameAvailable(false);
                builder.usernameError("Tên đăng nhập '" + trimmed + "' đã tồn tại trong hệ thống, vui lòng chọn tên khác");
            }
        }

        if (email != null && !email.isBlank()) {
            String trimmed = email.trim();
            boolean exists = excludeUserId != null
                    ? userRepository.existsByEmailIgnoreCaseAndIdNot(trimmed, excludeUserId)
                    : userRepository.existsByEmailIgnoreCase(trimmed);
            if (exists) {
                builder.emailAvailable(false);
                builder.emailError("Email '" + trimmed + "' đã được sử dụng bởi tài khoản khác trong hệ thống");
            }
        }

        if (jerseyNumber != null) {
            if (jerseyNumber < 1 || jerseyNumber > 99) {
                builder.jerseyNumberAvailable(false);
                builder.jerseyNumberError("Số áo phải nằm trong khoảng từ 1 đến 99");
            } else if (Boolean.TRUE.equals(forGuest)) {
                // Guests cannot take any existing jersey (real or guest)
                if (userRepository.existsByJerseyNumber(jerseyNumber)) {
                    builder.jerseyNumberAvailable(false);
                    builder.jerseyNumberError("Số áo " + jerseyNumber + " đã có người sử dụng trong hệ thống, không thể chọn cho khách");
                }
            } else {
                // Real players are only blocked by other real players (not guests)
                boolean exists = excludeUserId != null
                        ? userRepository.existsByJerseyNumberAndRoleNotAndIdNot(jerseyNumber, UserRole.GUEST, excludeUserId)
                        : userRepository.existsByJerseyNumberAndRoleNot(jerseyNumber, UserRole.GUEST);
                if (exists) {
                    builder.jerseyNumberAvailable(false);
                    builder.jerseyNumberError("Số áo " + jerseyNumber + " đã có cầu thủ khác đăng ký trong hệ thống");
                }
            }
        }

        return builder.build();
    }
}
