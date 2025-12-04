package com.consultoria.app.model;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
@Data
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Owner of the project

    @ManyToOne
    @JoinColumn(name = "consultant_id")
    private User consultant;

    private String name;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status; // PENDING, IN_PROGRESS, COMPLETED, CANCELLED

    @Enumerated(EnumType.STRING)
    private Priority priority; // LOW, MEDIUM, HIGH

    private Integer progress; // 0-100

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null)
            status = ProjectStatus.PENDING;
        if (progress == null)
            progress = 0;
        if (priority == null)
            priority = Priority.MEDIUM;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ProjectStatus {
        PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    }

    public enum Priority {
        LOW, MEDIUM, HIGH
    }
}
