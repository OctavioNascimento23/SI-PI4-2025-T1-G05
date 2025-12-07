// Criado por Gabriel dos Santos
package com.consultoria.app.model;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Evaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "request_id")
    private Request request;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Integer rating; // 1-5 estrelas

    @Column(columnDefinition = "TEXT")
    private String comment;

    private LocalDateTime evaluationDate;
}
