package com.consultoria.app.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class UpdateStatusDTO {
    @NotBlank(message = "Status é obrigatório")
    private String status; // PENDING, IN_PROGRESS, COMPLETED, CANCELLED
}
