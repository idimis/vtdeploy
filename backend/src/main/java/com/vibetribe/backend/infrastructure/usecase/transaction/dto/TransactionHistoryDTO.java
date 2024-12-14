package com.vibetribe.backend.infrastructure.usecase.transaction.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class TransactionHistoryDTO {

    private Long customerId;
    private String customerPhotoUrl;
    private String customerName;
    private String eventTitle;
    private int quantity;
    private BigDecimal revenue;
    private LocalDateTime transactionDate;

    public TransactionHistoryDTO(Long customerId, String photoProfileUrl, String name, String title, Integer quantity, BigDecimal amountPaid, LocalDateTime createdAt) {
        this.customerId = customerId;
        this.customerPhotoUrl = photoProfileUrl;
        this.customerName = name;
        this.eventTitle = title;
        this.quantity = quantity;
        this.revenue = amountPaid;
        this.transactionDate = createdAt;
    }
}
