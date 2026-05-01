package com.booking.payment.service;

import com.booking.payment.dto.EventDTO;
import com.booking.payment.model.Booking;
import com.booking.payment.model.BookingStatus;
import com.booking.payment.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Service class for managing booking business logic.
 */
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RestTemplate restTemplate;

    @Value("${services.event.base-url:http://localhost:8083/events}")
    private String eventServiceUrl;

    @Value("${services.notification.base-url:http://localhost:8089/notify}")
    private String notificationServiceUrl;

    /**
     * Creates a new booking by fetching event pricing from the Event Microservice.
     */
    public Booking createBooking(Booking booking) {
        // 1. Fetch Event details from Event Microservice
        EventDTO event = restTemplate.getForObject(buildEventUrl(booking.getEventId()), EventDTO.class);

        if (event == null) {
            throw new RuntimeException("Event not found with ID: " + booking.getEventId());
        }

        // 2. Initial status
        booking.setStatus(BookingStatus.PENDING);

        // 3. Dynamic Pricing Logic from Event Service
        BigDecimal unitPrice = event.isFree() ? BigDecimal.ZERO : event.getBasePrice();
        
        if (!event.isFree()) {
            String preference = booking.getSeatPreference() != null ? booking.getSeatPreference().toUpperCase() : "";
            if (preference.contains("FRONT") && event.getFrontSurcharge() != null) {
                unitPrice = unitPrice.add(event.getFrontSurcharge());
            } else if (preference.contains("MIDDLE") && event.getMiddleSurcharge() != null) {
                unitPrice = unitPrice.add(event.getMiddleSurcharge());
            }
        }

        // 4. Calculate total amount
        if (booking.getNumberOfTickets() != null) {
            booking.setAmount(unitPrice.multiply(new BigDecimal(booking.getNumberOfTickets())));
        } else {
            booking.setAmount(BigDecimal.ZERO);
        }

        // 5. Save to local DB
        Booking savedBooking = bookingRepository.save(booking);

        // Notify user immediately that the booking was created
        try {
            String recipientName = savedBooking.getFullName() != null ? savedBooking.getFullName() : savedBooking.getUserId();
            String recipientEmail = savedBooking.getEmail();
            String message = "Your booking for event " + savedBooking.getEventId() + " has been received. Status: " + savedBooking.getStatus();
            restTemplate.postForObject(notificationServiceUrl, new NotificationRequest(recipientName, recipientEmail, message), String.class);
        } catch (Exception e) {
            System.err.println("Failed to send booking notification: " + e.getMessage());
        }

        return savedBooking;
    }

    /**
     * Processes payment for a booking.
     * @param bookingId The ID of the booking to pay for.
     * @return The updated booking or empty if not found.
     */
    public Optional<Booking> processPayment(String bookingId) {
        return bookingRepository.findById(bookingId).map(booking -> {
            
            // Simulation of payment processing
            if (booking.getAmount().compareTo(BigDecimal.ZERO) > 0) {
                System.out.println("Processing payment for amount: " + booking.getAmount());
                // Simulate success
            } else {
                System.out.println("Booking is free. No payment needed.");
            }

            // Set status to CONFIRMED
            booking.setStatus(BookingStatus.CONFIRMED);
            Booking savedBooking = bookingRepository.save(booking);

            // Notify User
            try {
                String message = "Your booking for event " + booking.getEventId() + " is confirmed. Amount: " + booking.getAmount();
                String recipientName = booking.getFullName() != null ? booking.getFullName() : booking.getUserId();
                String recipientEmail = booking.getEmail();
                restTemplate.postForObject(notificationServiceUrl, new NotificationRequest(recipientName, recipientEmail, message), String.class);
            } catch (Exception e) {
                System.err.println("Failed to send notification: " + e.getMessage());
            }
            
            return savedBooking;
        });
    }

    // Inner class for notification request
    private static class NotificationRequest {
        public String name;
        public String recipientEmail;
        public String message;
        public NotificationRequest(String name, String recipientEmail, String message) {
            this.name = name;
            this.recipientEmail = recipientEmail;
            this.message = message;
        }
    }

    private String buildEventUrl(String eventId) {
        if (eventServiceUrl.endsWith("/")) {
            return eventServiceUrl + eventId;
        }
        return eventServiceUrl + "/" + eventId;
    }

    /**
     * Retrieves all bookings for a specific user.
     * @param userId The ID of the user.
     * @return List of bookings.
     */
    public List<Booking> getBookingsByUser(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    /**
     * Retrieves all bookings in the system.
     * @return List of all bookings.
     */
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
