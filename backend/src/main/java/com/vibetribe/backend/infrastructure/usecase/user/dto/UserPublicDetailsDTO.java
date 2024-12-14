package com.vibetribe.backend.infrastructure.usecase.user.dto;

import com.vibetribe.backend.common.response.PaginatedResponse;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserPublicDetailsDTO {

    private Long userId;
    private String photoProfileUrl;
    private String fullName;
    private String email;
    private String website;
    private PaginatedResponse events;
}
