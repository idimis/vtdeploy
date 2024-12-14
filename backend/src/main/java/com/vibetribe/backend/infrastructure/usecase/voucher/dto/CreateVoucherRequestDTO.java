package com.vibetribe.backend.infrastructure.usecase.voucher.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class CreateVoucherRequestDTO {
    private Long eventId;
    private String voucherCode;
    private BigDecimal voucherValue;
    private String description;
    private String voucherType; // "DATE_RANGE" or "QUANTITY" or "DISCOUNT"
    private LocalDate startDate; // for date range based voucher
    private LocalDate endDate; // for date range based voucher
    private Integer quantityLimit; // for quantity based voucher
}
