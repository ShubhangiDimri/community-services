package com.booking.payment.repository;

import com.booking.payment.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Booking entities.
 * Supports standard CRUD operations via MongoRepository and custom query methods.
 */
@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    /**
     * Finds all bookings associated with a specific user.
     * @param userId The ID of the user.
     * @return A list of bookings.
     */
    List<Booking> findByUserId(String userId);

    /**
     * Finds all bookings associated with a specific event.
     * @param eventId The ID of the event.
     * @return A list of bookings.
     */
    List<Booking> findByEventId(String eventId);
}
