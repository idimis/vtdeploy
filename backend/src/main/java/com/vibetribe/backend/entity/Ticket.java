package com.vibetribe.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "ticket", schema = "vibetribe")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ticket_id_gen")
    @SequenceGenerator(name = "ticket_id_gen", sequenceName = "ticket_id_seq", schema = "vibetribe", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ColumnDefault("'VALID'")
    @Column(name = "status", length = Integer.MAX_VALUE)
    private String status;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "issue_date")
    private OffsetDateTime issueDate;

    @NotNull
    @Column(name = "valid_from", nullable = false)
    private LocalDateTime validFrom;

    @NotNull
    @Column(name = "valid_until", nullable = false)
    private LocalDateTime validUntil;

    @Column(name = "barcode", length = Integer.MAX_VALUE)
    private String barcode;

    @Column(name = "price", precision = 15, scale = 2)
    private BigDecimal price;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "deleted_at")
    private OffsetDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        issueDate = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}