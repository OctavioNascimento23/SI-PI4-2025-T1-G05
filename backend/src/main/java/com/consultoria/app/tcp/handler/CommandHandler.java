// Criado por Octavio Nascimento
package com.consultoria.app.tcp.handler;

import com.consultoria.app.tcp.Protocol;
import com.consultoria.app.tcp.SessionManager;
import com.google.gson.JsonObject;

/**
 * Interface base para todos os command handlers
 */
public interface CommandHandler {
    /**
     * Processa comando e retorna resposta
     * 
     * @param message        Mensagem recebida
     * @param sessionManager Gerenciador de sessões
     * @return Resposta a ser enviada ao cliente
     */
    Protocol.Response handle(Protocol.Message message, SessionManager sessionManager);

    /**
     * Retorna o tipo de comando que este handler processa
     */
    String getCommandType();
}
