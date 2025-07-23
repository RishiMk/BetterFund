package com.example.demo.controllers;

import com.example.demo.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.services.UserService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    @Autowired private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registrationData) {
        String username = registrationData.get("username");
        String email = registrationData.get("email");
        String password = registrationData.get("password");
        String adharNo = registrationData.get("adharNo");
        String phoneNo = registrationData.get("phoneNo");

        // Validate required fields
        if (username == null || email == null || password == null || 
            adharNo == null || phoneNo == null) {
            return ResponseEntity.badRequest().body("All fields are required");
        }

        // Validate adhar number (12 digits)
        if (adharNo.length() != 12 || !adharNo.matches("\\d+")) {
            return ResponseEntity.badRequest().body("Adhar number must be 12 digits");
        }

        // Validate phone number (10 digits)
        if (phoneNo.length() != 10 || !phoneNo.matches("\\d+")) {
            return ResponseEntity.badRequest().body("Phone number must be 10 digits");
        }

        boolean ok = userService.register(username, email, password, adharNo, phoneNo);
        return ok ? ResponseEntity.ok("User registered successfully")
            : ResponseEntity.badRequest().body("Registration failed - email, adhar, or phone already exists");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        boolean ok = userService.login(email, password);
        return ok ? ResponseEntity.ok("Logged in successfully")
            : ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/admin/changerole")
    public ResponseEntity<?> changeRole(@RequestParam String targetEmail,
                                      @RequestParam Integer newRoleId) {
        boolean ok = userService.changeRole(targetEmail, newRoleId);
        return ok ? ResponseEntity.ok("Role updated successfully")
            : ResponseEntity.badRequest().body("Role update failed");
    }
}