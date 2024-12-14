package com.vibetribe.backend.infrastructure.usecase.transaction.service;

import com.vibetribe.backend.entity.*;
import com.vibetribe.backend.infrastructure.usecase.event.repository.EventRepository;
import com.vibetribe.backend.infrastructure.usecase.ticket.dto.TicketDTO;
import com.vibetribe.backend.infrastructure.usecase.ticket.service.TicketService;
import com.vibetribe.backend.infrastructure.usecase.transaction.dto.TransactionReceiptResponseDTO;
import com.vibetribe.backend.infrastructure.usecase.transaction.dto.TransactionRequestDTO;
import com.vibetribe.backend.infrastructure.usecase.transaction.dto.TransactionResponseDTO;
import com.vibetribe.backend.infrastructure.usecase.transaction.repository.TransactionRepository;
import com.vibetribe.backend.infrastructure.usecase.user.repository.UserRepository;
import com.vibetribe.backend.infrastructure.usecase.voucher.repository.VoucherRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final EventRepository eventRepository;
    private final VoucherRepository voucherRepository;
    private final UserRepository userRepository;
    private final TicketService ticketService;

    public TransactionService(TransactionRepository transactionRepository,
                              EventRepository eventRepository,
                              VoucherRepository voucherRepository,
                              TicketService ticketService,
                              UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.eventRepository = eventRepository;
        this.voucherRepository = voucherRepository;
        this.userRepository = userRepository;
        this.ticketService = ticketService;
    }

    @Transactional
    public TransactionResponseDTO createTransaction(TransactionRequestDTO request, Long customerId) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));
        if (event.getDateTimeEnd().isBefore(LocalDateTime.now())) {
          throw new IllegalStateException("Cannot buy tickets for past events");
        }

        if (event.getBookedSeats() + request.getQuantity() > event.getAvailableSeats()) {
            throw new IllegalStateException("No seats with this quantity is available for this event");
        }

        Voucher voucher = null;
        if (request.getVoucherId() != null) {
            voucher = voucherRepository.findById(request.getVoucherId())
                    .orElseThrow(() -> new IllegalArgumentException("Voucher not found"));

            if (!voucher.getEvent().getId().equals(event.getId())) {
                throw new IllegalArgumentException("Voucher is not valid for this event");
            }

            if (voucher.getQuantityBasedVoucher() != null) {
                QuantityBasedVoucher quantityBasedVoucher = voucher.getQuantityBasedVoucher();

                if (quantityBasedVoucher.getQuantityUsed() >= quantityBasedVoucher.getQuantityLimit()) {
                    throw new IllegalArgumentException("Voucher usage limit reached");
                }

                quantityBasedVoucher.setQuantityUsed(quantityBasedVoucher.getQuantityUsed() + 1);
            }

            if (voucher.getDateRangeBasedVoucher() != null) {
                DateRangeBasedVoucher dateRangeBasedVoucher = voucher.getDateRangeBasedVoucher();
                LocalDate today = LocalDate.now();

                if (today.isBefore(dateRangeBasedVoucher.getStartDate()) || today.isAfter(dateRangeBasedVoucher.getEndDate())) {
                    throw new IllegalArgumentException("Voucher is not valid for the current date");
                }
            }
        }

        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        BigDecimal totalAmount = event.getFee().multiply(BigDecimal.valueOf(request.getQuantity()));
        BigDecimal points = BigDecimal.ZERO;

        if (request.getIsUsePoints()) {
            List<Point> userPoints = customer.getPoints().stream()
                    .filter(point -> point.getExpiresAt().isAfter(LocalDateTime.now()))
                    .sorted(Comparator.comparing(Point::getExpiresAt).thenComparing(Point::getCreatedAt))
                    .toList();

            BigDecimal totalAvailablePoints = userPoints.stream()
                    .map(point -> BigDecimal.valueOf(point.getPointsAvailable()).subtract(BigDecimal.valueOf(point.getPointsUsed() != null ? point.getPointsUsed() : 0)))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal pointsToUse = totalAmount.min(totalAvailablePoints);

            for (Point point : userPoints) {
                if (pointsToUse.compareTo(BigDecimal.ZERO) <= 0) break;

                BigDecimal availablePoints = BigDecimal.valueOf(point.getPointsAvailable()).subtract(BigDecimal.valueOf(point.getPointsUsed() != null ? point.getPointsUsed() : 0));
                BigDecimal pointsUsed = pointsToUse.min(availablePoints);

                point.setPointsUsed((point.getPointsUsed() != null ? point.getPointsUsed() : 0) + pointsUsed.doubleValue());
                points = points.add(pointsUsed);
                pointsToUse = pointsToUse.subtract(pointsUsed);
            }

            // Update the user's points
            customer.setPointsBalance(customer.getPointsBalance() - points.doubleValue());
        }

        BigDecimal voucherDiscount = voucher != null ? voucher.getVoucherValue() : BigDecimal.ZERO;
        BigDecimal amountPaid = (totalAmount.subtract(points)).multiply(BigDecimal.ONE.subtract(voucherDiscount));

        Transaction transaction = new Transaction();
        transaction.setCustomer(customer);
        transaction.setEvent(event);
        transaction.setQuantity(request.getQuantity());
        transaction.setPointsApplied(points);
        transaction.setDiscountApplied(voucherDiscount);
        transaction.setAmountPaid(amountPaid);
        transaction.setVoucher(voucher);

        transaction = transactionRepository.save(transaction);

        List<TicketDTO> tickets = ticketService.generateTickets(transaction);
        // Save tickets if necessary

        // Update booked seats
        event.setBookedSeats(event.getBookedSeats() + request.getQuantity());
        eventRepository.save(event);

        TransactionResponseDTO response = new TransactionResponseDTO();
        response.setId(transaction.getId());
        response.setCustomerId(customer.getId());
        response.setEventId(event.getId());
        response.setQuantity(transaction.getQuantity());
        response.setPointsApplied(transaction.getPointsApplied());
        response.setDiscountApplied(transaction.getDiscountApplied());
        response.setAmountPaid(transaction.getAmountPaid());

        return response;
    }

    public Optional<TransactionReceiptResponseDTO> getLatestTransactionByCustomer(Long customerId) {
        return transactionRepository.findTopByCustomerIdOrderByCreatedAtDesc(customerId)
                .map(transaction -> {
                    TransactionReceiptResponseDTO response = new TransactionReceiptResponseDTO();
                    response.setEventName(transaction.getEvent().getTitle());
                    response.setEventStartDateTime(transaction.getEvent().getDateTimeStart());
                    response.setEventEndDateTime(transaction.getEvent().getDateTimeEnd());
                    response.setEventLocation(transaction.getEvent().getLocation());
                    response.setEventLocationDetails(transaction.getEvent().getLocationDetails());
                    response.setTicketQuantity(transaction.getQuantity());
                    response.setTotalFeeBeforeDiscount(transaction.getEvent().getFee().multiply(BigDecimal.valueOf(transaction.getQuantity())));
                    response.setCustomerFullName(transaction.getCustomer().getName());
                    response.setCustomerEmail(transaction.getCustomer().getEmail());
                    response.setVoucherUsed(transaction.getDiscountApplied());
                    response.setPointsUsed(transaction.getPointsApplied());
                    response.setTotalPaid(transaction.getAmountPaid());
                    return response;
                });
    }

    public Optional<TransactionReceiptResponseDTO> getTransactionById(Long transactionId) {
        return transactionRepository.findById(transactionId)
                .map(transaction -> {
                    TransactionReceiptResponseDTO response = new TransactionReceiptResponseDTO();
                    response.setCustomerId(transaction.getCustomer().getId()); // Set customerId
                    response.setEventName(transaction.getEvent().getTitle());
                    response.setEventStartDateTime(transaction.getEvent().getDateTimeStart());
                    response.setEventEndDateTime(transaction.getEvent().getDateTimeEnd());
                    response.setEventLocation(transaction.getEvent().getLocation());
                    response.setEventLocationDetails(transaction.getEvent().getLocationDetails());
                    response.setTicketQuantity(transaction.getQuantity());
                    response.setTotalFeeBeforeDiscount(transaction.getEvent().getFee().multiply(BigDecimal.valueOf(transaction.getQuantity())));
                    response.setCustomerFullName(transaction.getCustomer().getName());
                    response.setCustomerEmail(transaction.getCustomer().getEmail());
                    response.setVoucherUsed(transaction.getDiscountApplied());
                    response.setPointsUsed(transaction.getPointsApplied());
                    response.setTotalPaid(transaction.getAmountPaid());
                    return response;
                });
    }
}
