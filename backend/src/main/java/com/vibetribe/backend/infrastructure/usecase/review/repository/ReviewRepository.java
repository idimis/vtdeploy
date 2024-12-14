package com.vibetribe.backend.infrastructure.usecase.review.repository;

import com.vibetribe.backend.entity.Review;
import com.vibetribe.backend.infrastructure.usecase.review.dto.ReviewSummaryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByEventId(Long eventId, Pageable pageable);
    boolean existsByCustomerIdAndEventId(Long customerId, Long eventId);

    @Query("SELECT new com.vibetribe.backend.infrastructure.usecase.review.dto.ReviewSummaryDTO(e.title, c.id, c.photoProfileUrl, c.name, r.rating, r.review) " +
            "FROM Review r " +
            "JOIN Event e ON r.eventId = e.id " +
            "JOIN User c ON r.customerId = c.id")
    Page<ReviewSummaryDTO> findAllReviews(Pageable pageable);

    @Query("SELECT new com.vibetribe.backend.infrastructure.usecase.review.dto.ReviewSummaryDTO(e.title, c.id, c.photoProfileUrl, c.name, r.rating, r.review) " +
            "FROM Review r " +
            "JOIN Event e ON r.eventId = e.id " +
            "JOIN User c ON r.customerId = c.id " +
            "WHERE e.organizer.id = :organizerId")
    Page<ReviewSummaryDTO> findReviewsByOrganizerId(Long organizerId, Pageable pageable);
}
