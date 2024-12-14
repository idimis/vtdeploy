package com.vibetribe.backend.infrastructure.usecase.event.controller;

import com.vibetribe.backend.common.response.ApiResponse;
import com.vibetribe.backend.common.response.PaginatedResponse;
import com.vibetribe.backend.common.util.PaginationUtil;
import com.vibetribe.backend.entity.Event;
import com.vibetribe.backend.infrastructure.system.security.Claims;
import com.vibetribe.backend.infrastructure.usecase.event.dto.CreateEventRequestDTO;
import com.vibetribe.backend.infrastructure.usecase.event.dto.EventDTO;
import com.vibetribe.backend.infrastructure.usecase.event.dto.EventStatisticsDTO;
import com.vibetribe.backend.infrastructure.usecase.event.dto.UpdateEventRequestDTO;
import com.vibetribe.backend.infrastructure.usecase.event.service.EventService;
import com.vibetribe.backend.infrastructure.usecase.review.dto.ReviewRequestDTO;
import com.vibetribe.backend.infrastructure.usecase.review.dto.ReviewResponseDTO;
import com.vibetribe.backend.infrastructure.usecase.review.service.ReviewService;
import com.vibetribe.backend.infrastructure.usecase.transaction.dto.TransactionHistoryDTO;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService eventService;
    private final ReviewService reviewService;

    public EventController(EventService eventService,
                           ReviewService reviewService) {
        this.eventService = eventService;
        this.reviewService = reviewService;
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @PostMapping("/create")
    public ResponseEntity<?> createEvent(@Valid @RequestBody CreateEventRequestDTO request) {
        Long organizerId = Claims.getUserIdFromJwt();
        Event event = eventService.createEvent(request, organizerId);
        return ApiResponse.successfulResponse("Create new event success", event);
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/organizer")
    public ResponseEntity<?> getAllEventByOrganizer(@PageableDefault(size = 10) Pageable pageable) {
        Long organizerId = Claims.getUserIdFromJwt();
        Page<Event> events = eventService.getAllEventsByOrganizer(pageable, organizerId);

        if(events.isEmpty()) {
            return ApiResponse.failedResponse(HttpStatus.NOT_FOUND.value(), "Events not found");
        }

        PaginatedResponse<Event> paginatedEvents = PaginationUtil.toPaginatedResponse(events);
        return ApiResponse.successfulResponse("Get all events by organizer success", paginatedEvents);
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody UpdateEventRequestDTO request) {
        Long organizerId = Claims.getUserIdFromJwt();
        Event event = eventService.updateEvent(id, request, organizerId);
        return ApiResponse.successfulResponse("Update event success", event);
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        Long organizerId = Claims.getUserIdFromJwt();
        eventService.deleteEvent(id, organizerId);
        return ApiResponse.successfulResponse("Delete event success", null);
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/statistics")
    public ResponseEntity<?> getEventStatistics(@PageableDefault(size = 10) Pageable pageable) {
        Long organizerId = Claims.getUserIdFromJwt();
        Page<EventStatisticsDTO> statistics = eventService.getEventStatisticsByOrganizer(organizerId, pageable);
        PaginatedResponse<EventStatisticsDTO> paginatedStatistics = PaginationUtil.toPaginatedResponse(statistics);
        return ApiResponse.successfulResponse("Get event statistics success", paginatedStatistics);
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/transaction-history")
    public ResponseEntity<?> getTransactionHistoryByOrganizer(@PageableDefault(size = 10) Pageable pageable) {
        Long organizerId = Claims.getUserIdFromJwt();
        Page<TransactionHistoryDTO> transactionHistory = eventService.getTransactionHistoryByOrganizer(organizerId, pageable);

        if (transactionHistory.isEmpty()) {
            return ApiResponse.failedResponse(HttpStatus.NOT_FOUND.value(), "Transaction history not found");
        }

        PaginatedResponse<TransactionHistoryDTO> paginatedTransactionHistory = PaginationUtil.toPaginatedResponse(transactionHistory);
        return ApiResponse.successfulResponse("Get transaction history success", paginatedTransactionHistory);
    }

    @GetMapping
    public ResponseEntity<?> getEvents(@RequestParam(required = false) String location,
                                       @RequestParam(required = false) String category,
                                       @RequestParam(required = false) String search,
                                       @RequestParam(required = false, defaultValue = "false") boolean sortByNewest,
                                       @RequestParam(required = false, defaultValue = "false") boolean sortByHighestRating,
                                       @PageableDefault(size = 10) Pageable pageable) {

        Page<Event> events = eventService.getUpcomingEvents(pageable,
                location != null ? location.toLowerCase() : null,
                category != null ? category.toLowerCase() : null,
                search != null ? search.toLowerCase() : null,
                sortByNewest,
                sortByHighestRating);

        if (events.isEmpty()) {
            return ApiResponse.failedResponse(HttpStatus.NOT_FOUND.value(), "Events not found");
        }

        PaginatedResponse<Event> paginatedAllEvents = PaginationUtil.toPaginatedResponse(events);
        return ApiResponse.successfulResponse("Get events success", paginatedAllEvents);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<?> getEventBySlug(@PathVariable String slug) {
        EventDTO event = eventService.getEventBySlug(slug);
        return ApiResponse.successfulResponse("Get event by slug success", event);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getEvent(@PathVariable Long id) {
    return eventService.getEventById(id)
            .map(event -> ApiResponse.successfulResponse("Get event success", event))
            .orElse(ApiResponse.failedResponse(HttpStatus.NOT_FOUND.value(), "Event not found"));
}

    @GetMapping("/exclude-location")
    public ResponseEntity<?> getEventsExcludeLocation(@RequestParam String location,
                                                      @PageableDefault(size = 10) Pageable pageable) {
        Page<Event> events = eventService.getEventsExcludingLocation(pageable, location.toLowerCase());

        if(events.isEmpty()) {
            return ApiResponse.failedResponse(HttpStatus.NOT_FOUND.value(), "Events not found");
        }

        PaginatedResponse<Event> paginatedEvents = PaginationUtil.toPaginatedResponse(events);
        return ApiResponse.successfulResponse("Get events exclude location success", paginatedEvents);
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/review")
    public ResponseEntity<?> submitReview(@Valid @RequestBody ReviewRequestDTO reviewRequest) {
        Long customerId = Claims.getUserIdFromJwt();
        ReviewResponseDTO reviewResponse = eventService.submitReview(customerId, reviewRequest);
        return ApiResponse.successfulResponse("Review submitted successfully", reviewResponse);
    }

    @GetMapping("/{eventId}/reviews")
    public ResponseEntity<?> getReviewsByEventId(@PathVariable Long eventId, @PageableDefault(size = 10) Pageable pageable) {
        var reviews = reviewService.getReviewsByEventId(eventId, pageable);

        if (reviews.isEmpty()) {
            return ApiResponse.failedResponse(HttpStatus.NOT_FOUND.value(), "Reviews not found");
        }

        PaginatedResponse<ReviewResponseDTO> paginatedReviews = PaginationUtil.toPaginatedResponse(reviews);
        return ApiResponse.successfulResponse("Get reviews success", paginatedReviews);
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/past")
    public ResponseEntity<?> getPastEventsByCustomer(@PageableDefault(size = 10) Pageable pageable) {
        Long customerId = Claims.getUserIdFromJwt();
        Page<Event> events = eventService.getPastEventsByCustomer(customerId, pageable);

        if (events.isEmpty()) {
            return ApiResponse.failedResponse(HttpStatus.NOT_FOUND.value(), "Past events not found");
        }

        PaginatedResponse<Event> paginatedEvents = PaginationUtil.toPaginatedResponse(events);
        return ApiResponse.successfulResponse("Get past events success", paginatedEvents);
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/upcoming")
    public ResponseEntity<?> getUpcomingEventsByCustomer(@PageableDefault(size = 10) Pageable pageable) {
        Long customerId = Claims.getUserIdFromJwt();
        Page<Event> events = eventService.getUpcomingEventsByCustomer(customerId, pageable);

        if (events.isEmpty()) {
            return ApiResponse.failedResponse(HttpStatus.NOT_FOUND.value(), "Upcoming events not found");
        }

        PaginatedResponse<Event> paginatedEvents = PaginationUtil.toPaginatedResponse(events);
        return ApiResponse.successfulResponse("Get upcoming events success", paginatedEvents);
    }

    @GetMapping("/hottest")
    public ResponseEntity<?> getHottestUpcomingEvent(@PageableDefault(size = 10) Pageable pageable) {
        Page<Event> hottestEvents = eventService.getHottestUpcomingEvent(pageable);
        if (hottestEvents.isEmpty()) {
            return ApiResponse.failedResponse(HttpStatus.NOT_FOUND.value(), "No upcoming events found");
        }
        PaginatedResponse<Event> paginatedHottestEvents = PaginationUtil.toPaginatedResponse(hottestEvents);
        return ApiResponse.successfulResponse("Get hottest upcoming events success", paginatedHottestEvents);
    }
}
