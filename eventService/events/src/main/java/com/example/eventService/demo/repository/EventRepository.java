package com.example.eventService.demo.repository;

import com.example.eventService.demo.entity.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    
    // Explicitly adding findById as requested, although it is provided by default
    Optional<Event> findById(String id);
}
