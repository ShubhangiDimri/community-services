package com.example.notificaiton_service.controller;

import com.example.notificaiton_service.model.Notificaiton;
import com.example.notificaiton_service.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @PostMapping("/notify")
    public String notify(@RequestBody Notificaiton request){
        return notificationService.process(request);

    }
}
