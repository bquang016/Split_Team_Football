package com.chimmoccanh.footballsquad.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysisDto {
    private String analysis;
    private String winPrediction;
    private String tacticalAdvice;
    private LocalDateTime analyzedAt;
}
