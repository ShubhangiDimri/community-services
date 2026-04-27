package com.booking.payment.controller;

import com.booking.payment.model.Booking;
import com.booking.payment.service.BookingService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for managing Booking requests.
 */
@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    /**
     * Endpoint to create a new booking.
     * URL: POST /bookings
     */
    @PostMapping
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody Booking booking) {
        Booking savedBooking = bookingService.createBooking(booking);
        return ResponseEntity.status(201).body(savedBooking);
    }

    /**
     * Endpoint to process payment for an existing booking.
     * URL: POST /bookings/pay/{bookingId}
     */
    @PostMapping("/pay/{bookingId}")
    public ResponseEntity<Booking> processPayment(@PathVariable String bookingId) {
        return bookingService.processPayment(bookingId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Endpoint to get all bookings in the system.
     * URL: GET /bookings
     */
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    /**
     * Endpoint to get bookings for a specific user.
     * URL: GET /bookings/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }
}
