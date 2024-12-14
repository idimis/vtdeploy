package com.vibetribe.backend.infrastructure.usecase.event.repository;

import com.vibetribe.backend.entity.Event;
import com.vibetribe.backend.infrastructure.usecase.event.dto.EventStatisticsDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findByIdAndOrganizerId(Long eventId, Long organizerId);
    Page<Event> findByLocationNot(Pageable pageable, String location);
    Page<Event> findByOrganizerId(Pageable pageable, Long organizerId);

    @Query("SELECT e FROM Event e WHERE e.dateTimeStart > :currentDateTime AND " +
            "(LOWER(e.location) = LOWER(:location) OR :location IS NULL) AND " +
            "(LOWER(e.category) = LOWER(:category) OR :category IS NULL) AND " +
            "(LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) OR :search IS NULL) " +
            "ORDER BY e.dateTimeStart ASC")
    Page<Event> findUpcomingEvents(Pageable pageable, LocalDateTime currentDateTime, String location, String category, String search);

    @Query("SELECT e FROM Event e WHERE e.dateTimeStart > :currentDateTime AND " +
            "(LOWER(e.location) = LOWER(:location) OR :location IS NULL) AND " +
            "(LOWER(e.category) = LOWER(:category) OR :category IS NULL) AND " +
            "(LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) OR :search IS NULL) " +
            "ORDER BY e.createdAt DESC")
    Page<Event> findUpcomingEventsSortedByNewest(Pageable pageable, LocalDateTime currentDateTime, String location, String category, String search);

    @Query("SELECT e FROM Event e LEFT JOIN Review r ON e.id = r.eventId WHERE e.dateTimeStart > :currentDateTime AND " +
            "(LOWER(e.location) = LOWER(:location) OR :location IS NULL) AND " +
            "(LOWER(e.category) = LOWER(:category) OR :category IS NULL) AND " +
            "(LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) OR :search IS NULL) " +
            "GROUP BY e.id " +
            "ORDER BY AVG(r.rating) DESC")
    Page<Event> findUpcomingEventsSortedByHighestRating(Pageable pageable, LocalDateTime currentDateTime, String location, String category, String search);

    @Query("SELECT e FROM Event e JOIN Transaction t ON e.id = t.event.id WHERE t.customer.id = :customerId AND e.dateTimeEnd < :currentDateTime")
    Page<Event> findPastEventsByCustomer(Long customerId, LocalDateTime currentDateTime, Pageable pageable);

    @Query("SELECT e FROM Event e JOIN Transaction t ON e.id = t.event.id WHERE t.customer.id = :customerId AND e.dateTimeEnd >= :currentDateTime")
    Page<Event> findUpcomingEventsByCustomer(Long customerId, LocalDateTime currentDateTime, Pageable pageable);

    @Query("SELECT new com.vibetribe.backend.infrastructure.usecase.event.dto.EventStatisticsDTO(e.id, e.title, COUNT(t), AVG(r.rating), SUM(t.amountPaid)) " +
            "FROM Event e " +
            "LEFT JOIN Review r ON e.id = r.eventId " +
            "LEFT JOIN Transaction t ON e.id = t.event.id " +
            "WHERE e.organizer.id = :organizerId " +
            "GROUP BY e.id, e.title")
    Page<EventStatisticsDTO> findEventStatisticsByOrganizer(@Param("organizerId") Long organizerId, Pageable pageable);

    Optional<Event> findBySlug(String slug);

    @Query("SELECT e FROM Event e JOIN Transaction t ON e.id = t.event.id " +
            "WHERE e.dateTimeStart > :currentDateTime " +
            "GROUP BY e.id " +
            "ORDER BY COUNT(t.id) DESC")
    Page<Event> findHottestUpcomingEvent(LocalDateTime currentDateTime, Pageable pageable);
}
