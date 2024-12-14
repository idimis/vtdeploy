package com.vibetribe.backend.infrastructure.usecase.user.auth.service.impl;

import com.vibetribe.backend.common.exceptions.DataNotFoundException;
import com.vibetribe.backend.infrastructure.system.security.TokenService;
import com.vibetribe.backend.infrastructure.usecase.user.auth.dto.LoginRequestDTO;
import com.vibetribe.backend.infrastructure.usecase.user.auth.dto.LoginResponseDTO;
import com.vibetribe.backend.infrastructure.usecase.user.auth.dto.UserAuth;
import com.vibetribe.backend.infrastructure.usecase.user.repository.UserRepository;
import com.vibetribe.backend.infrastructure.usecase.user.auth.service.LoginUsecase;
import lombok.extern.java.Log;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Log
@Service
public class LoginUsecaseImpl implements LoginUsecase {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public LoginUsecaseImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, TokenService tokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    @Override
    public LoginResponseDTO authenticateUser(LoginRequestDTO request) {
        UserAuth userAuth = userRepository.findByEmailContainsIgnoreCase(request.getEmail())
                .map(UserAuth::new)
                .orElseThrow(() -> new DataNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), userAuth.getPassword())) {
            throw new DataNotFoundException("Invalid credentials");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenService.generateToken(authentication);
        return new LoginResponseDTO(token);
    }
}