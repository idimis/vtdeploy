package com.vibetribe.backend.infrastructure.usecase.event.dto;

import com.vibetribe.backend.entity.Event;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for {@link Event}
 */
@Value
@Getter
@Setter
@AllArgsConstructor
public class EventDTO implements Serializable {
    Long id;
    Long organizerId;
    @NotBlank(message = "Image URL is mandatory")
    String imageUrl;
    @NotBlank(message = "Title is mandatory")
    String title;
    @NotBlank(message = "Description is mandatory")
    String description;
    LocalDateTime dateTimeStart;
    LocalDateTime dateTimeEnd;
    @NotBlank(message = "Location is mandatory")
    String location;
    @NotBlank(message = "Location is mandatory")
    String locationDetails;
    @NotBlank(message = "Category is mandatory")
    String category;
    BigDecimal fee;
    Integer availableSeats;
    Integer bookedSeats;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    LocalDateTime deletedAt;
}