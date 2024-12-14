package com.vibetribe.backend.infrastructure.usecase.review.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReviewResponseDTO {

    private Long id;
    private Long customerId;
    private Long eventId;
    private Integer rating;
    private String review;
    private LocalDateTime createdAt;

    // Event details
    private String eventTitle;
    private LocalDateTime eventDateTimeStart;
    private LocalDateTime eventDateTimeEnd;

    // Customer details
    private String customerName;
}
