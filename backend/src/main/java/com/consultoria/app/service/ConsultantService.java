package com.consultoria.app.service;

import com.consultoria.app.model.ConsultantProfile;
import com.consultoria.app.repository.ConsultantProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ConsultantService {
    @Autowired
    private ConsultantProfileRepository profileRepository;

    public ConsultantProfile updateProfile(ConsultantProfile profile) {
        return profileRepository.save(profile);
    }

    public ConsultantProfile getProfile(Long userId) {
        return profileRepository.findByUserId(userId).orElse(null);
    }
}
