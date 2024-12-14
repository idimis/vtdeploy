package com.vibetribe.backend.infrastructure.usecase.user.auth.controller;

import com.vibetribe.backend.common.response.ApiResponse;
import com.vibetribe.backend.infrastructure.usecase.user.auth.dto.LoginRequestDTO;
import com.vibetribe.backend.infrastructure.usecase.user.auth.dto.LoginResponseDTO;
import com.vibetribe.backend.infrastructure.usecase.user.auth.service.LoginUsecase;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/login")
public class AuthController {
    private final LoginUsecase loginUsecase;

    public AuthController(LoginUsecase loginUsecase) {
        this.loginUsecase = loginUsecase;
    }

    @PostMapping
    public ResponseEntity<?> login(@Validated @RequestBody LoginRequestDTO req) {
        LoginResponseDTO response = loginUsecase.authenticateUser(req);
        return ApiResponse.successfulResponse("Login successful", response);
    }
}

