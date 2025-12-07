// Criado por Ítalo de Souza
package com.consultoria.app.tcp.handler;

import com.consultoria.app.model.ConsultantProfile;
import com.consultoria.app.model.Experience;
import com.consultoria.app.model.User;
import com.consultoria.app.repository.ConsultantProfileRepository;
import com.consultoria.app.repository.ExperienceRepository;
import com.consultoria.app.tcp.Protocol;
import com.consultoria.app.tcp.SessionManager;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class ExperienceCommandHandler implements CommandHandler {

    @Autowired
    private ExperienceRepository experienceRepository;

    @Autowired
    private ConsultantProfileRepository consultantProfileRepository;

    private final Gson gson = new Gson();

    @Override
    public String getCommandType() {
        return "EXPERIENCE";
    }

    @Override
    public Protocol.Response handle(Protocol.Message message, SessionManager sessionManager) {
        User user = sessionManager.validateSession(message.getSessionId());
        if (user == null) {
            return Protocol.createError(message.getRequestId(), "Sessão inválida");
        }

        if (user.getRole() != User.Role.CONSULTANT) {
            return Protocol.createError(message.getRequestId(), "Apenas consultores podem gerenciar experiências");
        }

        JsonObject data = message.getData();
        String action = data.get("action").getAsString();

        switch (action.toUpperCase()) {
            case "ADD":
                return handleAdd(message, user);
            case "UPDATE":
                return handleUpdate(message, user);
            case "DELETE":
                return handleDelete(message, user);
            case "LIST":
                return handleList(message, user);
            default:
                return Protocol.createError(message.getRequestId(), "Action inválida");
        }
    }

    private Protocol.Response handleAdd(Protocol.Message message, User user) {
        JsonObject data = message.getData();

        ConsultantProfile profile = consultantProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    ConsultantProfile p = new ConsultantProfile();
                    p.setUser(user);
                    return consultantProfileRepository.save(p);
                });

        Experience exp = new Experience();
        exp.setConsultantProfile(profile);
        exp.setTitle(data.get("title").getAsString());
        exp.setCompany(data.get("company").getAsString());

        if (data.has("description")) {
            exp.setDescription(data.get("description").getAsString());
        }

        if (data.has("startDate")) {
            exp.setStartDate(LocalDate.parse(data.get("startDate").getAsString()));
        }

        if (data.has("endDate") && !data.get("endDate").isJsonNull()) {
            exp.setEndDate(LocalDate.parse(data.get("endDate").getAsString()));
        }

        exp.setCurrent(data.has("current") && data.get("current").getAsBoolean());

        exp = experienceRepository.save(exp);

        JsonObject responseData = new JsonObject();
        responseData.addProperty("id", exp.getId());

        return Protocol.createSuccess(message.getRequestId(), "Experiência adicionada", responseData);
    }

    private Protocol.Response handleUpdate(Protocol.Message message, User user) {
        JsonObject data = message.getData();
        Long expId = data.get("id").getAsLong();

        Experience exp = experienceRepository.findById(expId).orElse(null);
        if (exp == null || !exp.getConsultantProfile().getUser().getId().equals(user.getId())) {
            return Protocol.createError(message.getRequestId(), "Experiência não encontrada");
        }

        if (data.has("title"))
            exp.setTitle(data.get("title").getAsString());
        if (data.has("company"))
            exp.setCompany(data.get("company").getAsString());
        if (data.has("description"))
            exp.setDescription(data.get("description").getAsString());
        if (data.has("startDate"))
            exp.setStartDate(LocalDate.parse(data.get("startDate").getAsString()));
        if (data.has("endDate") && !data.get("endDate").isJsonNull()) {
            exp.setEndDate(LocalDate.parse(data.get("endDate").getAsString()));
        }
        if (data.has("current"))
            exp.setCurrent(data.get("current").getAsBoolean());

        experienceRepository.save(exp);

        return Protocol.createSuccess(message.getRequestId(), "Experiência atualizada", new JsonObject());
    }

    private Protocol.Response handleDelete(Protocol.Message message, User user) {
        JsonObject data = message.getData();
        Long expId = data.get("id").getAsLong();

        Experience exp = experienceRepository.findById(expId).orElse(null);
        if (exp == null || !exp.getConsultantProfile().getUser().getId().equals(user.getId())) {
            return Protocol.createError(message.getRequestId(), "Experiência não encontrada");
        }

        experienceRepository.delete(exp);

        return Protocol.createSuccess(message.getRequestId(), "Experiência removida", new JsonObject());
    }

    private Protocol.Response handleList(Protocol.Message message, User user) {
        ConsultantProfile profile = consultantProfileRepository.findByUserId(user.getId()).orElse(null);

        if (profile == null) {
            return Protocol.createSuccess(message.getRequestId(), "Lista obtida", new JsonObject());
        }

        List<Experience> experiences = experienceRepository.findByConsultantProfileId(profile.getId());

        JsonArray expArray = new JsonArray();
        for (Experience exp : experiences) {
            JsonObject expObj = new JsonObject();
            expObj.addProperty("id", exp.getId());
            expObj.addProperty("title", exp.getTitle());
            expObj.addProperty("company", exp.getCompany());
            expObj.addProperty("description", exp.getDescription());
            expObj.addProperty("startDate", exp.getStartDate() != null ? exp.getStartDate().toString() : null);
            expObj.addProperty("endDate", exp.getEndDate() != null ? exp.getEndDate().toString() : null);
            expObj.addProperty("current", exp.getCurrent());
            expArray.add(expObj);
        }

        JsonObject responseData = new JsonObject();
        responseData.add("experiences", expArray);

        return Protocol.createSuccess(message.getRequestId(), "Lista obtida", responseData);
    }
}
