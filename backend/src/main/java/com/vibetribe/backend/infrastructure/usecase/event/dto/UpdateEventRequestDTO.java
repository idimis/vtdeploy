package com.vibetribe.backend.infrastructure.usecase.event.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
public class UpdateEventRequestDTO {
    private String imageUrl;
    private String title;
    private String description;
    private LocalDateTime dateTimeStart;
    private LocalDateTime dateTimeEnd;
    private String location;
    private String locationDetails;
    private String category;
    private BigDecimal fee;
    private Integer availableSeats;
}
