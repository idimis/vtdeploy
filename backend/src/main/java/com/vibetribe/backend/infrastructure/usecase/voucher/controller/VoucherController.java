package com.vibetribe.backend.infrastructure.usecase.voucher.controller;

import com.vibetribe.backend.common.response.ApiResponse;
import com.vibetribe.backend.common.response.PaginatedResponse;
import com.vibetribe.backend.common.util.PaginationUtil;
import com.vibetribe.backend.entity.Voucher;
import com.vibetribe.backend.infrastructure.system.security.Claims;
import com.vibetribe.backend.infrastructure.usecase.voucher.dto.CreateVoucherRequestDTO;
import com.vibetribe.backend.infrastructure.usecase.voucher.dto.VoucherDTO;
import com.vibetribe.backend.infrastructure.usecase.voucher.dto.VoucherDetailsDTO;
import com.vibetribe.backend.infrastructure.usecase.voucher.dto.VoucherSummaryDTO;
import com.vibetribe.backend.infrastructure.usecase.voucher.service.VoucherService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/vouchers")
public class VoucherController {
    private final VoucherService voucherService;

    public VoucherController(VoucherService voucherService) {
        this.voucherService = voucherService;
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @PostMapping("/create")
    public ResponseEntity<?> createVoucher(@Valid @RequestBody CreateVoucherRequestDTO request) {
        Long organizerId = Claims.getUserIdFromJwt();
        Voucher voucher = voucherService.createEventVoucher(request, organizerId);
        return ApiResponse.successfulResponse("Create new voucher success", voucher);
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/upcoming")
    public ResponseEntity<?> getUpcomingEventVouchers(@PageableDefault(size = 10) Pageable pageable) {
        Long organizerId = Claims.getUserIdFromJwt();
        Page<VoucherSummaryDTO> vouchers = voucherService.getUpcomingEventVouchers(organizerId, pageable);
        PaginatedResponse<VoucherSummaryDTO> paginatedVouchers = PaginationUtil.toPaginatedResponse(vouchers);
        return ApiResponse.successfulResponse("Get all upcoming event vouchers success", paginatedVouchers);
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/{voucherId}")
    public ResponseEntity<?> getVoucherDetails(@PathVariable Long voucherId) {
        Long organizerId = Claims.getUserIdFromJwt();
        VoucherDetailsDTO voucherDetails = voucherService.getVoucherDetails(voucherId, organizerId);
        return ResponseEntity.ok(voucherDetails);
    }

    @GetMapping("/by-event")
    public ResponseEntity<?> getVouchersByEventId(
            @RequestParam Long eventId,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<Voucher> vouchers = voucherService.getVouchersByEventId(eventId, pageable);
        PaginatedResponse paginatedVouchers = PaginationUtil.toPaginatedResponse(vouchers);
        return ApiResponse.successfulResponse("Get all vouchers by event success", paginatedVouchers);
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/my-vouchers")
    public ResponseEntity<?> getMyVouchers(@PageableDefault(size = 10) Pageable pageable) {
        Long customerId = Claims.getUserIdFromJwt();

        Page<VoucherDTO> vouchers = voucherService.getVouchersForCustomer(customerId, pageable);
        PaginatedResponse<VoucherDTO> paginatedVouchers = PaginationUtil.toPaginatedResponse(vouchers);

        return ApiResponse.successfulResponse("Get vouchers success", paginatedVouchers);
    }
}