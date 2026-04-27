package com.example.notificaiton_service.services;

import org.springframework.stereotype.Service;
import com.example.notificaiton_service.model.Notificaiton;

@Service
public class NotificationService {
    public String process(Notificaiton notification){
        //send email
        //send otp
        System.out.println("Name:"+notification.getName());
        System.out.println("msg:"+notification.getMessage());
        return "Notification sent!";
    }

}
