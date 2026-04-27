package com.example.womenCommunityHall.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "EmergencyContacts")
public class EmergencyContact {

    @Id
    private String id;

    private String userId;       // Reference to UserModel._id

    private String name;

    private String phone;

    private String relationship; // e.g. "Mother", "Sister", "Friend"
}
