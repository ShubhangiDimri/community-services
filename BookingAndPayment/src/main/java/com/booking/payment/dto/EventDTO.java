package com.booking.payment.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * Data Transfer Object representing an Event fetched from the Event Microservice.
 */
@Data
public class EventDTO {
    private String id;
    private String name;
    private BigDecimal basePrice;
    private BigDecimal frontSurcharge;
    private BigDecimal middleSurcharge;
    private boolean isFree;
}
