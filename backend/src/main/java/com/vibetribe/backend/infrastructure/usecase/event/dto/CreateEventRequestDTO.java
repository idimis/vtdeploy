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
public class CreateEventRequestDTO {

    @NotBlank(message = "Image URL is mandatory")
    private String imageUrl;

    @NotBlank(message = "Title is mandatory")
    private String title;

    @NotBlank(message = "Description is mandatory")
    private String description;

    @NotNull(message = "Start time is mandatory")
    private LocalDateTime dateTimeStart;

    @NotNull(message = "End time is mandatory")
    private LocalDateTime dateTimeEnd;

    @NotBlank(message = "Location is mandatory")
    private String location;

    @NotBlank(message = "Location is mandatory")
    private String locationDetails;

    @NotBlank(message = "Category is mandatory")
    private String category;

    @NotNull(message = "Fee is mandatory")
    private BigDecimal fee;

    @NotNull(message = "Available seats are mandatory")
    private Integer availableSeats;
}
