package com.booking.payment.model;

import javax.validation.constraints.Email;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

/**
 * Entity representing a Booking in the system.
 * This class is mapped to the 'bookings' collection in MongoDB.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    private String userId;
    private String fullName;

    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    private String eventId;

    @Min(value = 1, message = "Number of tickets must be at least 1")
    private Integer numberOfTickets;

    private String seatPreference;
    private BigDecimal amount;
    private BookingStatus status;
}
