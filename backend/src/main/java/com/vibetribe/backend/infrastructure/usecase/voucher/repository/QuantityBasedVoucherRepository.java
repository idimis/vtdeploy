package com.vibetribe.backend.infrastructure.usecase.voucher.repository;

import com.vibetribe.backend.entity.QuantityBasedVoucher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuantityBasedVoucherRepository extends JpaRepository<QuantityBasedVoucher, Long> {
}
