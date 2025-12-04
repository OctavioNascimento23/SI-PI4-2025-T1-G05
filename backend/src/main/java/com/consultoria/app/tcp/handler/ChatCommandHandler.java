package com.consultoria.app.tcp.handler;

import com.consultoria.app.model.ChatMessage;
import com.consultoria.app.model.Project;
import com.consultoria.app.model.User;
import com.consultoria.app.repository.ProjectRepository;
import com.consultoria.app.service.ChatService;
import com.consultoria.app.tcp.Protocol;
import com.consultoria.app.tcp.SessionManager;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Handler para comandos de chat (GET_CHAT_MESSAGES, SEND_CHAT_MESSAGE)
 * Processa mensagens de chat via TCP puro
 */
@Component
public class ChatCommandHandler implements CommandHandler {
    private static final Logger log = LoggerFactory.getLogger(ChatCommandHandler.class);

    @Autowired
    private ChatService chatService;

    @Autowired
    private ProjectRepository projectRepository;

    private static final String COMMAND_TYPE = "CHAT";

    public ChatCommandHandler() {
        log.info("ChatCommandHandler instanciado pelo Spring");
    }

    @Override
    public String getCommandType() {
        return COMMAND_TYPE;
    }

    @Override
    public Protocol.Response handle(Protocol.Message message, SessionManager sessionManager) {
        log.info("ChatCommandHandler.handle() chamado para requestId: {}", message.getRequestId());
        
        User user = sessionManager.validateSession(message.getSessionId());
        if (user == null) {
            log.warn("Sessao invalida ou expirada: {}", message.getSessionId());
            return Protocol.createError(message.getRequestId(), "Sessão inválida ou expirada");
        }
        
        log.info("Sessao validada para usuario: {}", user.getEmail());

        JsonObject data = message.getData();
        if (data == null || !data.has("action")) {
            log.warn("Campo 'action' nao encontrado no data: {}", data);
            return Protocol.createError(message.getRequestId(),
                    "Campo 'action' obrigatório (GET_MESSAGES, SEND_MESSAGE)");
        }

        String action = data.get("action").getAsString();
        log.info("Action recebida: {}", action);

        try {
            switch (action.toUpperCase()) {
                case "GET_MESSAGES":
                    log.info("Processando GET_MESSAGES");
                    return handleGetMessages(message, user);
                case "SEND_MESSAGE":
                    log.info("Processando SEND_MESSAGE");
                    return handleSendMessage(message, user);
                case "ACCEPT_PROJECT":
                    log.info("Processando ACCEPT_PROJECT");
                    return handleAcceptProject(message, user);
                default:
                    log.warn("Action invalida: {}", action);
                    return Protocol.createError(message.getRequestId(),
                            "Action inválida: " + action);
            }
        } catch (Exception e) {
            log.error("Erro ao processar comando CHAT (action={}): {}", action, e.getMessage(), e);
            return Protocol.createError(message.getRequestId(),
                    "Erro ao processar comando: " + e.getMessage());
        }
    }

    /**
     * Recupera mensagens de um projeto
     * Validação: usuário deve ser owner do projeto ou consultant atribuído
     */
    private Protocol.Response handleGetMessages(Protocol.Message message, User user) {
        JsonObject data = message.getData();

        if (!data.has("projectId")) {
            return Protocol.createError(message.getRequestId(),
                    "Campo 'projectId' obrigatório");
        }

        Long projectId = data.get("projectId").getAsLong();

        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) {
            return Protocol.createError(message.getRequestId(),
                    "Projeto não encontrado");
        }

