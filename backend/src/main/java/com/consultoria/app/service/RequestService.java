package com.consultoria.app.service;

import com.consultoria.app.model.Request;
import com.consultoria.app.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RequestService {
    @Autowired
    private RequestRepository requestRepository;

    public Request createRequest(Request request) {
        return requestRepository.save(request);
    }

    public List<Request> findByUserId(Long userId) {
        return requestRepository.findByUserId(userId);
    }

    public List<Request> findAll() {
        return requestRepository.findAll();
    }

    public Request updateStatus(Long requestId, Request.RequestStatus status, Long consultantId) {
        Request req = requestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Not found"));
        req.setStatus(status);
        // Set consultant if accepting
        return requestRepository.save(req);
    }
}
