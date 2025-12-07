// Criado por Felipe Lona

package com.consultoria.app.service;

import com.consultoria.app.dto.ProjectDTO;
import com.consultoria.app.model.Project;
import com.consultoria.app.model.User;
import com.consultoria.app.repository.ProjectRepository;
import com.consultoria.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
        /**
         * Permite que apenas o primeiro consultor que acessar associe-se ao projeto.
         * Se já houver consultor, só permite acesso ao consultor associado ou ao cliente dono.
         */
        @Transactional
        public Project claimOrGetProjectForConsultant(Long projectId, Long userId) {
            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

            // Se o usuário é o dono, pode acessar
            if (project.getUser().getId().equals(userId)) {
                return project;
            }

            // Se não tem consultor, associar este consultor
            if (project.getConsultant() == null) {
                User consultant = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("Consultor não encontrado"));
                project.setConsultant(consultant);
                project.setStatus(Project.ProjectStatus.IN_PROGRESS);
                return projectRepository.save(project);
            }

            // Se já tem consultor, só ele pode acessar
            if (project.getConsultant().getId().equals(userId)) {
                return project;
            }

            throw new RuntimeException("Projeto já está sendo atendido por outro consultor");
        }
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StatusHistoryService statusHistoryService;

    @Transactional
    public Project createProject(Long userId, ProjectDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Project project = new Project();
        project.setUser(user);
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());

        if (dto.getPriority() != null) {
            project.setPriority(Project.Priority.valueOf(dto.getPriority().toUpperCase()));
        }

        return projectRepository.save(project);
    }

    public List<Project> getProjectsByUserId(Long userId) {
        return projectRepository.findByUserId(userId);
    }

    public List<Project> getProjectsByConsultantId(Long consultantId) {
        return projectRepository.findByConsultantId(consultantId);
    }

    public List<Project> getPendingProjects() {
        return projectRepository.findByStatus(Project.ProjectStatus.PENDING);
    }

    public Optional<Project> getProjectById(Long projectId) {
        return projectRepository.findById(projectId);
    }

    @Transactional
    public Project updateProject(Long projectId, ProjectDTO dto, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        // Check if user is the owner
        if (!project.getUser().getId().equals(userId)) {
            throw new RuntimeException("Você não tem permissão para atualizar este projeto");
        }

        if (dto.getName() != null) {
            project.setName(dto.getName());
        }
        if (dto.getDescription() != null) {
            project.setDescription(dto.getDescription());
        }
        if (dto.getPriority() != null) {
            project.setPriority(Project.Priority.valueOf(dto.getPriority().toUpperCase()));
        }

        return projectRepository.save(project);
    }

    @Transactional
    public void deleteProject(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        // Check if user is the owner
        if (!project.getUser().getId().equals(userId)) {
            throw new RuntimeException("Você não tem permissão para deletar este projeto");
        }

        projectRepository.delete(project);
    }

    @Transactional
    public Project updateProjectStatus(Long projectId, Project.ProjectStatus newStatus, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        // Check if user is the owner or consultant
        boolean isOwner = project.getUser().getId().equals(userId);
        boolean isConsultant = project.getConsultant() != null && project.getConsultant().getId().equals(userId);

        if (!isOwner && !isConsultant) {
            throw new RuntimeException("Você não tem permissão para atualizar o status deste projeto");
        }

        Project.ProjectStatus oldStatus = project.getStatus();
        project.setStatus(newStatus);

        // Update progress based on status
        if (newStatus == Project.ProjectStatus.COMPLETED) {
            project.setProgress(100);
        } else if (newStatus == Project.ProjectStatus.IN_PROGRESS && project.getProgress() == 0) {
            project.setProgress(10);
        }

        Project savedProject = projectRepository.save(project);

        // Create status history
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            statusHistoryService.createStatusHistory(savedProject, user, oldStatus, newStatus);
        }

        return savedProject;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
}
