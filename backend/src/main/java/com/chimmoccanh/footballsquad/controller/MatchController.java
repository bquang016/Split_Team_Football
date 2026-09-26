package com.chimmoccanh.footballsquad.controller;

import com.chimmoccanh.footballsquad.dto.request.CreateMatchRequest;
import com.chimmoccanh.footballsquad.dto.request.RecordScoreRequest;
import com.chimmoccanh.footballsquad.dto.request.UpdateMatchStatusRequest;
import com.chimmoccanh.footballsquad.dto.response.ApiResponse;
import com.chimmoccanh.footballsquad.dto.response.MatchDto;
import com.chimmoccanh.footballsquad.dto.response.MatchParticipantDto;
import com.chimmoccanh.footballsquad.security.CustomUserDetails;
import com.chimmoccanh.footballsquad.service.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MatchDto>>> getMatches(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<MatchDto> matches = matchService.getMatches(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.ok(matches));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MatchDto>> createMatch(
            @Valid @RequestBody CreateMatchRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        MatchDto match = matchService.createMatch(request, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Tạo trận đấu thành công", match));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MatchDto>> getMatchDetails(@PathVariable UUID id) {
        MatchDto match = matchService.getMatchDetails(id);
        return ResponseEntity.ok(ApiResponse.ok(match));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MatchDto>> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateMatchStatusRequest request) {
        MatchDto match = matchService.updateMatchStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái trận đấu thành công", match));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<ApiResponse<MatchParticipantDto>> joinMatch(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        MatchParticipantDto participant = matchService.joinMatch(id, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Điểm danh tham gia trận đấu thành công", participant));
    }

    @DeleteMapping("/{id}/leave")
    public ResponseEntity<ApiResponse<Void>> leaveMatch(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        matchService.leaveMatch(id, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Hủy tham gia trận đấu thành công", null));
    }

    @PostMapping("/{id}/participants")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MatchParticipantDto>> addParticipant(
            @PathVariable UUID id,
            @RequestBody Map<String, UUID> body) {
        UUID userId = body.get("userId");
        MatchParticipantDto participant = matchService.addParticipantByAdmin(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Thêm cầu thủ vào danh sách thành công", participant));
    }

    @DeleteMapping("/{id}/participants/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> removeParticipant(
            @PathVariable UUID id,
            @PathVariable UUID userId) {
        matchService.removeParticipantByAdmin(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Đã xóa cầu thủ khỏi danh sách", null));
    }

    @PatchMapping("/{id}/score")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MatchDto>> updateScore(
            @PathVariable UUID id,
            @Valid @RequestBody RecordScoreRequest request) {
        MatchDto match = matchService.updateScore(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật tỉ số trận đấu thành công", match));
    }
}
