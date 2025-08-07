package com.example.authservice.repositories;

import com.example.authservice.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmailAndPassword(String email, String password);
    Optional<User> findByEmail(String email);
    Optional<User> findByAdharNo(String adharNo);
    Optional<User> findByPhoneNo(String phoneNo);

    //existence checks used by registerAndGetUser ──
    boolean existsByEmail(String email);
    boolean existsByAdharNo(String adharNo);
    boolean existsByPhoneNo(String phoneNo);
}