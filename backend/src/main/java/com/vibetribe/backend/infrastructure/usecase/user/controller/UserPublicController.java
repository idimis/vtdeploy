package com.vibetribe.backend.infrastructure.usecase.user.controller;

import com.vibetribe.backend.common.response.ApiResponse;
import com.vibetribe.backend.entity.User;
import com.vibetribe.backend.infrastructure.usecase.user.dto.CreateUserRequestDTO;
import com.vibetribe.backend.infrastructure.usecase.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/signup")
public class UserPublicController {
    private final UserService userService;

    public UserPublicController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequestDTO createUserRequestDTO) {
        User createdUser = userService.createUser(createUserRequestDTO);
        return ApiResponse.successfulResponse("Create new user success", createdUser);
    }
}
