package com.chimmoccanh.footballsquad.controller;

import com.chimmoccanh.footballsquad.dto.response.AIAnalysisDto;
import com.chimmoccanh.footballsquad.dto.response.ApiResponse;
import com.chimmoccanh.footballsquad.service.GeminiAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/matches/{id}/ai-analysis")
@RequiredArgsConstructor
public class AiController {

    private final GeminiAiService aiService;

    @PostMapping
    public ResponseEntity<ApiResponse<AIAnalysisDto>> generateAnalysis(@PathVariable UUID id) {
        AIAnalysisDto analysis = aiService.analyzeMatch(id);
        return ResponseEntity.ok(ApiResponse.ok("Phân tích chiến thuật AI hoàn tất", analysis));
    }
}
