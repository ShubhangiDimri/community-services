package com.example.womenCommunityHall.controller;

import com.example.womenCommunityHall.dto.*;
import com.example.womenCommunityHall.model.EmergencyContact;
import com.example.womenCommunityHall.model.UserModel;
import com.example.womenCommunityHall.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    // ─────────────────────────── Registration ────────────────────────────────

    /**
     * POST /users/register
     * Public endpoint - no auth required
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        Map<String, Object> response = new HashMap<String, Object>();
        try {
            UserModel user = userService.register(request);
            response.put("message", "User registered successfully");
            response.put("userId", user.getId());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }

    // ─────────────────────────── Login ───────────────────────────────────────

    /**
     * POST /users/login
     * Public endpoint - returns JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse loginResponse = userService.login(request);
            return ResponseEntity.ok(loginResponse);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<String, Object>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    // ─────────────────────────── Get Profile ─────────────────────────────────

    /**
     * GET /users/{id}
     * Authenticated users can view their profile; ADMINs can view any profile
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id, Authentication auth) {
        try {
            UserProfileResponse profile = userService.getUserProfile(id);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<String, Object>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    // ─────────────────────────── Update Profile ──────────────────────────────

    /**
     * PUT /users/{id}
     * Authenticated users can update their own profile
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id,
                                         @RequestBody UpdateProfileRequest request,
                                         Authentication auth) {
        try {
            UserModel updated = userService.updateUser(id, request);
            updated.setPassword("[PROTECTED]");
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<String, Object>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    // ─────────────────────── Emergency Contacts ──────────────────────────────

    /**
     * POST /users/emergency-contact
     * Adds emergency contact for the currently authenticated user
     */
    @PostMapping("/emergency-contact")
    public ResponseEntity<?> addEmergencyContact(@Valid @RequestBody EmergencyContactRequest request,
                                                  Authentication auth) {
        try {
            String userEmail = auth.getName(); // email from JWT principal
            UserModel user = userService.getUserByEmail(userEmail);
            EmergencyContact contact = userService.addEmergencyContact(user.getId(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(contact);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<String, Object>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * GET /users/emergency-contact
     * Returns all emergency contacts for the authenticated user
     */
    @GetMapping("/emergency-contact")
    public ResponseEntity<?> getEmergencyContacts(Authentication auth) {
        try {
            String userEmail = auth.getName();
            UserModel user = userService.getUserByEmail(userEmail);
            List<EmergencyContact> contacts = userService.getEmergencyContacts(user.getId());
            return ResponseEntity.ok(contacts);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<String, Object>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    // ─────────────────────── SOS Alert ───────────────────────────────────────

    /**
     * POST /users/sos
     * Triggers SOS alert for the authenticated user — notifies all emergency contacts
     */
    @PostMapping("/sos")
    public ResponseEntity<?> triggerSOS(Authentication auth) {
        try {
            String userEmail = auth.getName();
            UserModel user = userService.getUserByEmail(userEmail);
            String result = userService.triggerSOS(user.getId());
            Map<String, Object> response = new HashMap<String, Object>();
            response.put("message", result);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<String, Object>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
