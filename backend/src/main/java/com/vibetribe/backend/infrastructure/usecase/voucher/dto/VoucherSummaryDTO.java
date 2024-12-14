package com.vibetribe.backend.infrastructure.usecase.voucher.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VoucherSummaryDTO {
    private Long voucherId;
    private String eventName;
    private String voucherCode;
    private String status;
}
