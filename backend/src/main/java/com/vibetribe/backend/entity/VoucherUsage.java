package com.vibetribe.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "voucher_usage", schema = "vibetribe")
public class VoucherUsage {
    @Id
    @ColumnDefault("nextval('vibetribe.voucher_usage_id_seq')")
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private User customer;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "used_at")
    private OffsetDateTime usedAt;

}