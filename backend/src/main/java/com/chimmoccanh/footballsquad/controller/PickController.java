package com.chimmoccanh.footballsquad.controller;

import com.chimmoccanh.footballsquad.dto.request.PickPlayerRequest;
import com.chimmoccanh.footballsquad.dto.response.ApiResponse;
import com.chimmoccanh.footballsquad.dto.response.MatchParticipantDto;
import com.chimmoccanh.footballsquad.security.CustomUserDetails;
import com.chimmoccanh.footballsquad.service.PickService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/matches/{id}/pick")
@RequiredArgsConstructor
public class PickController {

    private final PickService pickService;

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
