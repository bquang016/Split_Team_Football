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

    @PostMapping("/{id}/participants/batch")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<MatchParticipantDto>>> addParticipantsBatch(
            @PathVariable UUID id,
            @RequestBody Map<String, List<UUID>> body) {
        List<UUID> userIds = body.get("userIds");
        List<MatchParticipantDto> participants = matchService.addParticipantsBatchByAdmin(id, userIds != null ? userIds : List.of());
        return ResponseEntity.ok(ApiResponse.ok("Đã gán các thành viên vào trận thành công", participants));
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

    /**
     * Bước 2: Người thắng spin chọn áo đấu (SPAIN hoặc FRANCE).
     * Sau khi chọn, trạng thái tự chuyển sang PLAYER_PICKING.
     */
    @PostMapping("/{id}/select-jersey")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<MatchDto>> selectJersey(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String jerseyTeam = body.get("jerseyTeam"); // "SPAIN" or "FRANCE"
        MatchDto match = matchService.selectJersey(id, jerseyTeam, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Đã chọn áo đấu " + jerseyTeam, match));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMatch(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        matchService.deleteMatch(id, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Đã xóa trận đấu thành công (Xóa mềm)", null));
    }

    @PostMapping("/{id}/restore")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MatchDto>> restoreMatch(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        MatchDto match = matchService.restoreMatch(id, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Đã khôi phục trận đấu thành công", match));
    }

    @GetMapping("/deleted")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<MatchDto>>> getDeletedMatches() {
        List<MatchDto> matches = matchService.getDeletedMatches();
        return ResponseEntity.ok(ApiResponse.ok(matches));
    }

    /**
     * Đội trưởng xác nhận chuyển từ PLAYER_PICKING → TRADE_WINDOW.
     * Cần cả 2 đội trưởng đồng ý (2/2) mới auto chuyển status.
     */
    @PostMapping("/{id}/confirm-proceed")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<MatchDto>> confirmProceedToTrade(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        MatchDto match = matchService.confirmProceedToTrade(id, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Đã ghi nhận xác nhận chuyển bước", match));
    }

    /**
     * Đội trưởng xác nhận "Không chỉnh sửa" ở bước TRADE_WINDOW.
     * Cần cả 2 đội trưởng đồng ý (2/2) mới auto chuyển sang IN_PROGRESS.
     */
    @PostMapping("/{id}/confirm-no-trade")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<MatchDto>> confirmNoTrade(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        MatchDto match = matchService.confirmNoTrade(id, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Đã ghi nhận xác nhận không chỉnh sửa", match));
    }
}
