package com.vibetribe.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "user", schema = "vibetribe")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_id_gen")
    @SequenceGenerator(name = "user_id_gen", sequenceName = "user_id_seq", schema = "vibetribe", allocationSize = 1)
    private Long id;

    @NotBlank(message = "Name is mandatory")
    @Size(max = 100, message = "Name can have at most 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @NotBlank(message = "Password is mandatory")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Column(nullable = false)
    private String password;

    @Column(name = "photo_profile_url")
    private String photoProfileUrl;

    @Column(name = "referral_code", unique = true)
    private String referralCode;

    @Column(name = "points_balance", nullable = false)
    private Double pointsBalance = 0.0;

    @NotBlank(message = "Role is mandatory")
    @Column(name = "role",nullable = false)
    private String role; // 'customer' or 'organizer'

    private String website;

    @Column(name = "phone_number")
    private String phoneNumber;

    private String address;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // Relationships
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    @JsonManagedReference
    @JsonIgnore
    private Set<Point> points = new HashSet<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    @JsonBackReference
    @JsonIgnore
    private Set<Transaction> transactions = new HashSet<>();

    @OneToMany(mappedBy = "customerId", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    @JsonIgnore
    private Set<Review> reviews = new HashSet<>();

    @OneToMany(mappedBy = "organizer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    @JsonIgnore
    private Set<Event> organizedEvents = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    @JsonIgnore
    private Set<Voucher> personalVouchers = new HashSet<>();

    public void addPoints(double points, LocalDateTime expirationDate) {
        Point point = new Point();
        point.setCustomer(this);
        point.setPointsAvailable(points);
        point.setExpiresAt(expirationDate);
        this.points.add(point);
        this.pointsBalance += points;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return email.equals(user.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(email);
    }
}

