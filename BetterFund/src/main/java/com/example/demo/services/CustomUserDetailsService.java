package com.example.demo.services;

import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        // Your database has role names: "Admin", "Campaign Creator", "Donor"
        // Spring Security expects ROLE_ prefix, so we need to convert
        String roleName = user.getRole().getName();
        String springSecurityRole;
        
        switch (roleName) {
            case "Admin":
                springSecurityRole = "ADMIN";
                break;
            case "Campaign Creator":
                springSecurityRole = "CREATOR";
                break;
            case "Donor":
                springSecurityRole = "DONOR";
                break;
            default:
                springSecurityRole = "USER";
        }

        return org.springframework.security.core.userdetails.User.builder()
            .username(user.getEmail())
            .password(user.getPassword())
            .roles(springSecurityRole) // This will add "ROLE_" prefix automatically
            .build();
    }
}