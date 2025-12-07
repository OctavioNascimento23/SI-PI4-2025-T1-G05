// Criado por Felipe Lona
package com.consultoria.app.model;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "consultant_id")
    private User consultant;

    @Enumerated(EnumType.STRING)
    private RequestStatus status; // PENDING, IN_PROGRESS, COMPLETED, CANCELLED

    private Integer progress; // 0-100

    @Column(length = 2000)
    private String assessmentData; // JSON or text with answers

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null)
            status = RequestStatus.PENDING;
        if (progress == null)
            progress = 0;
    }

    public enum RequestStatus {
        PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    }
}
