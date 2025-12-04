package com.consultoria.app.model;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "status_history")
@Data
public class StatusHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "changed_by_user_id", nullable = false)
    private User changedBy;

    @Enumerated(EnumType.STRING)
    private Project.ProjectStatus oldStatus;

    @Enumerated(EnumType.STRING)
    private Project.ProjectStatus newStatus;

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
