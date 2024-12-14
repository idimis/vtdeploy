package com.vibetribe.backend.infrastructure.usecase.review.service;

import com.vibetribe.backend.entity.Event;
import com.vibetribe.backend.entity.User;
import com.vibetribe.backend.infrastructure.usecase.event.repository.EventRepository;
import com.vibetribe.backend.infrastructure.usecase.review.dto.ReviewResponseDTO;
import com.vibetribe.backend.infrastructure.usecase.review.dto.ReviewSummaryDTO;
import com.vibetribe.backend.infrastructure.usecase.review.repository.ReviewRepository;
import com.vibetribe.backend.infrastructure.usecase.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository, EventRepository eventRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    public Page<ReviewResponseDTO> getReviewsByEventId(Long eventId, Pageable pageable) {
        return reviewRepository.findByEventId(eventId, pageable)
                .map(review -> {
                    var responseDTO = new ReviewResponseDTO();
                    responseDTO.setId(review.getId());
                    responseDTO.setCustomerId(review.getCustomerId());
                    responseDTO.setEventId(review.getEventId());
                    responseDTO.setRating(review.getRating());
                    responseDTO.setReview(review.getReview());
                    responseDTO.setCreatedAt(review.getCreatedAt());

                    // Fetch event details
                    Event event = eventRepository.findById(review.getEventId()).orElse(null);
                    if (event != null) {
                        responseDTO.setEventTitle(event.getTitle());
                        responseDTO.setEventDateTimeStart(event.getDateTimeStart());
                        responseDTO.setEventDateTimeEnd(event.getDateTimeEnd());
                    }

                    // Fetch customer details
                    User customer = userRepository.findById(review.getCustomerId()).orElse(null);
                    if (customer != null) {
                        responseDTO.setCustomerName(customer.getName());
                    }

                    return responseDTO;
                });
    }

    public Page<ReviewSummaryDTO> getAllReviews(Pageable pageable) {
        return reviewRepository.findAllReviews(pageable);
    }

    public Page<ReviewSummaryDTO> getReviewsByOrganizerId(Long organizerId, Pageable pageable) {
        return reviewRepository.findReviewsByOrganizerId(organizerId, pageable);
    }
}
