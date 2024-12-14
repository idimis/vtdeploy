package com.vibetribe.backend.infrastructure.usecase.ticket.repository;

import com.vibetribe.backend.entity.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Page<Ticket> findByCustomerId(Long customerId, Pageable pageable);
    Page<Ticket> findByCustomerIdAndEventDateTimeEndAfter(Long customerId, LocalDateTime dateTime, Pageable pageable);
    Page<Ticket> findByCustomerIdAndEventDateTimeEndBefore(Long customerId, LocalDateTime dateTime, Pageable pageable);
    boolean existsByCustomerIdAndEventId(Long customerId, Long eventId);
}
