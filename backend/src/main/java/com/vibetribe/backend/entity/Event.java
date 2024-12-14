package com.vibetribe.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

@Entity
@Table(name = "event", schema = "vibetribe")
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "event_id_gen")
    @SequenceGenerator(name = "event_id_gen", sequenceName = "event_id_seq", schema = "vibetribe", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "organizer_id", nullable = false)
    @JsonIgnore
    private User organizer;

    @NotBlank(message = "Image URL is mandatory")
    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @NotBlank(message = "Title is mandatory")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Description is mandatory")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "date_time_start", nullable = false)
    private LocalDateTime dateTimeStart;

    @Column(name = "date_time_end", nullable = false)
    private LocalDateTime dateTimeEnd;

    @NotBlank(message = "Location is mandatory")
    @Column(name = "location", nullable = false)
    private String location;

    @NotBlank(message = "Location is mandatory")
    @Column(name = "location_details", nullable = false)
    private String locationDetails;

    @NotBlank(message = "Category is mandatory")
    @Column(nullable = false)
    private String category;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal fee;

    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    @Column(name = "booked_seats", nullable = false)
    private Integer bookedSeats = 0;

    @Column(name = "slug", nullable = false)
    private String slug;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // Relationships
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    @JsonManagedReference
    private Set<Transaction> transactions = new HashSet<>();

    @OneToMany(mappedBy = "eventId", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    private Set<Review> reviews = new HashSet<>();

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    @JsonManagedReference
    private Set<Voucher> vouchers = new HashSet<>();

    @PrePersist
    @PreUpdate
    public void generateSlug() {
        if (this.title != null && (this.slug == null || this.slug.isEmpty())) {
            this.slug = toSlug(this.title);
        }
    }

    private String toSlug(String input) {
        String nonWhitespace = input.trim().replaceAll("\\s+", "-");
        String normalized = Normalizer.normalize(nonWhitespace, Normalizer.Form.NFD);
        String slug = Pattern.compile("\\P{Alnum}+").matcher(normalized).replaceAll("-").toLowerCase();
        return slug;
    }
}