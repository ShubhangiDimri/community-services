package com.example.womenCommunityHall.dto;

import com.example.womenCommunityHall.model.EmergencyContact;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private String id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private List<EmergencyContact> emergencyContacts;
}
