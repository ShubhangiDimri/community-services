package com.example.womenCommunityHall.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class EmergencyContactRequest {

    @NotBlank(message = "Contact name is required")
    private String name;

    @NotBlank(message = "Phone number is required")
    private String phone;

    private String relationship;
}
