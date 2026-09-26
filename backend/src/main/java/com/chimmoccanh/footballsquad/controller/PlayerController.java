package com.chimmoccanh.footballsquad.controller;

import com.chimmoccanh.footballsquad.dto.response.ApiResponse;
import com.chimmoccanh.footballsquad.dto.response.UserDto;
import com.chimmoccanh.footballsquad.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
public class PlayerController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getActivePlayers() {
        List<UserDto> players = userService.getActivePlayers();
        return ResponseEntity.ok(ApiResponse.ok(players));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getPlayerProfile(@PathVariable UUID id) {
        UserDto player = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.ok(player));
    }
}
