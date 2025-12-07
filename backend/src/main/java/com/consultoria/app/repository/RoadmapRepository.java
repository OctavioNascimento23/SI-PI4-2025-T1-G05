// Criado por Octavio Nascimento
package com.consultoria.app.repository;

import com.consultoria.app.model.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {
    List<Roadmap> findByProjectId(Long projectId);
    List<Roadmap> findByCreatedById(Long userId);
    Optional<Roadmap> findByIdAndProjectId(Long id, Long projectId);
}
