package com.vibetribe.backend.infrastructure.usecase.voucher.service;

import com.vibetribe.backend.common.util.VoucherCodeGenerator;
import com.vibetribe.backend.entity.*;
import com.vibetribe.backend.infrastructure.usecase.event.repository.EventRepository;
import com.vibetribe.backend.infrastructure.usecase.user.repository.UserRepository;
import com.vibetribe.backend.infrastructure.usecase.voucher.dto.CreateVoucherRequestDTO;
import com.vibetribe.backend.infrastructure.usecase.voucher.dto.VoucherDTO;
import com.vibetribe.backend.infrastructure.usecase.voucher.dto.VoucherDetailsDTO;
import com.vibetribe.backend.infrastructure.usecase.voucher.dto.VoucherSummaryDTO;
import com.vibetribe.backend.infrastructure.usecase.voucher.repository.DateRangeBasedVoucherRepository;
import com.vibetribe.backend.infrastructure.usecase.voucher.repository.QuantityBasedVoucherRepository;
import com.vibetribe.backend.infrastructure.usecase.voucher.repository.VoucherRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class VoucherService {
    private final VoucherRepository voucherRepository;
    private final EventRepository eventRepository;
    private final DateRangeBasedVoucherRepository dateRangeBasedVoucherRepository;
    private final QuantityBasedVoucherRepository quantityBasedVoucherRepository;
    private final UserRepository userRepository;

    public VoucherService(VoucherRepository voucherRepository,
                          EventRepository eventRepository,
                          DateRangeBasedVoucherRepository dateRangeBasedVoucherRepository,
                          QuantityBasedVoucherRepository quantityBasedVoucherRepository,
                          UserRepository userRepository) {
        this.voucherRepository = voucherRepository;
        this.eventRepository = eventRepository;
        this.dateRangeBasedVoucherRepository = dateRangeBasedVoucherRepository;
        this.quantityBasedVoucherRepository = quantityBasedVoucherRepository;
        this.userRepository = userRepository;
    }

    public Voucher createEventVoucher(CreateVoucherRequestDTO request, Long organizerId) {
        Event event = eventRepository.findByIdAndOrganizerId(request.getEventId(), organizerId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found or not owned by organizer"));

        Voucher voucher = new Voucher();
        voucher.setEvent(event);
        voucher.setVoucherCode(request.getVoucherCode());
        voucher.setVoucherValue(request.getVoucherValue());
        voucher.setDescription(request.getDescription());
        voucher.setVoucherType(request.getVoucherType());

        voucher = voucherRepository.save(voucher);

        if ("dateRange".equalsIgnoreCase(request.getVoucherType())) {
            DateRangeBasedVoucher dateRangeBasedVoucher = new DateRangeBasedVoucher();
            dateRangeBasedVoucher.setVoucher(voucher);
            dateRangeBasedVoucher.setStartDate(request.getStartDate());
            dateRangeBasedVoucher.setEndDate(request.getEndDate());
            dateRangeBasedVoucherRepository.save(dateRangeBasedVoucher);
            voucher.setDateRangeBasedVoucher(dateRangeBasedVoucher);
            // Save dateRangeBasedVoucher to its repository
        }

        if ("quantity".equalsIgnoreCase(request.getVoucherType())) {
            QuantityBasedVoucher quantityBasedVoucher = new QuantityBasedVoucher();
            quantityBasedVoucher.setVoucher(voucher);
            quantityBasedVoucher.setQuantityLimit(request.getQuantityLimit());
            quantityBasedVoucher.setQuantityUsed(0);
            quantityBasedVoucherRepository.save(quantityBasedVoucher);
            voucher.setQuantityBasedVoucher(quantityBasedVoucher);
            // Save quantityBasedVoucher to its repository
        }

        return voucher;
    }

    public void createIndividualVoucher(User user, int discountPercentage) {
        Voucher voucher = new Voucher();
        voucher.setUser(user);
        voucher.setVoucherCode(VoucherCodeGenerator.generateVoucherCode());
        voucher.setVoucherValue(BigDecimal.valueOf(discountPercentage));
        voucher.setVoucherType("DISCOUNT");
        voucher.setDescription("10% discount voucher for using referral code");
        voucher.setExpiresAt(LocalDateTime.now().plusMonths(3));

        voucherRepository.save(voucher);
    }

    public Page<VoucherSummaryDTO> getUpcomingEventVouchers(Long organizerId, Pageable pageable) {
        return voucherRepository.findUpcomingEventVouchersByOrganizer(organizerId, pageable);
    }

    public VoucherDetailsDTO getVoucherDetails(Long voucherId, Long organizerId) {
        return voucherRepository.findVoucherDetailsByIdAndOrganizer(voucherId, organizerId)
                .orElseThrow(() -> new IllegalArgumentException("Voucher not found or not owned by organizer"));
    }

    public Page<Voucher> getVouchersByEventId(Long eventId, Pageable pageable) {
        return voucherRepository.findByEventId(eventId, pageable);
    }

    public Page<VoucherDTO> getVouchersForCustomer(Long customerId, Pageable pageable) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        Page<Voucher> vouchers = voucherRepository.findByUserId(customerId, pageable);

        return vouchers.map(voucher -> {
            VoucherDTO dto = new VoucherDTO();
            dto.setId(voucher.getId());
            dto.setCode(voucher.getVoucherCode());
            dto.setDescription(voucher.getDescription());
            dto.setExpiryDate(voucher.getExpiresAt());
            dto.setUsed(voucher.isUsed());
            return dto;
        });
    }
}