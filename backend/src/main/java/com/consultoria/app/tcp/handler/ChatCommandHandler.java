// Criado por Gabriel dos Santos
package com.consultoria.app.tcp.handler;

import com.consultoria.app.model.ChatMessage;
import com.consultoria.app.model.Project;
import com.consultoria.app.model.User;
import com.consultoria.app.repository.ChatMessageRepository;
import com.consultoria.app.repository.ProjectRepository;
import com.consultoria.app.repository.UserRepository;
import com.consultoria.app.tcp.Protocol;
import com.consultoria.app.tcp.SessionManager;
import com.google.gson.JsonObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Handler para processamento de mensagens de chat via TCP/IP
 */
@Component
public class ChatCommandHandler implements CommandHandler {
    private static final Logger log = LoggerFactory.getLogger(ChatCommandHandler.class);

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public String getCommandType() {
        return "CHAT";
    }

    @Override
    public Protocol.Response handle(Protocol.Message message, SessionManager sessionManager) {
        try {
            JsonObject data = message.getData();
            String action = data.has("action") ? data.get("action").getAsString() : "SEND";

            log.info("====== CHAT COMMAND ======");
            log.info("Action: {}", action);
            log.info("Session ID: {}", message.getSessionId());
            log.info("Project ID: {}", data.has("projectId") ? data.get("projectId").getAsLong() : "N/A");
            log.info("==========================");

            switch (action) {
                case "SEND":
                    return handleSendMessage(message, sessionManager);

                case "GET_MESSAGES":
                    return handleGetMessages(message, sessionManager);

                case "GET_PROJECTS_WITH_CHAT":
                    return handleGetProjectsWithChat(message, sessionManager);

                default:
                    log.warn("Ação desconhecida no CHAT: {}", action);
                    return Protocol.createError(message.getRequestId(), "Ação desconhecida: " + action);
            }

        } catch (Exception e) {
            log.error("Erro ao processar comando CHAT", e);
            return Protocol.createError(message.getRequestId(), "Erro ao processar chat: " + e.getMessage());
        }
    }

