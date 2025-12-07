// Criado por João Pedro da Silveira
package com.consultoria.app.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ProjectDTO {
    @NotBlank(message = "Nome do projeto é obrigatório")
    private String name;

    private String description;

    private String priority; // LOW, MEDIUM, HIGH
}
