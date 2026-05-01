package com.example.eventService.demo.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "events")
public class Event {

    @Id
    private String id;
    
    @javax.validation.constraints.NotBlank(message = "Title is mandatory")
    private String title;
    
    @javax.validation.constraints.NotBlank(message = "Description is mandatory")
    private String description;
    
    @javax.validation.constraints.NotBlank(message = "Date is mandatory")
    private String date;
    
    @javax.validation.constraints.NotBlank(message = "Time is mandatory")
    private String time;
    
    @javax.validation.constraints.NotBlank(message = "Location is mandatory")
    private String location;
    
    @javax.validation.constraints.Min(value = 0, message = "Base price cannot be negative")
    private double basePrice;
    
    private double frontSurcharge;
    private double middleSurcharge;
    private boolean isFree;
    private String category;
    private boolean bookingOpen;

    // Default constructor
    public Event() {
    }

    // Parameterized constructor
    public Event(String id, String title, String description, String date, String time, String location, double basePrice, double frontSurcharge, double middleSurcharge, boolean isFree, String category, boolean bookingOpen) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.date = date;
        this.time = time;
        this.location = location;
        this.basePrice = basePrice;
        this.frontSurcharge = frontSurcharge;
        this.middleSurcharge = middleSurcharge;
        this.isFree = isFree;
        this.category = category;
        this.bookingOpen = bookingOpen;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(double basePrice) {
        this.basePrice = basePrice;
    }

    public double getFrontSurcharge() {
        return frontSurcharge;
    }

    public void setFrontSurcharge(double frontSurcharge) {
        this.frontSurcharge = frontSurcharge;
    }

    public double getMiddleSurcharge() {
        return middleSurcharge;
    }

    public void setMiddleSurcharge(double middleSurcharge) {
        this.middleSurcharge = middleSurcharge;
    }

    public boolean isFree() {
        return isFree;
    }

    public void setFree(boolean free) {
        isFree = free;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public boolean isBookingOpen() {
        return bookingOpen;
    }

    public void setBookingOpen(boolean bookingOpen) {
        this.bookingOpen = bookingOpen;
    }
}
