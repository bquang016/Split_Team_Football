package com.chimmoccanh.footballsquad.controller;

import com.chimmoccanh.footballsquad.dto.request.CreateTradeRequestDto;
import com.chimmoccanh.footballsquad.dto.request.DonatePlayerRequest;
import com.chimmoccanh.footballsquad.dto.response.ApiResponse;
import com.chimmoccanh.footballsquad.dto.response.TradeRequestDto;
import com.chimmoccanh.footballsquad.security.CustomUserDetails;
import com.chimmoccanh.footballsquad.service.TradeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/matches/{id}/trades")
@RequiredArgsConstructor
public class TradeController {

    private final TradeService tradeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TradeRequestDto>>> getTrades(@PathVariable UUID id) {
        List<TradeRequestDto> trades = tradeService.getTrades(id);
        return ResponseEntity.ok(ApiResponse.ok(trades));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TradeRequestDto>> createTrade(
            @PathVariable UUID id,
            @Valid @RequestBody CreateTradeRequestDto request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        TradeRequestDto trade = tradeService.createTrade(id, request, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Đã gửi đề nghị đổi cầu thủ", trade));
    }

    @PostMapping("/{tradeId}/respond")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TradeRequestDto>> respondTrade(
            @PathVariable UUID id,
            @PathVariable UUID tradeId,
            @RequestBody Map<String, Boolean> body,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        boolean accept = Boolean.TRUE.equals(body.get("accept"));
        TradeRequestDto trade = tradeService.respondTrade(id, tradeId, accept, userDetails.getUser());
        String msg = accept ? "Đã đồng ý trao đổi cầu thủ!" : "Đã từ chối trao đổi cầu thủ.";
        return ResponseEntity.ok(ApiResponse.ok(msg, trade));
    }

    @PostMapping("/{tradeId}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TradeRequestDto>> cancelTrade(
            @PathVariable UUID id,
            @PathVariable UUID tradeId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        TradeRequestDto trade = tradeService.cancelTrade(id, tradeId, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Đã hủy yêu cầu chuyển nhượng", trade));
    }

    @PostMapping("/donate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TradeRequestDto>> donatePlayer(
            @PathVariable UUID id,
            @Valid @RequestBody DonatePlayerRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        TradeRequestDto trade = tradeService.donatePlayer(id, request, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Đã chuyển nhượng cầu thủ thành công", trade));
    }
}
