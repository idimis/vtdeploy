package com.vibetribe.backend.infrastructure.usecase.transaction.repository;

import com.vibetribe.backend.entity.Transaction;
import com.vibetribe.backend.infrastructure.usecase.transaction.dto.TransactionHistoryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findTopByCustomerIdOrderByCreatedAtDesc(Long customerId);

    @Query("SELECT new com.vibetribe.backend.infrastructure.usecase.transaction.dto.TransactionHistoryDTO(t.customer.id, t.customer.photoProfileUrl, t.customer.name, t.event.title, t.quantity, t.amountPaid, t.createdAt) " +
            "FROM Transaction t WHERE t.event.organizer.id = :organizerId")
    Page<TransactionHistoryDTO> findTransactionHistoryByOrganizer(Long organizerId, Pageable pageable);
}
