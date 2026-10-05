package com.chimmoccanh.footballsquad.controller;

import com.chimmoccanh.footballsquad.dto.request.StartSpinRequest;
import com.chimmoccanh.footballsquad.dto.response.ApiResponse;
import com.chimmoccanh.footballsquad.dto.response.SpinSessionDto;
import com.chimmoccanh.footballsquad.service.SpinService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import com.chimmoccanh.footballsquad.security.CustomUserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/matches/{id}/spin")
@RequiredArgsConstructor
public class SpinController {

    private final SpinService spinService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SpinSessionDto>> startSpin(
            @PathVariable UUID id,
            @Valid @RequestBody StartSpinRequest request) {
        SpinSessionDto session = spinService.startSpin(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Bắt đầu quay chọn đội trưởng", session));
    }

    @PostMapping("/jersey")
    public ResponseEntity<ApiResponse<SpinSessionDto>> spinJersey(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Vui lòng đăng nhập để thực hiện thao tác"));
        }
        SpinSessionDto session = spinService.spinJerseyTurn(id, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Quay chọn quyền chọn áo đấu thành công", session));
    }

    @PostMapping("/round-pick")
    public ResponseEntity<ApiResponse<SpinSessionDto>> spinRoundPick(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Vui lòng đăng nhập để thực hiện thao tác"));
        }
        SpinSessionDto session = spinService.spinRoundPick(id, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Quay lượt chọn cầu thủ thành công", session));
    }

    @GetMapping({"", "/latest"})
    public ResponseEntity<ApiResponse<SpinSessionDto>> getLatestSpin(@PathVariable UUID id) {
        SpinSessionDto session = spinService.getLatestSpin(id);
        return ResponseEntity.ok(ApiResponse.ok(session));
    }
}
