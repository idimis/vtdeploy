package com.vibetribe.backend.infrastructure.usecase.voucher.repository;

import com.vibetribe.backend.entity.Voucher;
import com.vibetribe.backend.infrastructure.usecase.voucher.dto.VoucherDetailsDTO;
import com.vibetribe.backend.infrastructure.usecase.voucher.dto.VoucherSummaryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface VoucherRepository extends JpaRepository<Voucher, Long> {

    @Query("SELECT new com.vibetribe.backend.infrastructure.usecase.voucher.dto.VoucherSummaryDTO(v.id, e.title, v.voucherCode, " +
            "CASE WHEN v.voucherType = 'quantity' AND qbv.quantityLimit = qbv.quantityUsed THEN 'not available' " +
            "WHEN v.voucherType = 'dateRange' AND v.expiresAt < CURRENT_TIMESTAMP THEN 'not available' " +
            "ELSE 'available' END) " +
            "FROM Voucher v " +
            "JOIN v.event e " +
            "LEFT JOIN v.quantityBasedVoucher qbv " +
            "WHERE e.organizer.id = :organizerId AND e.dateTimeStart > CURRENT_TIMESTAMP")
    Page<VoucherSummaryDTO> findUpcomingEventVouchersByOrganizer(@Param("organizerId") Long organizerId, Pageable pageable);

    @Query("SELECT new com.vibetribe.backend.infrastructure.usecase.voucher.dto.VoucherDetailsDTO(v.id, e.title, v.description, v.voucherValue, v.voucherCode, v.voucherType, " +
            "CASE WHEN v.voucherType = 'quantity' AND qbv.quantityLimit = qbv.quantityUsed THEN 'not available' " +
            "WHEN v.voucherType = 'dateRange' AND v.expiresAt < CURRENT_TIMESTAMP THEN 'not available' " +
            "ELSE 'available' END, qbv.quantityLimit - qbv.quantityUsed, drv.startDate, drv.endDate) " +
            "FROM Voucher v " +
            "JOIN v.event e " +
            "LEFT JOIN v.quantityBasedVoucher qbv " +
            "LEFT JOIN v.dateRangeBasedVoucher drv " +
            "WHERE v.id = :voucherId AND e.organizer.id = :organizerId")
    Optional<VoucherDetailsDTO> findVoucherDetailsByIdAndOrganizer(@Param("voucherId") Long voucherId, @Param("organizerId") Long organizerId);

//    @Query("SELECT v FROM Voucher v WHERE v.event.id = :eventId")
    Page<Voucher> findByEventId(@Param("eventId") Long eventId, Pageable pageable);

    Page<Voucher> findByUserId(Long customerId, Pageable pageable);
}
