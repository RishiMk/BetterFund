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
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/campaigns")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
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
    
    @GetMapping("/active")
    public List<Map<String, Object>> getAllActiveCampaigns() {
        List<Campaign> campaigns = campaignRepo.findByStatus("active");

        return campaigns.stream().map(campaign -> {
            Map<String, Object> response = new HashMap<>();

            response.put("campaignId", campaign.getCampaignId());
            response.put("title", campaign.getTitle());
            response.put("startDate", campaign.getStartDate());
            response.put("endDate", campaign.getEndDate());
            response.put("targetAmt", campaign.getTargetAmt());
            response.put("status", campaign.getStatus());

            // Minimal User Info
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("username", campaign.getUser().getUsername());
            response.put("user", userMap);

            // Minimal Category Info
            Map<String, Object> categoryMap = new HashMap<>();
            categoryMap.put("categoryId", campaign.getCategory().getCategoryId());
            categoryMap.put("cname", campaign.getCategory().getCname());
            response.put("category", categoryMap);
            
            Map<String, Object> walletMap = new HashMap<>();
            walletMap.put("amount", campaign.getWallet().getAmount());
            response.put("wallet", walletMap);

            return response;
        }).collect(Collectors.toList());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCampaignById(@PathVariable Integer id) {
        Optional<Campaign> optionalCampaign = campaignRepo.findById(id);

        if (optionalCampaign.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Campaign campaign = optionalCampaign.get();
        Map<String, Object> response = new HashMap<>();

        response.put("campaignId", campaign.getCampaignId());
        response.put("title", campaign.getTitle());
        response.put("startDate", campaign.getStartDate());
        response.put("endDate", campaign.getEndDate());
        response.put("targetAmt", campaign.getTargetAmt());
        response.put("status", campaign.getStatus());

        // Minimal User Info
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("username", campaign.getUser().getUsername());
        response.put("user", userMap);

        // Minimal Category Info
        Map<String, Object> categoryMap = new HashMap<>();
        categoryMap.put("categoryId", campaign.getCategory().getCategoryId());
        categoryMap.put("cname", campaign.getCategory().getCname());
        response.put("category", categoryMap);

        // Wallet Info
        Map<String, Object> walletMap = new HashMap<>();
        walletMap.put("amount", campaign.getWallet().getAmount());
        response.put("wallet", walletMap);

        return ResponseEntity.ok(response);
    }


    @PostMapping("/create")
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
