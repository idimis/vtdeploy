package com.vibetribe.backend.infrastructure.usecase.event.service;

import com.vibetribe.backend.entity.Event;
import com.vibetribe.backend.entity.Review;
import com.vibetribe.backend.entity.User;
import com.vibetribe.backend.infrastructure.usecase.event.dto.CreateEventRequestDTO;
import com.vibetribe.backend.infrastructure.usecase.event.dto.EventDTO;
import com.vibetribe.backend.infrastructure.usecase.event.dto.EventStatisticsDTO;
import com.vibetribe.backend.infrastructure.usecase.event.dto.UpdateEventRequestDTO;
import com.vibetribe.backend.infrastructure.usecase.event.repository.EventRepository;
import com.vibetribe.backend.infrastructure.usecase.review.dto.ReviewRequestDTO;
import com.vibetribe.backend.infrastructure.usecase.review.dto.ReviewResponseDTO;
import com.vibetribe.backend.infrastructure.usecase.review.repository.ReviewRepository;
import com.vibetribe.backend.infrastructure.usecase.ticket.repository.TicketRepository;
import com.vibetribe.backend.infrastructure.usecase.transaction.dto.TransactionHistoryDTO;
import com.vibetribe.backend.infrastructure.usecase.transaction.repository.TransactionRepository;
import com.vibetribe.backend.infrastructure.usecase.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class EventService {

    private final TicketRepository ticketRepository;
    private final ReviewRepository reviewRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public EventService(EventRepository eventRepository,
                        UserRepository userRepository,
                        TicketRepository ticketRepository,
                        ReviewRepository reviewRepository,
                        TransactionRepository transactionRepository) {
        this.ticketRepository = ticketRepository;
        this.reviewRepository = reviewRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    public Event createEvent(CreateEventRequestDTO request, Long organizerId) {
        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> new RuntimeException("Organizer not found"));

        Event event = new Event();
        event.setImageUrl(request.getImageUrl());
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setDateTimeStart(request.getDateTimeStart());
        event.setDateTimeEnd(request.getDateTimeEnd());
        event.setLocation(request.getLocation());
        event.setLocationDetails(request.getLocationDetails());
        event.setCategory(request.getCategory());
        event.setFee(request.getFee());
        event.setAvailableSeats(request.getAvailableSeats());
        event.setOrganizer(organizer);

        event.generateSlug();

        return eventRepository.save(event);
    }

    public Event updateEvent(Long eventId, UpdateEventRequestDTO request, Long organizerId) {
        Event event = eventRepository.findByIdAndOrganizerId(eventId, organizerId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found or not owned by organizer"));

        if (request.getImageUrl() != null) {
            event.setImageUrl(request.getImageUrl());
        }
        if (request.getTitle() != null) {
            event.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            event.setDescription(request.getDescription());
        }
        if (request.getDateTimeStart() != null) {
            event.setDateTimeStart(request.getDateTimeStart());
        }
        if (request.getDateTimeEnd() != null) {
            event.setDateTimeEnd(request.getDateTimeEnd());
        }
        if (request.getLocation() != null) {
            event.setLocation(request.getLocation());
        }
        if (request.getLocationDetails() != null) {
            event.setLocationDetails(request.getLocationDetails());
        }
        if (request.getCategory() != null) {
            event.setCategory(request.getCategory());
        }
        if (request.getFee() != null) {
            event.setFee(request.getFee());
        }
        if (request.getAvailableSeats() != null) {
            event.setAvailableSeats(request.getAvailableSeats());
        }

        event.generateSlug();

        return eventRepository.save(event);
    }

    public void deleteEvent(Long eventId, Long organizerId) {
        Event event = eventRepository.findByIdAndOrganizerId(eventId, organizerId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found or not owned by organizer"));
        eventRepository.delete(event);
    }

    public Page<Event> getAllEventsByOrganizer(Pageable pageable, Long organizerId) {
        return eventRepository.findByOrganizerId(pageable, organizerId);
    }

    public Optional<EventDTO> getEventById(Long id) {
        return eventRepository.findById(id).map(this::convertToDTO);
    }

    private EventDTO convertToDTO(Event event) {
        return new EventDTO(
                event.getId(),
                event.getOrganizer().getId(),
                event.getImageUrl(),
                event.getTitle(),
                event.getDescription(),
                event.getDateTimeStart(),
                event.getDateTimeEnd(),
                event.getLocation(),
                event.getLocationDetails(),
                event.getCategory(),
                event.getFee(),
                event.getAvailableSeats(),
                event.getBookedSeats(),
                event.getCreatedAt(),
                event.getUpdatedAt(),
                event.getDeletedAt()
        );
    }

    public Page<Event> getEventsExcludingLocation(Pageable pageable, String location) {
        return eventRepository.findByLocationNot(pageable, location);
    }

    public Page<Event> getUpcomingEvents(Pageable pageable, String location, String category, String search, boolean sortByNewest, boolean sortByHighestRating) {
        LocalDateTime currentDateTime = LocalDateTime.now();
        if (sortByHighestRating) {
            return eventRepository.findUpcomingEventsSortedByHighestRating(pageable, currentDateTime, location, category, search);
        } else if (sortByNewest) {
            return eventRepository.findUpcomingEventsSortedByNewest(pageable, currentDateTime, location, category, search);
        } else {
            return eventRepository.findUpcomingEvents(pageable, currentDateTime, location, category, search);
        }
    }

    @Transactional
    public ReviewResponseDTO submitReview(Long customerId, ReviewRequestDTO reviewRequest) {
        if (!ticketRepository.existsByCustomerIdAndEventId(customerId, reviewRequest.getEventId())) {
            throw new IllegalArgumentException("Customer has not bought a ticket for this event");
        }

        Event event = eventRepository.findById(reviewRequest.getEventId())
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        if (event.getDateTimeEnd().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("Event has not ended yet");
        }

        if (reviewRepository.existsByCustomerIdAndEventId(customerId, reviewRequest.getEventId())) {
            throw new IllegalArgumentException("Customer has already submitted a review for this event");
        }

        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        Review review = new Review();
        review.setCustomerId(customerId);
        review.setEventId(event.getId());
        review.setRating(reviewRequest.getRating());
        review.setReview(reviewRequest.getReview());
        review = reviewRepository.save(review);

        ReviewResponseDTO responseDTO = new ReviewResponseDTO();
        responseDTO.setId(review.getId());
        responseDTO.setCustomerId(review.getCustomerId());
        responseDTO.setEventId(review.getEventId());
        responseDTO.setRating(review.getRating());
        responseDTO.setReview(review.getReview());
        responseDTO.setCreatedAt(review.getCreatedAt());
        responseDTO.setEventTitle(event.getTitle());
        responseDTO.setEventDateTimeStart(event.getDateTimeStart());
        responseDTO.setEventDateTimeEnd(event.getDateTimeEnd());
        responseDTO.setCustomerName(customer.getName());

        return responseDTO;
    }

    public Page<Event> getPastEventsByCustomer(Long customerId, Pageable pageable) {
        return eventRepository.findPastEventsByCustomer(customerId, LocalDateTime.now(), pageable);
    }

    public Page<Event> getUpcomingEventsByCustomer(Long customerId, Pageable pageable) {
        return eventRepository.findUpcomingEventsByCustomer(customerId, LocalDateTime.now(), pageable);
    }

    public Page<EventStatisticsDTO> getEventStatisticsByOrganizer(Long organizerId, Pageable pageable) {
        return eventRepository.findEventStatisticsByOrganizer(organizerId, pageable);
    }

    public EventDTO getEventBySlug(String slug) {
        Event event = eventRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));
        return convertToDTO(event);
    }

    public Page<Event> getHottestUpcomingEvent(Pageable pageable) {
        LocalDateTime currentDateTime = LocalDateTime.now();
        return eventRepository.findHottestUpcomingEvent(currentDateTime, pageable);
    }

    public Page<TransactionHistoryDTO> getTransactionHistoryByOrganizer(Long organizerId, Pageable pageable) {
        return transactionRepository.findTransactionHistoryByOrganizer(organizerId, pageable);
    }
}
