package com.example.notificaiton_service.model;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class Notificaiton {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Recipient email is required")
    @Email(message = "Recipient email must be valid")
    private String recipientEmail;

    @NotBlank(message = "Message is required")
    private String message;

    public Notificaiton() {
    }

    public Notificaiton(String name, String message) {
        this.name = name;
        this.message = message;
    }

    public Notificaiton(String name, String recipientEmail, String message) {
        this.name = name;
        this.recipientEmail = recipientEmail;
        this.message = message;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
