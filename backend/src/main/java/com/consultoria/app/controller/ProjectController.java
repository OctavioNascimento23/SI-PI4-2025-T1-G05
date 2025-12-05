package com.consultoria.app.controller;

import com.consultoria.app.dto.ProjectDTO;
import com.consultoria.app.dto.ProjectResponse;
import com.consultoria.app.dto.UpdateStatusDTO;
import com.consultoria.app.model.Project;
import com.consultoria.app.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    private Long getUserIdFromRequest(HttpServletRequest request) {
        return (Long) request.getAttribute("userId");
    }

    @PostMapping
    public ResponseEntity<?> createProject(@Valid @RequestBody ProjectDTO dto, HttpServletRequest request) {
        try {
            Long userId = getUserIdFromRequest(request);
            Project project = projectService.createProject(userId, dto);
            return ResponseEntity.ok(ProjectResponse.fromProject(project));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getMyProjects(HttpServletRequest request) {
        try {
            Long userId = getUserIdFromRequest(request);
            List<Project> projects = projectService.getProjectsByUserId(userId);
            List<ProjectResponse> response = projects.stream()
                    .map(ProjectResponse::fromProject)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingProjects() {
        try {
            List<Project> projects = projectService.getPendingProjects();
            List<ProjectResponse> response = projects.stream()
                    .map(ProjectResponse::fromProject)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/consultant")
    public ResponseEntity<?> getConsultantProjects(HttpServletRequest request) {
        try {
            Long userId = getUserIdFromRequest(request);
            List<Project> projects = projectService.getProjectsByConsultantId(userId);
            List<ProjectResponse> response = projects.stream()
                    .map(ProjectResponse::fromProject)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long userId = getUserIdFromRequest(request);
            Project project = projectService.claimOrGetProjectForConsultant(id, userId);
            return ResponseEntity.ok(ProjectResponse.fromProject(project));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id,
            @Valid @RequestBody ProjectDTO dto,
            HttpServletRequest request) {
        try {
            Long userId = getUserIdFromRequest(request);
            Project project = projectService.updateProject(id, dto, userId);
            return ResponseEntity.ok(ProjectResponse.fromProject(project));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long userId = getUserIdFromRequest(request);
            projectService.deleteProject(id, userId);
            return ResponseEntity.ok(new SuccessResponse("Projeto deletado com sucesso"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateProjectStatus(@PathVariable Long id,
            @Valid @RequestBody UpdateStatusDTO dto,
            HttpServletRequest request) {
        try {
            Long userId = getUserIdFromRequest(request);
            Project.ProjectStatus newStatus = Project.ProjectStatus.valueOf(dto.getStatus().toUpperCase());
            Project project = projectService.updateProjectStatus(id, newStatus, userId);
            return ResponseEntity.ok(ProjectResponse.fromProject(project));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // Response classes
    static class ErrorResponse {
        private String error;

        public ErrorResponse(String error) {
            this.error = error;
        }

        public String getError() {
            return error;
        }
    }

    static class SuccessResponse {
        private String message;

        public SuccessResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}
