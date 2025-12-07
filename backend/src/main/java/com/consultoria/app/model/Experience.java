// Criado por Octavio Nascimento
package com.consultoria.app.model;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "consultant_profile_id")
    private ConsultantProfile consultantProfile;

    private String title;
    private String company;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean current; // true se é trabalho atual
}
