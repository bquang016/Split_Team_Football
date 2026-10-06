package com.chimmoccanh.footballsquad.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @Size(max = 100, message = "Họ và tên không được vượt quá 100 ký tự")
    private String fullName;

    @Size(min = 3, max = 50, message = "Tên đăng nhập từ 3 đến 50 ký tự")
    private String username;

    @Email(message = "Email không đúng định dạng")
    private String email;

    private Integer jerseyNumber;

    private String favoritePosition;

    // Optional password change
    private String currentPassword;

    @Size(min = 6, message = "Mật khẩu mới phải có ít nhất 6 ký tự")
    private String newPassword;
}
