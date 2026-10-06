package com.chimmoccanh.footballsquad.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckAvailabilityResponse {
    private boolean usernameAvailable;
    private String usernameError;

    private boolean emailAvailable;
    private String emailError;

    private boolean jerseyNumberAvailable;
    private String jerseyNumberError;
}
