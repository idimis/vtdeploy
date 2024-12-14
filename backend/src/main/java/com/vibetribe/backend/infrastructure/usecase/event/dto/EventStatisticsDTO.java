package com.vibetribe.backend.infrastructure.usecase.event.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class EventStatisticsDTO {
    private Long eventId;
    private String eventName;
    private Long totalAttendees;
    private Double averageRating;
    private BigDecimal totalRevenue;

    public EventStatisticsDTO(Long id, String title, Long count, Double avgRating, BigDecimal sumAmount) {
        this.eventId = id;
        this.eventName = title;
        this.totalAttendees = count;
        this.averageRating = avgRating;
        this.totalRevenue = sumAmount;
    }
}
