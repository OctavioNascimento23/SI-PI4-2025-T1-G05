package com.consultoria.app.repository;

import com.consultoria.app.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    List<Experience> findByConsultantProfileId(Long consultantProfileId);
}
