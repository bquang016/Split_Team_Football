package com.chimmoccanh.footballsquad.dto.request;

import com.chimmoccanh.footballsquad.model.enums.UserRole;
import com.chimmoccanh.footballsquad.model.enums.UserStatus;
import lombok.Data;

@Data
public class UpdateUserRequest {
    private String username;
    private String fullName;
    private Integer jerseyNumber;
    private String favoritePosition;
    private String email;
    private UserRole role;
    private UserStatus status;
}