    /**
     * Processa envio de mensagem
     */
    private Protocol.Response handleSendMessage(Protocol.Message message, SessionManager sessionManager) {
        JsonObject data = message.getData();

        try {
            // Valida dados necessários
            if (!data.has("projectId") || !data.has("userId") || !data.has("content")) {
                return Protocol.createError(message.getRequestId(), "Dados incompletos: projectId, userId e content são obrigatórios");
            }

            Long projectId = data.get("projectId").getAsLong();
            Long userId = data.get("userId").getAsLong();
            String content = data.get("content").getAsString();

            log.info("[CHAT-SEND] Enviando mensagem - Projeto: {}, Usuário: {}, Conteúdo: {}...", 
                    projectId, userId, content.substring(0, Math.min(50, content.length())));

            // Obtém projeto
            Optional<Project> projectOpt = projectRepository.findById(projectId);
            if (!projectOpt.isPresent()) {
                log.warn("[CHAT-SEND] Projeto não encontrado: {}", projectId);
                return Protocol.createError(message.getRequestId(), "Projeto não encontrado");
            }

            Project project = projectOpt.get();

            // Obtém usuário
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                log.warn("[CHAT-SEND] Usuário não encontrado: {}", userId);
                return Protocol.createError(message.getRequestId(), "Usuário não encontrado");
            }

            User user = userOpt.get();

            // Verifica se o usuário tem acesso ao projeto
            boolean hasAccess = project.getUser().getId().equals(userId) ||
                    (project.getConsultant() != null && project.getConsultant().getId().equals(userId));

            if (!hasAccess) {
                log.warn("[CHAT-SEND] Acesso negado - Usuário {} não tem acesso ao Projeto {}", userId, projectId);
                return Protocol.createError(message.getRequestId(), "Você não tem acesso a este projeto");
            }

            // Cria e salva mensagem
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setProject(project);
            chatMessage.setSender(user);
            chatMessage.setContent(content);
            chatMessage.setTimestamp(LocalDateTime.now());

            ChatMessage savedMessage = chatMessageRepository.save(chatMessage);

            log.info("[CHAT-SEND] ✓ Mensagem salva com sucesso - ID: {}, Projeto: {}, Usuário: {}", 
                    savedMessage.getId(), projectId, user.getName());

            // Prepara resposta
            JsonObject responseData = new JsonObject();
            responseData.addProperty("messageId", savedMessage.getId());
            responseData.addProperty("projectId", projectId);
            responseData.addProperty("senderName", user.getName());
            responseData.addProperty("content", savedMessage.getContent());
            responseData.addProperty("timestamp", savedMessage.getTimestamp().toString());

            return Protocol.createSuccess(message.getRequestId(), "Mensagem enviada com sucesso", responseData);

        } catch (Exception e) {
            log.error("[CHAT-SEND] Erro ao enviar mensagem", e);
            return Protocol.createError(message.getRequestId(), "Erro ao enviar mensagem: " + e.getMessage());
        }
    }

    /**
     * Processa obtenção de mensagens de um projeto
     */
    private Protocol.Response handleGetMessages(Protocol.Message message, SessionManager sessionManager) {
        JsonObject data = message.getData();

        try {
            if (!data.has("projectId") || !data.has("userId")) {
                return Protocol.createError(message.getRequestId(), "projectId e userId são obrigatórios");
            }

            Long projectId = data.get("projectId").getAsLong();
            Long userId = data.get("userId").getAsLong();

            log.info("[CHAT-GET] Buscando mensagens - Projeto: {}, Usuário: {}", projectId, userId);

            // Obtém projeto
            Optional<Project> projectOpt = projectRepository.findById(projectId);
            if (!projectOpt.isPresent()) {
                log.warn("[CHAT-GET] Projeto não encontrado: {}", projectId);
                return Protocol.createError(message.getRequestId(), "Projeto não encontrado");
            }

            Project project = projectOpt.get();

            // Verifica acesso
            boolean hasAccess = project.getUser().getId().equals(userId) ||
                    (project.getConsultant() != null && project.getConsultant().getId().equals(userId));

            if (!hasAccess) {
                log.warn("[CHAT-GET] Acesso negado - Usuário {} não tem acesso ao Projeto {}", userId, projectId);
                return Protocol.createError(message.getRequestId(), "Você não tem acesso a este projeto");
            }

            // Busca mensagens
            List<ChatMessage> messages = chatMessageRepository.findByProjectIdOrderByTimestampAsc(projectId);

            log.info("[CHAT-GET] ✓ {} mensagens encontradas no Projeto {}", messages.size(), projectId);

            // Converte para JSON
            JsonObject responseData = new JsonObject();
            com.google.gson.JsonArray messagesArray = new com.google.gson.JsonArray();

            for (ChatMessage msg : messages) {
                JsonObject msgObj = new JsonObject();
                msgObj.addProperty("id", msg.getId());
                msgObj.addProperty("senderId", msg.getSender().getId());
                msgObj.addProperty("senderName", msg.getSender().getName());
                msgObj.addProperty("content", msg.getContent());
                msgObj.addProperty("timestamp", msg.getTimestamp().toString());
                messagesArray.add(msgObj);
            }

            responseData.add("messages", messagesArray);
            responseData.addProperty("totalMessages", messages.size());

            return Protocol.createSuccess(message.getRequestId(), "Mensagens recuperadas", responseData);

        } catch (Exception e) {
            log.error("[CHAT-GET] Erro ao obter mensagens", e);
            return Protocol.createError(message.getRequestId(), "Erro ao obter mensagens: " + e.getMessage());
        }
    }

    /**
     * Processa obtenção de projetos com chat ativo
     */
    private Protocol.Response handleGetProjectsWithChat(Protocol.Message message, SessionManager sessionManager) {
        JsonObject data = message.getData();

        try {
            if (!data.has("userId")) {
                return Protocol.createError(message.getRequestId(), "userId é obrigatório");
            }

            Long userId = data.get("userId").getAsLong();

            log.info("[CHAT-PROJECTS] Buscando projetos com chat para usuário: {}", userId);

            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                return Protocol.createError(message.getRequestId(), "Usuário não encontrado");
            }

            // Busca projetos onde o usuário é cliente ou consultor
            // e onde há um consultor designado (chat está ativo)
            List<Project> projects = projectRepository.findAll();
            com.google.gson.JsonArray projectsArray = new com.google.gson.JsonArray();

            for (Project project : projects) {
                boolean isParticipant = project.getUser().getId().equals(userId) ||
                        (project.getConsultant() != null && project.getConsultant().getId().equals(userId));

                if (isParticipant && project.getConsultant() != null) {
                    JsonObject projObj = new JsonObject();
                    projObj.addProperty("projectId", project.getId());
                    projObj.addProperty("projectName", project.getName());
                    projObj.addProperty("status", project.getStatus().toString());

                    if (project.getUser().getId().equals(userId)) {
                        projObj.addProperty("otherPartyName", project.getConsultant().getName());
                        projObj.addProperty("otherPartyId", project.getConsultant().getId());
                    } else {
                        projObj.addProperty("otherPartyName", project.getUser().getName());
                        projObj.addProperty("otherPartyId", project.getUser().getId());
                    }

                    projectsArray.add(projObj);
                }
            }

            JsonObject responseData = new JsonObject();
            responseData.add("projects", projectsArray);
            responseData.addProperty("totalProjects", projectsArray.size());

            log.info("[CHAT-PROJECTS] ✓ {} projetos encontrados para usuário {}", projectsArray.size(), userId);

            return Protocol.createSuccess(message.getRequestId(), "Projetos recuperados", responseData);

        } catch (Exception e) {
            log.error("[CHAT-PROJECTS] Erro ao obter projetos com chat", e);
            return Protocol.createError(message.getRequestId(), "Erro ao obter projetos: " + e.getMessage());
        }
    }
}
