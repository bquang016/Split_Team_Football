package com.chimmoccanh.footballsquad.controller;

import com.chimmoccanh.footballsquad.dto.request.RecordGoalRequest;
import com.chimmoccanh.footballsquad.dto.response.ApiResponse;
import com.chimmoccanh.footballsquad.dto.response.MatchGoalDto;
import com.chimmoccanh.footballsquad.security.CustomUserDetails;
import com.chimmoccanh.footballsquad.service.MatchGoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/matches/{matchId}/goals")
@RequiredArgsConstructor
public class MatchGoalController {

    private final MatchGoalService matchGoalService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MatchGoalDto>> recordGoal(
            @PathVariable UUID matchId,
            @Valid @RequestBody RecordGoalRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        MatchGoalDto goal = matchGoalService.recordGoal(matchId, request, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Ghi nhận bàn thắng thành công", goal));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MatchGoalDto>>> getMatchGoals(@PathVariable UUID matchId) {
        List<MatchGoalDto> goals = matchGoalService.getMatchGoals(matchId);
        return ResponseEntity.ok(ApiResponse.ok(goals));
    }

    @DeleteMapping("/{goalId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteGoal(
            @PathVariable UUID matchId,
            @PathVariable UUID goalId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        matchGoalService.deleteGoal(matchId, goalId, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Đã xóa sự kiện bàn thắng", null));
    }
}
