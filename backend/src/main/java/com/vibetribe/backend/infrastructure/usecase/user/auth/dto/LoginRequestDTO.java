package com.vibetribe.backend.infrastructure.usecase.user.auth.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequestDTO {

    @NotNull
    @Size(max = 100)
    private String email;

    @NotNull
    @Size(max = 60)
    private String password;
}
