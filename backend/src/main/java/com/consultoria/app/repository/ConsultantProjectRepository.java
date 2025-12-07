// Criado por Octavio Nascimento
package com.consultoria.app.repository;

import com.consultoria.app.model.ConsultantProject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConsultantProjectRepository extends JpaRepository<ConsultantProject, Long> {
    List<ConsultantProject> findByConsultantProfileId(Long consultantProfileId);
}
