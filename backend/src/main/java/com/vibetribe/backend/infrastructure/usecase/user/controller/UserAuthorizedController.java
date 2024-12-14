package com.vibetribe.backend.infrastructure.usecase.user.controller;

import com.vibetribe.backend.common.response.ApiResponse;
import com.vibetribe.backend.entity.User;
import com.vibetribe.backend.infrastructure.system.security.Claims;
import com.vibetribe.backend.infrastructure.usecase.user.dto.UpdateUserRequestDTO;
import com.vibetribe.backend.infrastructure.usecase.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
public class UserAuthorizedController {

    private final UserService userService;

    public UserAuthorizedController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/details")
    public ResponseEntity<?> getUserDetails() {
        Long userId = Claims.getUserIdFromJwt();
        User user = userService.getUserById(userId);
        return ApiResponse.successfulResponse("Get user details success", user);
    }

    @PreAuthorize("hasAnyRole('CUSTOMER', 'ORGANIZER')")
    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@Valid @RequestBody UpdateUserRequestDTO updateUserRequestDTO) {
        Long userId = Claims.getUserIdFromJwt();
        User user = userService.updateUser(userId, updateUserRequestDTO);
        return ApiResponse.successfulResponse(HttpStatus.OK.value(),"User updated successfully", user);
    }
}
