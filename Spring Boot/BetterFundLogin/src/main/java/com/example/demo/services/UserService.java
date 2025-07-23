package com.example.demo.services;


import com.example.demo.dto.*;
import com.example.demo.entities.Role;
import com.example.demo.entities.User;
import com.example.demo.repositories.RoleRepository;
import com.example.demo.repositories.UserRepository;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;

	public Optional<UserAuth> getUser(UserLogin entity) {

	    return userRepository.findByEmailAndPassword(entity.getEmail(), entity.getPassword())
	    	
	    		.map(user -> {
		    	UserAuth auth = new UserAuth();
		    	auth.setPresent(true);
		    	auth.setRoleId(user.getRole().getId());
		    	return auth;    	
	    });	    
	}
	
	public Optional<UserResponse> registerUser(UserRegister dto) {
	    if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
	        return Optional.empty(); // Email already exists
	    }

	    User user = new User();
	    user.setUsername(dto.getName());
	    user.setEmail(dto.getEmail());
	    user.setPassword(dto.getPassword()); // Don't forget to hash in real app

	    // Always assign role with ID = 2 (User)
	    Role role = roleRepository.findById(2L).orElse(null);

	    if (role == null) {
	        return Optional.of(new UserResponse(false, "Default role (User) not found"));
	    }

	    user.setRole(role);
	    userRepository.save(user);

	    return Optional.of(new UserResponse(true, "User registered successfully"));
	}
	
	public Optional<UserResponse> changeUserRole(RoleChangeRequest request) {
	    //Validate sender's role is 'Admin'
	    Optional<Role> senderRoleOpt = roleRepository.findById(request.getSenderRoleId());

	    if (senderRoleOpt.isEmpty() || !"Admin".equalsIgnoreCase(senderRoleOpt.get().getName())) {
	        return Optional.of(new UserResponse(false, "Access denied: Sender is not an Admin"));
	    }

	    //Validate new role exists
	    Optional<Role> newRoleOpt = roleRepository.findById(request.getNewRoleId());

	    if (newRoleOpt.isEmpty()) {
	        return Optional.of(new UserResponse(false, "Invalid new role ID: role not found"));
	    }

	    //Find target user by email
	    Optional<User> userOpt = userRepository.findByEmail(request.getTargetEmail());

	    if (userOpt.isEmpty()) {
	        return Optional.of(new UserResponse(false, "Target user not found"));
	    }

	    //Change role and save
	    User user = userOpt.get();
	    user.setRole(newRoleOpt.get());
	    userRepository.save(user);

	    return Optional.of(new UserResponse(true, "User role updated successfully"));
	}

       
}
