package com.vibetribe.backend.infrastructure.usecase.voucher.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class VoucherDTO {
    private Long id;
    private String code;
    private String description;
    private LocalDateTime expiryDate;
    private boolean isUsed;
}
