package com.consultoria.app.tcp;

import com.consultoria.app.model.User;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Gerenciador de sessões de usuários autenticados
 */
public class SessionManager {
    private static SessionManager instance;
    private final Map<String, Session> sessions = new ConcurrentHashMap<>();
    private final long SESSION_TIMEOUT = 3600000; // 1 hora em ms

    private SessionManager() {
    }

    public static synchronized SessionManager getInstance() {
        if (instance == null) {
            instance = new SessionManager();
        }
        return instance;
    }

    /**
     * Cria nova sessão para usuário
     */
    public String createSession(User user) {
        String sessionId = UUID.randomUUID().toString();
        Session session = new Session(sessionId, user);
        sessions.put(sessionId, session);
        return sessionId;
    }

    /**
     * Valida sessão e retorna usuário se válida
     */
    public User validateSession(String sessionId) {
        if (sessionId == null) {
            return null;
        }

        Session session = sessions.get(sessionId);
        if (session == null) {
            return null;
        }

        // Verifica timeout
        if (System.currentTimeMillis() - session.getLastActivity() > SESSION_TIMEOUT) {
            sessions.remove(sessionId);
            return null;
        }

        // Atualiza última atividade
        session.updateActivity();
        return session.getUser();
    }

    /**
     * Invalida sessão (logout)
     */
    public void invalidateSession(String sessionId) {
        sessions.remove(sessionId);
    }

    /**
     * Conta sessões ativas
     */
    public int getActiveSessionCount() {
        return sessions.size();
    }

    /**
     * Limpa sessões expiradas
     */
    public void cleanExpiredSessions() {
        long now = System.currentTimeMillis();
        sessions.entrySet().removeIf(entry -> now - entry.getValue().getLastActivity() > SESSION_TIMEOUT);
    }

    /**
     * Classe interna para representar uma sessão
     */
    public static class Session {
        private final String sessionId;
        private final User user;
        private long lastActivity;

        public Session(String sessionId, User user) {
            this.sessionId = sessionId;
            this.user = user;
            this.lastActivity = System.currentTimeMillis();
        }

        public String getSessionId() {
            return sessionId;
        }

        public User getUser() {
            return user;
        }

        public long getLastActivity() {
            return lastActivity;
        }

        public void updateActivity() {
            this.lastActivity = System.currentTimeMillis();
        }
    }
}
