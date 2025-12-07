// Criado por Ítalo de Souza
package com.consultoria.app.model;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class ProjectFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "request_id")
    private Request request;

    @ManyToOne
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;

    private String fileName;
    private String filePath;
    private Long fileSize; // Tamanho em bytes
    private LocalDateTime uploadDate;
}
