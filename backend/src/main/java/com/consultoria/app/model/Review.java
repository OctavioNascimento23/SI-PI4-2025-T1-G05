// Criado por Gabriel dos Santos
package com.consultoria.app.model;

import javax.persistence.*;
import lombok.Data;

@Entity
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "consultant_id")
    private User consultant;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private int rating; // 1-5
    private String comment;
}
