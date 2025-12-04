package com.consultoria.app.repository;

import com.consultoria.app.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByUserId(Long userId);

    List<Project> findByConsultantId(Long consultantId);

    List<Project> findByStatus(Project.ProjectStatus status);
}
