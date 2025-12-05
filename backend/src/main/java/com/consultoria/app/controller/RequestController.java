package com.consultoria.app.controller;

import com.consultoria.app.model.Request;
import com.consultoria.app.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class RequestController {
    @Autowired
    private RequestService requestService;

    @PostMapping
    public ResponseEntity<Request> create(@RequestBody Request request) {
        return ResponseEntity.ok(requestService.createRequest(request));
    }

    @GetMapping
    public ResponseEntity<List<Request>> listAll() {
        return ResponseEntity.ok(requestService.findAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Request>> listByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(requestService.findByUserId(userId));
    }
}
