package com.vibetribe.backend.infrastructure.usecase.ticket.controller;

import com.vibetribe.backend.common.response.ApiResponse;
import com.vibetribe.backend.common.response.PaginatedResponse;
import com.vibetribe.backend.common.util.PaginationUtil;
import com.vibetribe.backend.infrastructure.system.security.Claims;
import com.vibetribe.backend.infrastructure.usecase.ticket.dto.TicketDTO;
import com.vibetribe.backend.infrastructure.usecase.ticket.service.TicketService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping
    public ResponseEntity<?> getAllTickets(@PageableDefault(size = 10) Pageable pageable) {
        Long customerId = Claims.getUserIdFromJwt();
        Page<TicketDTO> tickets = ticketService.getAllTicketsByCustomer(customerId, pageable);
        PaginatedResponse<TicketDTO> paginatedResponse = PaginationUtil.toPaginatedResponse(tickets);
        return ApiResponse.successfulResponse("All tickets retrieved successfully", paginatedResponse);
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/upcoming")
    public ResponseEntity<?> getUpcomingTickets(@PageableDefault(size = 10) Pageable pageable) {
        Long customerId = Claims.getUserIdFromJwt();
        Page<TicketDTO> tickets = ticketService.getUpcomingTicketsByCustomer(customerId, pageable);
        PaginatedResponse<TicketDTO> paginatedResponse = PaginationUtil.toPaginatedResponse(tickets);
        return ApiResponse.successfulResponse("Upcoming tickets retrieved successfully", paginatedResponse);
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/past")
    public ResponseEntity<?> getPastTickets(@PageableDefault(size = 10) Pageable pageable) {
        Long customerId = Claims.getUserIdFromJwt();
        Page<TicketDTO> tickets = ticketService.getPastTicketsByCustomer(customerId, pageable);
        PaginatedResponse<TicketDTO> paginatedResponse = PaginationUtil.toPaginatedResponse(tickets);
        return ApiResponse.successfulResponse("Past tickets retrieved successfully", paginatedResponse);
    }
}
