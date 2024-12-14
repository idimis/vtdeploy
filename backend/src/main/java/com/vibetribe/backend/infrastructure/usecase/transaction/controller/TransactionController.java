package com.vibetribe.backend.infrastructure.usecase.transaction.controller;

import com.vibetribe.backend.common.response.ApiResponse;
import com.vibetribe.backend.infrastructure.system.security.Claims;
import com.vibetribe.backend.infrastructure.usecase.transaction.dto.TransactionRequestDTO;
import com.vibetribe.backend.infrastructure.usecase.transaction.dto.TransactionResponseDTO;
import com.vibetribe.backend.infrastructure.usecase.transaction.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody TransactionRequestDTO request) {
        Long customerId = Claims.getUserIdFromJwt();
        TransactionResponseDTO transaction = transactionService.createTransaction(request, customerId);
        return ApiResponse.successfulResponse("Create new transaction success", transaction);
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/latest")
    public ResponseEntity<?> getLatestTransactionByCustomer() {
        Long customerId = Claims.getUserIdFromJwt();
        return transactionService.getLatestTransactionByCustomer(customerId)
                .map(transaction -> ApiResponse.successfulResponse("Get latest transaction success", transaction))
                .orElseGet(() -> ApiResponse.failedResponse(HttpStatus.NOT_FOUND.value(), "Latest transaction not found"));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/{transactionId}")
    public ResponseEntity<?> getTransactionById(@PathVariable Long transactionId) {
        Long customerId = Claims.getUserIdFromJwt();
        return transactionService.getTransactionById(transactionId)
                .filter(transaction -> transaction.getCustomerId().equals(customerId))
                .map(transaction -> ApiResponse.successfulResponse("Get transaction by ID success", transaction))
                .orElseGet(() -> ApiResponse.failedResponse(HttpStatus.FORBIDDEN.value(), "Access denied"));
    }
}
