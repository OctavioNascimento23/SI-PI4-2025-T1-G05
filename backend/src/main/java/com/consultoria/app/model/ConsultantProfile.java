package com.consultoria.app.model;

import javax.persistence.*;
import lombok.Data;

@Entity
@Data
public class ConsultantProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String bio;
    private String experience; // Text description
    private String projects; // Text description
    private String photoUrl;
}
