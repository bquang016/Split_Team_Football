package com.chimmoccanh.footballsquad.controller;

import com.chimmoccanh.footballsquad.dto.request.RecordStatsRequest;
import com.chimmoccanh.footballsquad.dto.response.ApiResponse;
import com.chimmoccanh.footballsquad.dto.response.PlayerStatsDto;
import com.chimmoccanh.footballsquad.security.CustomUserDetails;
import com.chimmoccanh.footballsquad.service.StatsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @PostMapping("/api/matches/{id}/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<PlayerStatsDto>>> recordMatchStats(
            @PathVariable UUID id,
            @Valid @RequestBody RecordStatsRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<PlayerStatsDto> stats = statsService.recordStats(id, request, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Lưu thống kê trận đấu thành công", stats));
    }

    @GetMapping("/api/matches/{id}/stats")
    public ResponseEntity<ApiResponse<List<PlayerStatsDto>>> getMatchStats(@PathVariable UUID id) {
        List<PlayerStatsDto> stats = statsService.getMatchStats(id);
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/api/stats/player/{userId}")
    public ResponseEntity<ApiResponse<List<PlayerStatsDto>>> getPlayerStats(@PathVariable UUID userId) {
        List<PlayerStatsDto> stats = statsService.getPlayerStats(userId);
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
