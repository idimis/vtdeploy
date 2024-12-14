package com.vibetribe.backend.infrastructure.usecase.transaction.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class TransactionReceiptResponseDTO {
    private Long customerId;
    private String eventName;
    private LocalDateTime eventStartDateTime;
    private LocalDateTime eventEndDateTime;
    private String eventLocation;
    private String eventLocationDetails;
    private Integer ticketQuantity;
    private BigDecimal totalFeeBeforeDiscount;
    private String customerFullName;
    private String customerEmail;
    private BigDecimal voucherUsed;
    private BigDecimal pointsUsed;
    private BigDecimal totalPaid;
}
