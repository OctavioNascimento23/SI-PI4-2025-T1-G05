// Criado por João Pedro da Silveira
package com.consultoria.app.tcp.handler;

import com.consultoria.app.model.Request;
import com.consultoria.app.model.User;
import com.consultoria.app.repository.RequestRepository;
import com.consultoria.app.tcp.Protocol;
import com.consultoria.app.tcp.SessionManager;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RequestCommandHandler implements CommandHandler {

    @Autowired
    private RequestRepository requestRepository;

    @Override
    public String getCommandType() {
        return "REQUEST";
    }

    @Override
    public Protocol.Response handle(Protocol.Message message, SessionManager sessionManager) {
        User user = sessionManager.validateSession(message.getSessionId());
        if (user == null) {
            return Protocol.createError(message.getRequestId(), "Sessão inválida");
        }

        JsonObject data = message.getData();
        String action = data.get("action").getAsString();

        switch (action.toUpperCase()) {
            case "UPDATE_STATUS":
                return handleUpdateStatus(message, user);
            case "UPDATE_PROGRESS":
                return handleUpdateProgress(message, user);
            case "LIST":
                return handleList(message, user);
            default:
                return Protocol.createError(message.getRequestId(), "Action inválida");
        }
    }

    private Protocol.Response handleUpdateStatus(Protocol.Message message, User user) {
        JsonObject data = message.getData();
        Long requestId = data.get("id").getAsLong();
        String statusStr = data.get("status").getAsString();

        Request request = requestRepository.findById(requestId).orElse(null);
        if (request == null) {
            return Protocol.createError(message.getRequestId(), "Projeto não encontrado");
        }

        // Apenas consultor pode atualizar status
        if (user.getRole() != User.Role.CONSULTANT ||
                request.getConsultant() == null ||
                !request.getConsultant().getId().equals(user.getId())) {
            return Protocol.createError(message.getRequestId(), "Sem permissão");
        }

        try {
            Request.RequestStatus status = Request.RequestStatus.valueOf(statusStr.toUpperCase());
            request.setStatus(status);
            requestRepository.save(request);

            return Protocol.createSuccess(message.getRequestId(), "Status atualizado", new JsonObject());
        } catch (IllegalArgumentException e) {
            return Protocol.createError(message.getRequestId(), "Status inválido");
        }
    }

    private Protocol.Response handleUpdateProgress(Protocol.Message message, User user) {
        JsonObject data = message.getData();
        Long requestId = data.get("id").getAsLong();
        Integer progress = data.get("progress").getAsInt();

        if (progress < 0 || progress > 100) {
            return Protocol.createError(message.getRequestId(), "Progresso deve estar entre 0 e 100");
        }

        Request request = requestRepository.findById(requestId).orElse(null);
        if (request == null) {
            return Protocol.createError(message.getRequestId(), "Projeto não encontrado");
        }

        // Apenas consultor pode atualizar progresso
        if (user.getRole() != User.Role.CONSULTANT ||
                request.getConsultant() == null ||
                !request.getConsultant().getId().equals(user.getId())) {
            return Protocol.createError(message.getRequestId(), "Sem permissão");
        }

        request.setProgress(progress);
        requestRepository.save(request);

        JsonObject responseData = new JsonObject();
        responseData.addProperty("progress", progress);

        return Protocol.createSuccess(message.getRequestId(), "Progresso atualizado", responseData);
    }

    private Protocol.Response handleList(Protocol.Message message, User user) {
        List<Request> requests;

        if (user.getRole() == User.Role.USER) {
            requests = requestRepository.findByUserId(user.getId());
        } else {
            requests = requestRepository.findByConsultantId(user.getId());
        }

        JsonArray requestsArray = new JsonArray();
        for (Request req : requests) {
            JsonObject reqObj = new JsonObject();
            reqObj.addProperty("id", req.getId());
            reqObj.addProperty("status", req.getStatus().toString());
            reqObj.addProperty("progress", req.getProgress());
            reqObj.addProperty("createdAt", req.getCreatedAt().toString());

            if (user.getRole() == User.Role.USER && req.getConsultant() != null) {
                reqObj.addProperty("consultantName", req.getConsultant().getName());
            } else if (user.getRole() == User.Role.CONSULTANT) {
                reqObj.addProperty("clientName", req.getUser().getName());
            }

            requestsArray.add(reqObj);
        }

        JsonObject responseData = new JsonObject();
        responseData.add("requests", requestsArray);

        return Protocol.createSuccess(message.getRequestId(), "Lista obtida", responseData);
    }
}
