package com.consultoria.app.model;

import javax.persistence.*;
import lombok.Data;

@Entity
@Data
public class ConsultantProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "consultant_profile_id")
    private ConsultantProfile consultantProfile;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String link; // URL do projeto/case
    private String imageUrl; // Imagem do projeto
}
