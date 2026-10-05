package com.chimmoccanh.footballsquad.controller;

import com.chimmoccanh.footballsquad.dto.request.PickPlayerRequest;
import com.chimmoccanh.footballsquad.dto.response.ApiResponse;
import com.chimmoccanh.footballsquad.dto.response.MatchDto;
import com.chimmoccanh.footballsquad.dto.response.MatchParticipantDto;
import com.chimmoccanh.footballsquad.security.CustomUserDetails;
import com.chimmoccanh.footballsquad.service.PickService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/matches/{id}/pick")
@RequiredArgsConstructor
public class PickController {

    private final PickService pickService;

    @PostMapping("/ready")
    public ResponseEntity<ApiResponse<MatchDto>> confirmPickRoundReady(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Vui lòng đăng nhập để thực hiện thao tác"));
        }
        MatchDto match = pickService.confirmPickRoundReady(id, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Đã xác nhận sẵn sàng", match));
    }

    @PostMapping("/timeout-swap")
    public ResponseEntity<ApiResponse<MatchDto>> handlePickTimeoutSwap(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Vui lòng đăng nhập để thực hiện thao tác"));
        }
        MatchDto match = pickService.handlePickTimeoutSwap(id, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Đã chuyển quyền chọn do hết thời gian", match));
    }

    @PostMapping("/final-odd-decision")
    public ResponseEntity<ApiResponse<MatchDto>> handleFinalOddDecision(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Vui lòng đăng nhập để thực hiện thao tác"));
        }
        String decision = body.get("decision");
        MatchDto match = pickService.handleFinalOddPlayerDecision(id, decision, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Đã xử lý quyết định cầu thủ cuối cùng", match));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MatchParticipantDto>> pickPlayer(
            @PathVariable UUID id,
            @Valid @RequestBody PickPlayerRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        MatchParticipantDto participant = pickService.pickPlayer(id, request, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Chọn cầu thủ vào đội thành công", participant));
    }

    @PostMapping("/reset")
    public ResponseEntity<ApiResponse<MatchParticipantDto>> resetPick(
            @PathVariable UUID id,
            @RequestBody Map<String, UUID> body) {
        UUID userId = body.get("userId");
        MatchParticipantDto participant = pickService.resetPlayerPick(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Đã đặt lại lựa chọn cầu thủ", participant));
    }
}
