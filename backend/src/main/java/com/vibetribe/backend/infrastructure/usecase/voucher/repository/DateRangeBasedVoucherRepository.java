package com.vibetribe.backend.infrastructure.usecase.voucher.repository;

import com.vibetribe.backend.entity.DateRangeBasedVoucher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DateRangeBasedVoucherRepository extends JpaRepository<DateRangeBasedVoucher, Long> {
}
