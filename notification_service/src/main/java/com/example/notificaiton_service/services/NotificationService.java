package com.example.notificaiton_service.services;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.notificaiton_service.model.Notificaiton;

@Service
public class NotificationService {

    private final JavaMailSender mailSender;
    private final List<Notificaiton> sentNotifications = new CopyOnWriteArrayList<>();

    @Value("${spring.mail.username:}")
    private String fromAddress;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public String process(Notificaiton notification) {
        sentNotifications.add(notification);
        sendEmail(notification);
        System.out.println("Processing notification for: " + notification.getName());
        System.out.println("Recipient email: " + notification.getRecipientEmail());
        System.out.println("Message: " + notification.getMessage());
        return "Notification sent successfully!";
    }

    private void sendEmail(Notificaiton notification) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        if (fromAddress != null && !fromAddress.isBlank()) {
            mailMessage.setFrom(fromAddress);
        }
        mailMessage.setTo(notification.getRecipientEmail());
        mailMessage.setSubject("Notification from Community Hall");
        mailMessage.setText(String.format("Hello %s,%n%n%s%n", notification.getName(), notification.getMessage()));
        mailSender.send(mailMessage);
    }

    public List<Notificaiton> getSentNotifications() {
        return new ArrayList<>(sentNotifications);
    }
}
