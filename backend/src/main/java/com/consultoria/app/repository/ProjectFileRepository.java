// Criado por Octavio Nascimento
package com.consultoria.app.repository;

import com.consultoria.app.model.ProjectFile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectFileRepository extends JpaRepository<ProjectFile, Long> {
    List<ProjectFile> findByRequestId(Long requestId);
}
