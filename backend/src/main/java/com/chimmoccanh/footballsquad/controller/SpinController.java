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

    @PostMapping("/round-pick")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<SpinSessionDto>> spinRoundPick(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        SpinSessionDto session = spinService.spinRoundPick(id, userDetails != null ? userDetails.getUser() : null);
        return ResponseEntity.ok(ApiResponse.ok("Quay lượt chọn cầu thủ thành công", session));
    }

    @GetMapping({"", "/latest"})
    public ResponseEntity<ApiResponse<SpinSessionDto>> getLatestSpin(@PathVariable UUID id) {
        SpinSessionDto session = spinService.getLatestSpin(id);
        return ResponseEntity.ok(ApiResponse.ok(session));
    }
}
