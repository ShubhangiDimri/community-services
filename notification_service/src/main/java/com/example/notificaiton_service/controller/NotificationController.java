package com.example.notificaiton_service.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.notificaiton_service.model.Notificaiton;
import com.example.notificaiton_service.services.NotificationService;

@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
@RestController
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/notify")
    public ResponseEntity<String> notify(@Valid @RequestBody Notificaiton request) {
        return ResponseEntity.ok(notificationService.process(request));
    }
    
    @GetMapping("/check")
    public ResponseEntity<String> check() {
        return ResponseEntity.ok("Notification Service is UP");
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notificaiton>> getNotifications() {
        return ResponseEntity.ok(notificationService.getSentNotifications());
    }
}
