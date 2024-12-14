package com.vibetribe.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "referral", schema = "vibetribe")
@Getter
@Setter
@NoArgsConstructor
public class Referral {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "referral_id_gen")
    @SequenceGenerator(name = "referral_id_gen", sequenceName = "referral_id_seq", schema = "vibetribe", allocationSize = 1)
    private Long id;

    @Column(name = "referral_code")
    private String referralCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referrer_id")
    private User referrer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referred_id")
    private User referred;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
