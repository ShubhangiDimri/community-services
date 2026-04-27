package com.example.eventService.demo.service;

import com.example.eventService.demo.entity.Event;
import com.example.eventService.demo.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(String id) {
        return eventRepository.findById(id);
    }

    public Event updateEvent(String id, Event updatedEvent) {
        return eventRepository.findById(id).map(event -> {
            event.setTitle(updatedEvent.getTitle());
            event.setDescription(updatedEvent.getDescription());
            event.setDate(updatedEvent.getDate());
            event.setTime(updatedEvent.getTime());
            event.setLocation(updatedEvent.getLocation());
            event.setBasePrice(updatedEvent.getBasePrice());
            event.setFrontSurcharge(updatedEvent.getFrontSurcharge());
            event.setMiddleSurcharge(updatedEvent.getMiddleSurcharge());
            event.setFree(updatedEvent.isFree());
            event.setCategory(updatedEvent.getCategory());
            event.setBookingOpen(updatedEvent.isBookingOpen());
            return eventRepository.save(event);
        }).orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }

    public void deleteEvent(String id) {
        eventRepository.deleteById(id);
    }
}
