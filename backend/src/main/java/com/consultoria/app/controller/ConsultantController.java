package com.consultoria.app.controller;

import com.consultoria.app.model.ConsultantProfile;
import com.consultoria.app.service.ConsultantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/consultants")
@CrossOrigin(origins = "*")
public class ConsultantController {
    @Autowired
    private ConsultantService consultantService;

    @GetMapping("/{userId}")
    public ResponseEntity<ConsultantProfile> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(consultantService.getProfile(userId));
    }

    @PostMapping("/profile")
    public ResponseEntity<ConsultantProfile> updateProfile(@RequestBody ConsultantProfile profile) {
        return ResponseEntity.ok(consultantService.updateProfile(profile));
    }
}
