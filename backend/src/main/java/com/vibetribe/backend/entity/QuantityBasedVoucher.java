package com.vibetribe.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "quantity_based_voucher", schema = "vibetribe")
public class QuantityBasedVoucher {
    @Id
    @Column(name = "voucher_id", nullable = false)
    private Long id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "voucher_id", nullable = false)
    @JsonBackReference
    private Voucher voucher;

    @Column(name = "quantity_limit")
    private Integer quantityLimit;

    @Column(name = "quantity_used")
    private Integer quantityUsed;

}