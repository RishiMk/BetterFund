package com.example.demo.controllers;

import com.example.demo.entities.*;
import com.example.demo.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("/api")
public class CampaignController {

    @Autowired
    private CampaignRepository campaignRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CategoryRepository categoryRepo;

    @Autowired
    private WalletRepository walletRepo;

    @Autowired
    private DocumentsRepository docRepo;

    @Autowired
    private RoleRepository roleRepo; // ✅ Add this line

    @PostMapping("/campaigns")
    public ResponseEntity<?> createCampaign(
            @RequestParam Long userId,
            @RequestParam String title,
            @RequestParam Long categoryId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam Float targetAmt,
            @RequestParam MultipartFile documentFile
    ) throws IOException {

    	User user = userRepo.findById(userId.intValue())
    	        .orElseThrow(() -> new RuntimeException("User not found"));


        // ✅ Upgrade user's role to Campaign Creator (role_id = 2)
        Role campaignCreatorRole = roleRepo.findById(2)
                .orElseThrow(() -> new RuntimeException("Campaign Creator role not found"));
        user.setRole(campaignCreatorRole);
        userRepo.save(user);

        
        Category category = categoryRepo.findById(categoryId.intValue())
        	    .orElseThrow(() -> new RuntimeException("Category not found"));


        // ✅ Save document
        Documents doc = new Documents();
        doc.setDocuments(documentFile.getBytes());
        docRepo.save(doc);

        // ✅ Create wallet
        Wallet wallet = new Wallet();
        wallet.setUser(user);
        wallet.setAmount(0f);
        wallet.setCurBalance(0f);
        wallet.setCreationDate(LocalDate.now());
        walletRepo.save(wallet);

        // ✅ Create campaign
        Campaign campaign = new Campaign();
        campaign.setUser(user);
        campaign.setTitle(title);
        campaign.setCategory(category);
        campaign.setStartDate(startDate);
        campaign.setEndDate(endDate);
        campaign.setTargetAmt(targetAmt);
        campaign.setWallet(wallet);
        campaign.setDocument(doc);
        campaignRepo.save(campaign);

        return ResponseEntity.ok("Request for campaign creation successful!");
    }
}
