// Criado por Felipe Lona
package com.consultoria.app.controller;

import com.consultoria.app.model.StatusHistory;
import com.consultoria.app.service.StatusHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class StatusHistoryController {
    @Autowired
    private StatusHistoryService statusHistoryService;

    @GetMapping("/{projectId}/history")
    public ResponseEntity<?> getProjectHistory(@PathVariable Long projectId) {
        try {
            List<StatusHistory> history = statusHistoryService.getHistoryByProjectId(projectId);
            return ResponseEntity.ok(history);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    static class ErrorResponse {
        private String error;

        public ErrorResponse(String error) {
            this.error = error;
        }

        public String getError() {
            return error;
        }
    }
}
