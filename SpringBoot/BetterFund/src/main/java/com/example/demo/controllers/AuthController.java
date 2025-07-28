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

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email    = body.get("email");
        String password = body.get("password");
        String adharNo  = body.get("adharNo");
        String phoneNo  = body.get("phoneNo");

        
        if (username == null || email == null || password == null ||
            adharNo == null  || phoneNo == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "All fields are required"));
        }
        if (!adharNo.matches("\\d{12}")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Adhar must be 12 digits"));
        }
        if (!phoneNo.matches("\\d{10}")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Phone must be 10 digits"));
        }

        User user = userService.registerAndGetUser(username, email, password, adharNo, phoneNo);
        if (user == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false,
                                 "message", "Registration failed – email/adhar/phone already exists"));
        }


        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User registered successfully",
                "user", Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "username", user.getUsername(),
                        "role", user.getRole().getName(),
                        "isAdmin", user.getRole().getName().equalsIgnoreCase("ADMIN")
                )
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        User user = userService.loginAndGetUser(email, password);
        if (user != null) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Logged in successfully",
                    "user", Map.of(
                            "id", user.getId(),
                            "email", user.getEmail(),
                            "username", user.getUsername(),
                            "role", user.getRole().getName(),
                            "isAdmin", user.getRole().getName().equalsIgnoreCase("ADMIN")
                    )
            ));
        } else {
            return ResponseEntity.status(401)
                    .body(Map.of("success", false, "message", "Invalid credentials"));
        }
    }

    @PostMapping("/admin/changerole")
    public ResponseEntity<?> changeRole(@RequestParam String targetEmail,
                                        @RequestParam Integer newRoleId) {
        boolean ok = userService.changeRole(targetEmail, newRoleId);
        return ok
                ? ResponseEntity.ok(Map.of("success", true, "message", "Role updated successfully"))
                : ResponseEntity.badRequest()
                      .body(Map.of("success", false, "message", "Role update failed"));
    }
}