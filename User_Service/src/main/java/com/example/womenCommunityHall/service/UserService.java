package com.example.womenCommunityHall.service;

import com.example.womenCommunityHall.dto.*;
import com.example.womenCommunityHall.model.EmergencyContact;
import com.example.womenCommunityHall.model.UserModel;
import com.example.womenCommunityHall.repository.EmergencyContactRepository;
import com.example.womenCommunityHall.repository.UserRepository;
import com.example.womenCommunityHall.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmergencyContactRepository emergencyContactRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ─────────────────────────── Registration ────────────────────────────────

    public UserModel register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        UserModel user = new UserModel();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // BCrypt hash

        // Set role: default USER, accept ADMIN only if explicitly provided
        String role = (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN"))
                ? "ADMIN" : "USER";
        user.setRole(role);

        return userRepository.save(user);
    }

    // ─────────────────────────── Login ───────────────────────────────────────

    public LoginResponse login(LoginRequest request) {
        UserModel user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new LoginResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    // ─────────────────────────── Get Profile ─────────────────────────────────

    public UserModel getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public UserModel getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    // Returns full profile with emergency contacts included
    public UserProfileResponse getUserProfile(String id) {
        UserModel user = getUserById(id);
        List<EmergencyContact> contacts = emergencyContactRepository.findByUserId(id);

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                contacts
        );
    }

    // ─────────────────────────── Update Profile ──────────────────────────────

    public UserModel updateUser(String id, UpdateProfileRequest request) {
        UserModel user = getUserById(id);

        // Java 8 compatible null/empty checks
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            user.setPhone(request.getPhone());
        }

        return userRepository.save(user);
    }

    // ─────────────────────── Emergency Contacts ──────────────────────────────

    public EmergencyContact addEmergencyContact(String userId, EmergencyContactRequest request) {
        // Verify user exists
        getUserById(userId);

        EmergencyContact contact = new EmergencyContact();
        contact.setUserId(userId);
        contact.setName(request.getName());
        contact.setPhone(request.getPhone());
        contact.setRelationship(request.getRelationship());

        return emergencyContactRepository.save(contact);
    }

    public List<EmergencyContact> getEmergencyContacts(String userId) {
        // Verify user exists
        getUserById(userId);
        return emergencyContactRepository.findByUserId(userId);
    }

    // ─────────────────────── SOS Alert ───────────────────────────────────────

    public String triggerSOS(String userId) {
        UserModel user = getUserById(userId);
        List<EmergencyContact> contacts = emergencyContactRepository.findByUserId(userId);

        if (contacts.isEmpty()) {
            return "SOS triggered for " + user.getName() + ", but no emergency contacts found. " +
                   "Please add emergency contacts.";
        }

        // TODO: Integrate with Notification Service (SMS / Email / Push)
        StringBuilder sb = new StringBuilder();
        sb.append("SOS Alert triggered for: ").append(user.getName()).append("\n");
        sb.append("Notifying emergency contacts:\n");
        for (EmergencyContact contact : contacts) {
            sb.append("  -> ").append(contact.getName())
              .append(" (").append(contact.getRelationship()).append(")")
              .append(" - ").append(contact.getPhone()).append("\n");
        }
        sb.append("Notification service will notify them shortly.");

        System.out.println(sb.toString()); // Replace with actual notification call
        return sb.toString();
    }
}
