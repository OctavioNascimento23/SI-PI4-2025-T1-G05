package com.consultoria.app.tcp.handler;

import com.consultoria.app.model.User;
import com.consultoria.app.repository.UserRepository;
import com.consultoria.app.tcp.Protocol;
import com.consultoria.app.tcp.SessionManager;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Handler para comandos de autenticação (LOGIN, REGISTER, LOGOUT)
 */
@Component
public class AuthCommandHandler implements CommandHandler {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private static final String COMMAND_TYPE = "AUTH";

    @Override
    public String getCommandType() {
        return COMMAND_TYPE;
    }

    @Override
    public Protocol.Response handle(Protocol.Message message, SessionManager sessionManager) {
        JsonObject data = message.getData();

        if (data == null || !data.has("action")) {
            return Protocol.createError(message.getRequestId(),
                    "Campo 'action' obrigatório (LOGIN, REGISTER, LOGOUT)");
        }

        String action = data.get("action").getAsString();

        switch (action.toUpperCase()) {
            case "LOGIN":
                return handleLogin(message, sessionManager);
            case "REGISTER":
                return handleRegister(message, sessionManager);
            case "LOGOUT":
                return handleLogout(message, sessionManager);
            default:
                return Protocol.createError(message.getRequestId(),
                        "Action inválida: " + action);
        }
    }

    /**
     * Processa login
     */
    private Protocol.Response handleLogin(Protocol.Message message, SessionManager sessionManager) {
        JsonObject data = message.getData();

        if (!data.has("email") || !data.has("password")) {
            return Protocol.createError(message.getRequestId(),
                    "Email e password obrigatórios");
        }

        String email = data.get("email").getAsString();
        String password = data.get("password").getAsString();

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return Protocol.createError(message.getRequestId(),
                    "Usuário não encontrado");
        }

        if (!verifyPassword(password, user.getPassword())) {
            return Protocol.createError(message.getRequestId(),
                    "Senha incorreta");
        }

        // Cria sessão
        String sessionId = sessionManager.createSession(user);

        // Monta resposta
        JsonObject responseData = new JsonObject();
        responseData.addProperty("sessionId", sessionId);
        responseData.addProperty("userId", user.getId());
        responseData.addProperty("name", user.getName());
        responseData.addProperty("email", user.getEmail());
        responseData.addProperty("role", user.getRole().toString());

        if (user.getProfilePhotoUrl() != null) {
            responseData.addProperty("profilePhotoUrl", user.getProfilePhotoUrl());
        }

        return Protocol.createSuccess(message.getRequestId(),
                "Login realizado com sucesso", responseData);
    }

    /**
     * Processa registro
     */
    private Protocol.Response handleRegister(Protocol.Message message, SessionManager sessionManager) {
        JsonObject data = message.getData();

        if (!data.has("name") || !data.has("email") || !data.has("password") || !data.has("role")) {
            return Protocol.createError(message.getRequestId(),
                    "Nome, email, password e role obrigatórios");
        }

        String name = data.get("name").getAsString();
        String email = data.get("email").getAsString();
        String password = data.get("password").getAsString();
        String roleStr = data.get("role").getAsString().toUpperCase();

        // Verifica se email já existe
        if (userRepository.findByEmail(email).isPresent()) {
            return Protocol.createError(message.getRequestId(),
                    "Email já cadastrado");
        }

        // Valida role
        User.Role role;
        try {
            role = User.Role.valueOf(roleStr);
        } catch (IllegalArgumentException e) {
            return Protocol.createError(message.getRequestId(),
                    "Role inválida. Use USER ou CONSULTANT");
        }

        // Cria usuário
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(encodePassword(password));
        user.setRole(role);

        user = userRepository.save(user);

        // Cria sessão
        String sessionId = sessionManager.createSession(user);

        // Monta resposta
        JsonObject responseData = new JsonObject();
        responseData.addProperty("sessionId", sessionId);
        responseData.addProperty("userId", user.getId());
        responseData.addProperty("name", user.getName());
        responseData.addProperty("email", user.getEmail());
        responseData.addProperty("role", user.getRole().toString());

        return Protocol.createSuccess(message.getRequestId(),
                "Registro realizado com sucesso", responseData);
    }

    /**
     * Processa logout
     */
    private Protocol.Response handleLogout(Protocol.Message message, SessionManager sessionManager) {
        String sessionId = message.getSessionId();

        if (sessionId != null) {
            sessionManager.invalidateSession(sessionId);
        }

        JsonObject responseData = new JsonObject();
        return Protocol.createSuccess(message.getRequestId(),
                "Logout realizado com sucesso", responseData);
    }

    /**
     * Verifica senha
     */
    private boolean verifyPassword(String rawPassword, String encodedPassword) {
        try {
            return passwordEncoder.matches(rawPassword, encodedPassword);
        } catch (Exception e) {
            // Se a senha não estiver hasheada (durante desenvolvimento), compara
            // diretamente
            return rawPassword.equals(encodedPassword);
        }
    }

    /**
     * Codifica senha
     */
    private String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
}
