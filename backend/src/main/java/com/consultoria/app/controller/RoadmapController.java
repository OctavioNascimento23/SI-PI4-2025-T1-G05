package com.consultoria.app.controller;

import com.consultoria.app.dto.RoadmapDTO;
import com.consultoria.app.service.RoadmapService;
import com.consultoria.app.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/generate")
    public ResponseEntity<byte[]> generateRoadmap(@RequestBody RoadmapDTO roadmap) {
        try {
            byte[] pdfBytes = roadmapService.generateRoadmapPdf(roadmap);

            String filename = "roadmap_" + roadmap.getProjectId() + "_" + System.currentTimeMillis() + ".pdf";

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

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendRoadmapToClient(
            @RequestBody RoadmapDTO roadmap,
            @RequestParam Long userId) {
        try {
            // Salva o PDF no servidor
            String filename = roadmapService.saveRoadmapPdf(roadmap);

            // Cria URL de download
            String downloadUrl = "http://localhost:8080/api/roadmap/download/" + filename;

            // Criar mensagem no chat com link de download
            String message = "📋 Roadmap Personalizado: " + roadmap.getTitle() + 
                           "\n\n✅ O consultor criou um roadmap personalizado para você!" +
                           "\n\n📥 Baixe aqui: " + downloadUrl;

            chatService.sendMessage(roadmap.getProjectId(), userId, message);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Roadmap enviado com sucesso!");
            response.put("filename", filename);
            response.put("downloadUrl", downloadUrl);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erro ao enviar roadmap: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<byte[]> downloadRoadmap(@PathVariable String filename) {
        try {
            byte[] pdfBytes = roadmapService.getRoadmapPdf(filename);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
