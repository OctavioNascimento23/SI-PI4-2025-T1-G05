package com.consultoria.app.dto;

import com.consultoria.app.model.Project;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private String status;
    private String priority;
    private Integer progress;
    private Long userId;
    private String userName;
    private Long consultantId;
    private String consultantName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProjectResponse fromProject(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getStatus().name(),
                project.getPriority().name(),
                project.getProgress(),
                project.getUser().getId(),
                project.getUser().getName(),
                project.getConsultant() != null ? project.getConsultant().getId() : null,
                project.getConsultant() != null ? project.getConsultant().getName() : null,
                project.getCreatedAt(),
                project.getUpdatedAt());
    }
}
