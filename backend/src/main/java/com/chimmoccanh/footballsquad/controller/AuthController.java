package com.chimmoccanh.footballsquad.controller;

import com.chimmoccanh.footballsquad.dto.request.LoginRequest;
import com.chimmoccanh.footballsquad.dto.request.RefreshTokenRequest;
import com.chimmoccanh.footballsquad.dto.request.RegisterRequest;
import com.chimmoccanh.footballsquad.dto.response.ApiResponse;
import com.chimmoccanh.footballsquad.dto.response.AuthResponse;
import com.chimmoccanh.footballsquad.dto.response.UserDto;
import com.chimmoccanh.footballsquad.security.CustomUserDetails;
import com.chimmoccanh.footballsquad.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDto>> register(@Valid @RequestBody RegisterRequest request) {
        UserDto userDto = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Đăng ký thành công! Vui lòng chờ quản trị viên phê duyệt tài khoản.", userDto));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Đăng nhập thành công", authResponse));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse authResponse = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.ok("Làm mới token thành công", authResponse));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getMe(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        }
        return ResponseEntity.ok(ApiResponse.ok(UserDto.fromEntity(userDetails.getUser())));
    }

    @RequestMapping(value = "/logout", method = {RequestMethod.POST, RequestMethod.GET})
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.ok("Đăng xuất thành công", null));
    }

    @PostMapping("/quick-login/{userId}")
    public ResponseEntity<ApiResponse<AuthResponse>> quickLogin(@PathVariable java.util.UUID userId) {
        AuthResponse authResponse = authService.quickLogin(userId);
        return ResponseEntity.ok(ApiResponse.ok("Đã chuyển đổi tài khoản thành công", authResponse));
    }

    @GetMapping("/quick-users")
    public ResponseEntity<ApiResponse<java.util.List<UserDto>>> getQuickUsers() {
        java.util.List<UserDto> users = authService.getQuickUsers();
        return ResponseEntity.ok(ApiResponse.ok(users));
    }
}
