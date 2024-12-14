package com.vibetribe.backend.infrastructure.usecase.voucher.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VoucherDetailsDTO {
    private Long voucherId;
    private String eventName;
    private String voucherDescription;
    private BigDecimal voucherValue;
    private String voucherCode;
    private String voucherType;
    private String status;
    private Integer quantityAvailable;
    private LocalDate dateStart;
    private LocalDate dateEnd;

    public VoucherDetailsDTO(Long id, String title, String description, BigDecimal voucherValue, String voucherCode, String voucherType, String availability, int remainingQuantity, LocalDate startDate, LocalDate endDate) {
        this.voucherId = id;
        this.eventName = title;
        this.voucherDescription = description;
        this.voucherValue = voucherValue;
        this.voucherCode = voucherCode;
        this.voucherType = voucherType;
        this.status = availability;
        this.quantityAvailable = remainingQuantity;
        this.dateStart = LocalDate.from(startDate.atStartOfDay());
        this.dateEnd = LocalDate.from(endDate.atTime(LocalTime.MAX));
    }
}
