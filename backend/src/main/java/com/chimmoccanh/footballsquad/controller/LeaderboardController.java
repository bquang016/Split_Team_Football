package com.chimmoccanh.footballsquad.controller;

import com.chimmoccanh.footballsquad.dto.response.ApiResponse;
import com.chimmoccanh.footballsquad.dto.response.LeaderboardItemDto;
import com.chimmoccanh.footballsquad.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LeaderboardItemDto>>> getLeaderboard(
            @RequestParam(required = false, defaultValue = "goals") String type) {
        List<LeaderboardItemDto> leaderboard = leaderboardService.getLeaderboard(type);
        return ResponseEntity.ok(ApiResponse.ok(leaderboard));
    }

    @PostMapping("/refresh")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> refreshLeaderboard() {
        leaderboardService.refreshAllLeaderboard();
        return ResponseEntity.ok(ApiResponse.ok("Đã làm mới dữ liệu bảng xếp hạng", null));
    }
}
