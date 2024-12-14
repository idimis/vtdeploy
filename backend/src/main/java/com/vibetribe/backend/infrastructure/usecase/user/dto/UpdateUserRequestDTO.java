package com.vibetribe.backend.infrastructure.usecase.user.dto;

import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequestDTO {

    private String name;

    @Email(message = "Email should be valid")
    private String email;

    private String password;
    private String photoProfileUrl;
    private String website;
    private String phoneNumber;
    private String address;
}
