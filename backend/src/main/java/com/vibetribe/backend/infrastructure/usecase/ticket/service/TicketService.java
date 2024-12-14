package com.vibetribe.backend.infrastructure.usecase.ticket.service;

import com.vibetribe.backend.entity.Ticket;
import com.vibetribe.backend.entity.Transaction;
import com.vibetribe.backend.infrastructure.usecase.ticket.dto.TicketDTO;
import com.vibetribe.backend.infrastructure.usecase.ticket.repository.TicketRepository;
import com.vibetribe.backend.infrastructure.usecase.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public List<TicketDTO> generateTickets(Transaction transaction) {
        List<Ticket> tickets = new ArrayList<>();
        for (int i = 0; i < transaction.getQuantity(); i++) {
            Ticket ticket = new Ticket();
            ticket.setTransaction(transaction);
            ticket.setEvent(transaction.getEvent());
            ticket.setCustomer(transaction.getCustomer());
            ticket.setStatus("VALID");
            ticket.setValidFrom(transaction.getEvent().getDateTimeStart());
            ticket.setValidUntil(transaction.getEvent().getDateTimeEnd());
            ticket.setBarcode(UUID.randomUUID().toString());
            ticket.setPrice(transaction.getAmountPaid().divide(BigDecimal.valueOf(transaction.getQuantity())));

            tickets.add(ticketRepository.save(ticket));
        }
        return tickets.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Page<TicketDTO> getAllTicketsByCustomer(Long customerId, Pageable pageable) {
        return ticketRepository.findByCustomerId(customerId, pageable)
                .map(this::convertToDTO);
    }

    public Page<TicketDTO> getUpcomingTicketsByCustomer(Long customerId, Pageable pageable) {
        LocalDateTime now = LocalDateTime.now();
        return ticketRepository.findByCustomerIdAndEventDateTimeEndAfter(customerId, now, pageable)
                .map(this::convertToDTO);
    }

    public Page<TicketDTO> getPastTicketsByCustomer(Long customerId, Pageable pageable) {
        LocalDateTime now = LocalDateTime.now();
        return ticketRepository.findByCustomerIdAndEventDateTimeEndBefore(customerId, now, pageable)
                .map(this::convertToDTO);
    }

    private TicketDTO convertToDTO(Ticket ticket) {
        TicketDTO dto = new TicketDTO();
        dto.setTransactionId(ticket.getTransaction().getId());
        dto.setEventId(ticket.getEvent().getId());
        dto.setCustomerId(ticket.getCustomer().getId());
        dto.setStatus(ticket.getStatus());
        dto.setIssueDate(ticket.getIssueDate());
        dto.setValidFrom(ticket.getValidFrom());
        dto.setValidUntil(ticket.getValidUntil());
        dto.setBarcode(ticket.getBarcode());
        dto.setPrice(ticket.getPrice());
        return dto;
    }
}
