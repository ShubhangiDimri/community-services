package com.booking.payment.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.math.BigDecimal;

/**
 * Data Transfer Object representing an Event fetched from the Event Microservice.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class EventDTO {
    private String id;
    @JsonAlias({"name"})
    private String title;
    private BigDecimal basePrice;
    private BigDecimal frontSurcharge;
    private BigDecimal middleSurcharge;
    private boolean isFree;
}
