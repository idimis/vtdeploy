package com.vibetribe.backend.infrastructure.usecase.transaction.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class TransactionResponseDTO {
    private Long id;
    private Long customerId;
    private Long eventId;
    private Integer quantity;
    private BigDecimal pointsApplied;
    private BigDecimal discountApplied;
    private BigDecimal amountPaid;
}
