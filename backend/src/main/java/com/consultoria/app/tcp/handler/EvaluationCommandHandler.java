package com.consultoria.app.tcp.handler;

import com.consultoria.app.model.Evaluation;
import com.consultoria.app.model.Request;
import com.consultoria.app.model.User;
import com.consultoria.app.repository.EvaluationRepository;
import com.consultoria.app.repository.RequestRepository;
import com.consultoria.app.tcp.Protocol;
import com.consultoria.app.tcp.SessionManager;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class EvaluationCommandHandler implements CommandHandler {

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Override
    public String getCommandType() {
        return "EVALUATION";
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
            case "SUBMIT":
                return handleSubmit(message, user);
            case "GET":
                return handleGet(message, user);
            case "LIST_CONSULTANT":
                return handleListConsultant(message, user);
            default:
                return Protocol.createError(message.getRequestId(), "Action inválida");
        }
    }

    private Protocol.Response handleSubmit(Protocol.Message message, User user) {
        JsonObject data = message.getData();

        if (!data.has("requestId") || !data.has("rating")) {
            return Protocol.createError(message.getRequestId(), "Dados insuficientes");
        }

        Long requestId = data.get("requestId").getAsLong();
        Integer rating = data.get("rating").getAsInt();

        if (rating < 1 || rating > 5) {
            return Protocol.createError(message.getRequestId(), "Rating deve ser entre 1 e 5");
        }

        Request request = requestRepository.findById(requestId).orElse(null);
        if (request == null) {
            return Protocol.createError(message.getRequestId(), "Projeto não encontrado");
        }

        // Apenas o usuário que fez a solicitação pode avaliar
        if (!request.getUser().getId().equals(user.getId())) {
            return Protocol.createError(message.getRequestId(), "Sem permissão");
        }

        // Projeto deve estar concluído
        if (request.getStatus() != Request.RequestStatus.COMPLETED) {
            return Protocol.createError(message.getRequestId(), "Projeto não está concluído");
        }

        // Verifica se já existe avaliação
        if (evaluationRepository.findByRequestId(requestId).isPresent()) {
            return Protocol.createError(message.getRequestId(), "Projeto já foi avaliado");
        }

        Evaluation evaluation = new Evaluation();
        evaluation.setRequest(request);
        evaluation.setUser(user);
        evaluation.setRating(rating);

        if (data.has("comment")) {
            evaluation.setComment(data.get("comment").getAsString());
        }

        evaluation.setEvaluationDate(LocalDateTime.now());

        evaluation = evaluationRepository.save(evaluation);

        JsonObject responseData = new JsonObject();
        responseData.addProperty("evaluationId", evaluation.getId());

        return Protocol.createSuccess(message.getRequestId(), "Avaliação enviada", responseData);
    }

    private Protocol.Response handleGet(Protocol.Message message, User user) {
        JsonObject data = message.getData();
        Long requestId = data.get("requestId").getAsLong();

        Evaluation evaluation = evaluationRepository.findByRequestId(requestId).orElse(null);

        if (evaluation == null) {
            JsonObject responseData = new JsonObject();
            responseData.addProperty("hasEvaluation", false);
            return Protocol.createSuccess(message.getRequestId(), "Sem avaliação", responseData);
        }

        JsonObject evalObj = new JsonObject();
        evalObj.addProperty("id", evaluation.getId());
        evalObj.addProperty("rating", evaluation.getRating());
        evalObj.addProperty("comment", evaluation.getComment());
        evalObj.addProperty("evaluationDate", evaluation.getEvaluationDate().toString());
        evalObj.addProperty("userName", evaluation.getUser().getName());

        JsonObject responseData = new JsonObject();
        responseData.addProperty("hasEvaluation", true);
        responseData.add("evaluation", evalObj);

        return Protocol.createSuccess(message.getRequestId(), "Avaliação obtida", responseData);
    }

    private Protocol.Response handleListConsultant(Protocol.Message message, User user) {
        JsonObject data = message.getData();
        Long consultantId = data.has("consultantId") ? data.get("consultantId").getAsLong() : user.getId();

        List<Evaluation> evaluations = evaluationRepository.findByRequestConsultantId(consultantId);

        JsonArray evalsArray = new JsonArray();
        double totalRating = 0;

        for (Evaluation eval : evaluations) {
            JsonObject evalObj = new JsonObject();
            evalObj.addProperty("id", eval.getId());
            evalObj.addProperty("rating", eval.getRating());
            evalObj.addProperty("comment", eval.getComment());
            evalObj.addProperty("date", eval.getEvaluationDate().toString());
            evalObj.addProperty("clientName", eval.getUser().getName());
            evalsArray.add(evalObj);
            totalRating += eval.getRating();
        }

        JsonObject responseData = new JsonObject();
        responseData.add("evaluations", evalsArray);
        responseData.addProperty("totalEvaluations", evaluations.size());
        responseData.addProperty("averageRating", evaluations.isEmpty() ? 0 : totalRating / evaluations.size());

        return Protocol.createSuccess(message.getRequestId(), "Lista obtida", responseData);
    }
}
