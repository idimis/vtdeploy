package com.vibetribe.backend.infrastructure.usecase.ticket.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
public class TicketDTO {
    private Long transactionId;
    private Long eventId;
    private Long customerId;
    private String status;
    private OffsetDateTime issueDate;
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private String barcode;
    private BigDecimal price;
}
