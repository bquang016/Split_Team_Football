package com.chimmoccanh.footballsquad.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CreateMatchRequest {
    private String title;

    @NotNull(message = "Ngày đá không được để trống")
    private LocalDate matchDate;

    private LocalTime matchTime;

    private String location;

    private String notes;
}
