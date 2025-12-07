// Criado por Ítalo de Souza
package com.consultoria.app.controller;

import com.consultoria.app.dto.RoadmapDTO;
import com.consultoria.app.model.Roadmap;
import com.consultoria.app.service.RoadmapService;
import com.consultoria.app.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/roadmap")
@CrossOrigin(origins = "*")
public class RoadmapController {

    @Autowired
    private RoadmapService roadmapService;

    @Autowired
    private ChatService chatService;

    /**
     * Cria um novo roadmap
     */
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createRoadmap(
            @RequestBody RoadmapDTO roadmapDTO,
            @RequestParam Long projectId,
            @RequestParam Long userId) {
        try {
            Roadmap roadmap = roadmapService.createRoadmap(projectId, userId, roadmapDTO);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Roadmap criado com sucesso!");
            response.put("roadmapId", roadmap.getId());
            response.put("title", roadmap.getTitle());
            response.put("createdAt", roadmap.getCreatedAt());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erro ao criar roadmap: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Gera e retorna PDF do roadmap
     */
    @PostMapping("/generate")
    public ResponseEntity<byte[]> generateRoadmap(@RequestBody RoadmapDTO roadmap) {
        try {
            byte[] pdfBytes = roadmapService.generateRoadmapPdf(roadmap);

            String filename = "roadmap_" + System.currentTimeMillis() + ".pdf";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Envia roadmap para cliente via chat
     */
    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendRoadmapToClient(
            @RequestParam Long roadmapId,
            @RequestParam Long userId) {
        try {
            Roadmap roadmap = roadmapService.getRoadmapById(roadmapId);

            // Criar URL de download
            String downloadUrl = "http://localhost:8080/api/roadmap/download/" + roadmapId;

            // Criar mensagem no chat com link de download
            String message = "📋 Roadmap Personalizado: " + roadmap.getTitle() + 
                           "\n\n✅ O consultor criou um roadmap personalizado para você!" +
                           "\n\n📥 Baixe aqui: " + downloadUrl;

            chatService.sendMessage(roadmap.getProject().getId(), userId, message);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Roadmap enviado com sucesso!");
            response.put("roadmapId", roadmapId);
            response.put("downloadUrl", downloadUrl);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erro ao enviar roadmap: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Obtém roadmap por ID
     */
    @GetMapping("/{roadmapId}")
    public ResponseEntity<Map<String, Object>> getRoadmap(@PathVariable Long roadmapId) {
        try {
            Roadmap roadmap = roadmapService.getRoadmapById(roadmapId);

            Map<String, Object> response = new HashMap<>();
            response.put("id", roadmap.getId());
            response.put("title", roadmap.getTitle());
            response.put("description", roadmap.getDescription());
            response.put("projectId", roadmap.getProject().getId());
            response.put("createdBy", roadmap.getCreatedBy().getName());
            response.put("createdAt", roadmap.getCreatedAt());
            response.put("updatedAt", roadmap.getUpdatedAt());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Lista roadmaps de um projeto
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Roadmap>> getRoadmapsByProject(@PathVariable Long projectId) {
        try {
            List<Roadmap> roadmaps = roadmapService.getRoadmapsByProject(projectId);
            return ResponseEntity.ok(roadmaps);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Lista roadmaps criados por um usuário
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Roadmap>> getRoadmapsByUser(@PathVariable Long userId) {
        try {
            List<Roadmap> roadmaps = roadmapService.getRoadmapsByUser(userId);
            return ResponseEntity.ok(roadmaps);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Baixa PDF do roadmap
     */
    @GetMapping("/download/{roadmapId}")
    public ResponseEntity<byte[]> downloadRoadmap(@PathVariable Long roadmapId) {
        try {
            byte[] pdfBytes = roadmapService.getRoadmapPdf(roadmapId);
            Roadmap roadmap = roadmapService.getRoadmapById(roadmapId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", roadmap.getPdfFilename());
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Atualiza um roadmap
     */
    @PutMapping("/{roadmapId}")
    public ResponseEntity<Map<String, Object>> updateRoadmap(
            @PathVariable Long roadmapId,
            @RequestBody RoadmapDTO roadmapDTO) {
        try {
            Roadmap updatedRoadmap = roadmapService.updateRoadmap(roadmapId, roadmapDTO);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Roadmap atualizado com sucesso!");
            response.put("roadmapId", updatedRoadmap.getId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erro ao atualizar roadmap: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Deleta um roadmap
     */
    @DeleteMapping("/{roadmapId}")
    public ResponseEntity<Map<String, Object>> deleteRoadmap(@PathVariable Long roadmapId) {
        try {
            roadmapService.deleteRoadmap(roadmapId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Roadmap deletado com sucesso!");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erro ao deletar roadmap: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
