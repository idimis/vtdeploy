package com.vibetribe.backend.infrastructure.usecase.user.controller;

import com.vibetribe.backend.common.response.ApiResponse;
import com.vibetribe.backend.infrastructure.usecase.user.dto.UserPublicDetailsDTO;
import com.vibetribe.backend.infrastructure.usecase.user.service.UserService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{userId}/details")
    public ResponseEntity<?> getUserDetails(@PathVariable Long userId,
                                            @PageableDefault(size = 10) Pageable pageable) {
        UserPublicDetailsDTO userDetails = userService.getUserDetails(userId, pageable);
        return ApiResponse.successfulResponse("Get user details success", userDetails);
    }
}
