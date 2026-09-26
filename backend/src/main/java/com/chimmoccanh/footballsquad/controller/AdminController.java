package com.chimmoccanh.footballsquad.controller;

import com.chimmoccanh.footballsquad.dto.request.UpdateUserRequest;
import com.chimmoccanh.footballsquad.dto.response.ApiResponse;
import com.chimmoccanh.footballsquad.dto.response.UserDto;
import com.chimmoccanh.footballsquad.model.enums.UserStatus;
import com.chimmoccanh.footballsquad.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getUsers(@RequestParam(required = false) UserStatus status) {
        List<UserDto> users = userService.getAllUsers(status);
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @PatchMapping("/users/{id}/approve")
    public ResponseEntity<ApiResponse<UserDto>> approveUser(@PathVariable UUID id) {
        UserDto user = userService.approveUser(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã phê duyệt tài khoản thành công", user));
    }

    @PatchMapping("/users/{id}/ban")
    public ResponseEntity<ApiResponse<UserDto>> banUser(@PathVariable UUID id) {
        UserDto user = userService.banUser(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã khóa tài khoản", user));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(@PathVariable UUID id, @RequestBody UpdateUserRequest request) {
        UserDto user = userService.updateUser(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Đã cập nhật thông tin người dùng", user));
    }
}
