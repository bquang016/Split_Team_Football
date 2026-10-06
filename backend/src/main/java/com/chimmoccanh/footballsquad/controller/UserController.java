package com.chimmoccanh.footballsquad.controller;

import com.chimmoccanh.footballsquad.dto.response.ApiResponse;
import com.chimmoccanh.footballsquad.dto.response.UserDto;
import com.chimmoccanh.footballsquad.exception.BadRequestException;
import com.chimmoccanh.footballsquad.model.enums.UserRole;
import com.chimmoccanh.footballsquad.security.CustomUserDetails;
import com.chimmoccanh.footballsquad.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping(value = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UserDto>> uploadMyAvatar(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Vui lòng đăng nhập để tải ảnh đại diện"));
        }

        UserDto updated = userService.updateAvatar(userDetails.getId(), file);
        return ResponseEntity.ok(ApiResponse.ok("Tải ảnh đại diện lên thành công", updated));
    }

    @DeleteMapping("/me/avatar")
    public ResponseEntity<ApiResponse<UserDto>> removeMyAvatar(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Vui lòng đăng nhập để xóa ảnh đại diện"));
        }

        UserDto updated = userService.removeAvatar(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Đã xóa ảnh đại diện", updated));
    }

    @PostMapping(value = "/{id}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UserDto>> uploadUserAvatar(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Vui lòng đăng nhập"));
        }

        boolean isSelf = userDetails.getId().equals(id);
        boolean isAdmin = userDetails.getUser().getRole() == UserRole.ADMIN;
        if (!isSelf && !isAdmin) {
            throw new BadRequestException("Bạn không có quyền thay đổi ảnh đại diện của thành viên khác");
        }

        UserDto updated = userService.updateAvatar(id, file);
        return ResponseEntity.ok(ApiResponse.ok("Đã cập nhật ảnh đại diện thành công", updated));
    }

    @DeleteMapping("/{id}/avatar")
    public ResponseEntity<ApiResponse<UserDto>> removeUserAvatar(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Vui lòng đăng nhập"));
        }

        boolean isSelf = userDetails.getId().equals(id);
        boolean isAdmin = userDetails.getUser().getRole() == UserRole.ADMIN;
        if (!isSelf && !isAdmin) {
            throw new BadRequestException("Bạn không có quyền xóa ảnh đại diện của thành viên khác");
        }

        UserDto updated = userService.removeAvatar(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã xóa ảnh đại diện thành công", updated));
    }

    @PutMapping("/me/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateMyProfile(
            @jakarta.validation.Valid @RequestBody com.chimmoccanh.footballsquad.dto.request.UpdateProfileRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Vui lòng đăng nhập để cập nhật thông tin"));
        }

        UserDto updated = userService.updateProfile(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật thông tin thành công", updated));
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateUserProfile(
            @PathVariable UUID id,
            @jakarta.validation.Valid @RequestBody com.chimmoccanh.footballsquad.dto.request.UpdateProfileRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Vui lòng đăng nhập"));
        }

        boolean isSelf = userDetails.getId().equals(id);
        boolean isAdmin = userDetails.getUser().getRole() == UserRole.ADMIN;
        if (!isSelf && !isAdmin) {
            throw new BadRequestException("Bạn không có quyền chỉnh sửa thông tin của thành viên khác");
        }

        UserDto updated = userService.updateProfile(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật thông tin thành công", updated));
    }
}
