// Criado por Felipe Lona
package com.consultoria.app.controller;

import com.consultoria.app.model.ChatMessage;
import com.consultoria.app.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatRestController {
    @Autowired
    private ChatService chatService;

    private Long getUserIdFromRequest(HttpServletRequest request) {
        return (Long) request.getAttribute("userId");
    }

    @PostMapping("/{projectId}/messages")
    public ResponseEntity<?> sendMessage(@PathVariable Long projectId,
            @Valid @RequestBody MessageDTO dto,
            HttpServletRequest request) {
        try {
            Long userId = getUserIdFromRequest(request);
            ChatMessage message = chatService.sendMessage(projectId, userId, dto.getContent());
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{projectId}/messages")
    public ResponseEntity<?> getMessages(@PathVariable Long projectId, HttpServletRequest request) {
        try {
            Long userId = getUserIdFromRequest(request);
            List<ChatMessage> messages = chatService.getMessagesByProjectId(projectId, userId);
            return ResponseEntity.ok(messages);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // DTOs
    static class MessageDTO {
        private String content;

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
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
