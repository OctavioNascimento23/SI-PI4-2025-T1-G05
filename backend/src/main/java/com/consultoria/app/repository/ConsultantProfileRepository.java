// Criado por Octavio Nascimento
package com.consultoria.app.repository;

import com.consultoria.app.model.ConsultantProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ConsultantProfileRepository extends JpaRepository<ConsultantProfile, Long> {
    Optional<ConsultantProfile> findByUserId(Long userId);
}
