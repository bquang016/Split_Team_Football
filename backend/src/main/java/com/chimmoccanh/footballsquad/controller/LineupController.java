package com.chimmoccanh.footballsquad.controller;

import com.chimmoccanh.footballsquad.dto.request.SaveLineupRequest;
import com.chimmoccanh.footballsquad.dto.response.ApiResponse;
import com.chimmoccanh.footballsquad.dto.response.MatchLineupDto;
import com.chimmoccanh.footballsquad.model.enums.Team;
import com.chimmoccanh.footballsquad.security.CustomUserDetails;
import com.chimmoccanh.footballsquad.service.LineupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/matches/{id}/lineup")
@RequiredArgsConstructor
public class LineupController {

    private final LineupService lineupService;

    @RequestMapping(method = {RequestMethod.PUT, RequestMethod.POST})
    public ResponseEntity<ApiResponse<List<MatchLineupDto>>> saveLineup(
            @PathVariable UUID id,
            @Valid @RequestBody SaveLineupRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<MatchLineupDto> lineups = lineupService.saveLineup(id, request, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Lưu sơ đồ đội hình thành công", lineups));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MatchLineupDto>>> getLineup(
            @PathVariable UUID id,
            @RequestParam(required = false) Team team) {
        List<MatchLineupDto> lineups = lineupService.getLineup(id, team);
        return ResponseEntity.ok(ApiResponse.ok(lineups));
    }
}
