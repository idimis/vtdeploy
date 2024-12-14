package com.vibetribe.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "voucher", schema = "vibetribe")
@Getter
@Setter
@NoArgsConstructor
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "voucher_id_gen")
    @SequenceGenerator(name = "voucher_id_gen", sequenceName = "voucher_id_seq", schema = "vibetribe", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    @JsonBackReference
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    @JsonBackReference
    private User user;

    @Column(name = "voucher_code", unique = true)
    private String voucherCode;

    @Column(name = "voucher_value", precision = 15, scale = 2)
    private BigDecimal voucherValue;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "voucher_type")
    private String voucherType; // 'DATE_RANGE' or 'QUANTITY' or 'DISCOUNT'

    @Column(name = "is_used")
    private boolean isUsed;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "voucher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private DateRangeBasedVoucher dateRangeBasedVoucher;

    @OneToOne(mappedBy = "voucher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private QuantityBasedVoucher quantityBasedVoucher;
}

