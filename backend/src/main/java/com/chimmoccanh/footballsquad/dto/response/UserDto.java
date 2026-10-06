package com.chimmoccanh.footballsquad.dto.response;

import com.chimmoccanh.footballsquad.model.User;
import com.chimmoccanh.footballsquad.model.enums.UserRole;
import com.chimmoccanh.footballsquad.model.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private UUID id;
    private String username;
    private String fullName;
    private Integer jerseyNumber;
    private String avatarUrl;
    private String email;
    private String favoritePosition;
    private UserRole role;
    private UserStatus status;
    private LocalDateTime createdAt;

    public static UserDto fromEntity(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .jerseyNumber(user.getJerseyNumber())
                .avatarUrl(user.getAvatarUrl())
                .email(user.getEmail())
                .favoritePosition(user.getFavoritePosition())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