        try {
            List<ChatMessage> messages = chatService.getMessagesByProjectId(projectId, user.getId());

            JsonArray messagesArray = new JsonArray();
            for (ChatMessage msg : messages) {
                JsonObject msgObj = new JsonObject();
                msgObj.addProperty("id", msg.getId());
                msgObj.addProperty("content", msg.getContent());
                msgObj.addProperty("timestamp", msg.getTimestamp().toString());

                // Informações do sender
                JsonObject senderObj = new JsonObject();
                senderObj.addProperty("id", msg.getSender().getId());
                senderObj.addProperty("name", msg.getSender().getName());
                senderObj.addProperty("email", msg.getSender().getEmail());
                msgObj.add("sender", senderObj);

                messagesArray.add(msgObj);
            }

            JsonObject responseData = new JsonObject();
            responseData.add("messages", messagesArray);
            responseData.addProperty("projectId", projectId);
            responseData.addProperty("projectStatus", project.getStatus().toString());
            responseData.addProperty("consultantAssigned", project.getConsultant() != null);

            log.info("GET_MESSAGES: {} mensagens retornadas para projeto {}", messages.size(), projectId);

            return Protocol.createSuccess(message.getRequestId(),
                    "Mensagens recuperadas", responseData);

        } catch (Exception e) {
            log.error("Erro ao recuperar mensagens do projeto {}: {}", projectId, e.getMessage());
            return Protocol.createError(message.getRequestId(),
                    "Erro ao recuperar mensagens: " + e.getMessage());
        }
    }

    /**
     * Envia nova mensagem de chat
     */
    private Protocol.Response handleSendMessage(Protocol.Message message, User user) {
        JsonObject data = message.getData();
        log.debug("Data recebida: {}", data);

        if (!data.has("projectId") || !data.has("content")) {
            log.warn("Campos obrigatorios faltando. Has projectId: {}, Has content: {}", 
                    data.has("projectId"), data.has("content"));
            return Protocol.createError(message.getRequestId(),
                    "Campos 'projectId' e 'content' obrigatórios");
        }

        Long projectId = data.get("projectId").getAsLong();
        String content = data.get("content").getAsString();
        
        log.info("SEND_MESSAGE recebida - ProjectId: {}, Usuario: {}, Content: {}", 
                projectId, user.getEmail(), content);

        if (content == null || content.trim().isEmpty()) {
            log.warn("Conteudo vazio ou null");
            return Protocol.createError(message.getRequestId(),
                    "Conteúdo da mensagem não pode estar vazio");
        }

        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) {
            log.warn("Projeto nao encontrado: {}", projectId);
            return Protocol.createError(message.getRequestId(),
                    "Projeto não encontrado");
        }
        
        log.info("Projeto encontrado: {}", project.getName());

        try {
            log.info("Persistindo mensagem via ChatService...");
            ChatMessage savedMessage = chatService.sendMessage(projectId, user.getId(), content);

            JsonObject responseData = new JsonObject();
            responseData.addProperty("messageId", savedMessage.getId());
            responseData.addProperty("projectId", projectId);
            responseData.addProperty("timestamp", savedMessage.getTimestamp().toString());

            log.info("SEND_MESSAGE SUCCESS: Mensagem {} enviada por {} em projeto {}", 
                    savedMessage.getId(), user.getEmail(), projectId);

            return Protocol.createSuccess(message.getRequestId(),
                    "Mensagem enviada com sucesso", responseData);

        } catch (RuntimeException e) {
            log.error("RuntimeException ao enviar mensagem no projeto {}: {}", projectId, e.getMessage(), e);
            return Protocol.createError(message.getRequestId(),
                    "Erro ao enviar mensagem: " + e.getMessage());
        } catch (Exception e) {
            log.error("Exception GERAL ao enviar mensagem: {}", e.getMessage(), e);
            return Protocol.createError(message.getRequestId(),
                    "Erro inesperado: " + e.getMessage());
        }
    }

    /**
     * Consultor aceita projeto e se atribui como responsável
     */
    private Protocol.Response handleAcceptProject(Protocol.Message message, User user) {
        JsonObject data = message.getData();
        
        if (!data.has("projectId")) {
            log.warn("Campo projectId faltando");
            return Protocol.createError(message.getRequestId(),
                    "Campo 'projectId' obrigatório");
        }

        Long projectId = data.get("projectId").getAsLong();
        
        log.info("Consultor {} tentando aceitar projeto {}", user.getEmail(), projectId);

        if (user.getRole() != User.Role.CONSULTANT) {
            log.warn("Usuario nao e consultor: {}", user.getRole());
            return Protocol.createError(message.getRequestId(),
                    "Apenas consultores podem aceitar projetos");
        }

        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) {
            log.warn("Projeto nao encontrado: {}", projectId);
            return Protocol.createError(message.getRequestId(),
                    "Projeto não encontrado");
        }

        project.setConsultant(user);
        if (project.getStatus() == Project.ProjectStatus.PENDING) {
            project.setStatus(Project.ProjectStatus.IN_PROGRESS);
        }
        
        projectRepository.save(project);
        
        log.info("Projeto {} aceito por consultor {}", projectId, user.getEmail());

        JsonObject responseData = new JsonObject();
        responseData.addProperty("projectId", projectId);
        responseData.addProperty("consultantId", user.getId());
        responseData.addProperty("consultantName", user.getName());
        responseData.addProperty("status", project.getStatus().toString());

        return Protocol.createSuccess(message.getRequestId(),
                "Projeto aceito com sucesso", responseData);
    }
}
