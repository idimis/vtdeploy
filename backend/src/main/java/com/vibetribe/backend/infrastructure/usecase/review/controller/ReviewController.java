package com.vibetribe.backend.infrastructure.usecase.review.controller;

import com.vibetribe.backend.common.response.ApiResponse;
import com.vibetribe.backend.common.response.PaginatedResponse;
import com.vibetribe.backend.common.util.PaginationUtil;
import com.vibetribe.backend.infrastructure.system.security.Claims;
import com.vibetribe.backend.infrastructure.usecase.review.dto.ReviewSummaryDTO;
import com.vibetribe.backend.infrastructure.usecase.review.service.ReviewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<?> getAllReviews(@PageableDefault(size = 10) Pageable pageable) {
        Page<ReviewSummaryDTO> reviews = reviewService.getAllReviews(pageable);
        PaginatedResponse paginatedAllReviews = PaginationUtil.toPaginatedResponse(reviews);
        return ApiResponse.successfulResponse("Get all reviews success", paginatedAllReviews);
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/by-organizer")
    public ResponseEntity<?> getReviewsByOrganizerId(
            @PageableDefault(size = 10) Pageable pageable) {
        Long organizerId = Claims.getUserIdFromJwt();
        Page<ReviewSummaryDTO> reviews = reviewService.getReviewsByOrganizerId(organizerId, pageable);
        PaginatedResponse paginatedReviews = PaginationUtil.toPaginatedResponse(reviews);
        return ApiResponse.successfulResponse("Get all reviews by organizer success", paginatedReviews);
    }
}
