package com.vibetribe.backend.infrastructure.usecase.transaction.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class TransactionRequestDTO {
    private Long customerId;
    private Long eventId;
    private Integer quantity;
    private Long voucherId;
    private BigDecimal points;
    private Boolean isUsePoints;
}
