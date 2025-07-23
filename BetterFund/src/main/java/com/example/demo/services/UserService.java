package com.example.demo.services;

import com.example.demo.entities.Role;
import com.example.demo.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.demo.repositories.RoleRepository;
import com.example.demo.repositories.UserRepository;

import java.util.Optional;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder encoder;

    public boolean register(String name, String email, String rawPassword, String adharNo, String phoneNo) {
        // Check if user already exists
        if (userRepository.findByEmail(email).isPresent()) return false;
        if (userRepository.findByAdharNo(adharNo).isPresent()) return false;
        if (userRepository.findByPhoneNo(phoneNo).isPresent()) return false;

        User user = new User();
        user.setUsername(name);
        user.setEmail(email);
        user.setPassword(encoder.encode(rawPassword));
        user.setAdharNo(adharNo);
        user.setPhoneNo(phoneNo);

        // Based on your database: role_id 2 = "Campaign Creator", role_id 3 = "Donor"
        // Let's default new users to "Donor" role (role_id = 3)
        Role userRole = roleRepository.findById(3).orElseThrow(() -> 
            new RuntimeException("Default user role not found"));
        user.setRole(userRole);

        userRepository.save(user);
        return true;
    }

    // Overloaded method for backward compatibility
    public boolean register(String name, String email, String rawPassword) {
        // Generate dummy values for required fields - NOT RECOMMENDED for production
        String dummyAdhar = generateDummyAdhar();
        String dummyPhone = generateDummyPhone();
        return register(name, email, rawPassword, dummyAdhar, dummyPhone);
    }

    public boolean login(String email, String rawPassword) {
        return userRepository.findByEmail(email)
            .map(u -> encoder.matches(rawPassword, u.getPassword()))
            .orElse(false);
    }

    public boolean changeRole(String targetEmail, Integer newRoleId) {
        User user = userRepository.findByEmail(targetEmail).orElse(null);
        if (user == null) return false;

        Role newRole = roleRepository.findById(newRoleId).orElse(null);
        if (newRole == null) return false;

        user.setRole(newRole);
        userRepository.save(user);
        return true;
    }

    // Helper methods to generate dummy data - NOT RECOMMENDED for production
    private String generateDummyAdhar() {
        return String.valueOf(System.currentTimeMillis()).substring(0, 12);
    }

    private String generateDummyPhone() {
        return String.valueOf(System.currentTimeMillis() % 10000000000L);
    }
}