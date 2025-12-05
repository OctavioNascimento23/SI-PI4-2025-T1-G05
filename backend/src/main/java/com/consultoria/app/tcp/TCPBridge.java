package com.consultoria.app.tcp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Bridge WebSocket para TCP/IP
 * Frontend conecta via WebSocket, bridge encaminha para servidor TCP/IP
 */
@Component
public class TCPBridge extends TextWebSocketHandler {
    private static final Logger log = LoggerFactory.getLogger(TCPBridge.class);
    private static final String TCP_HOST = "localhost";
    private static final int TCP_PORT = 8888;

    private final Map<String, Socket> tcpConnections = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("WebSocket conectado: {}", session.getId());

        // Cria conexão TCP para este cliente WebSocket
        try {
            Socket tcpSocket = new Socket(TCP_HOST, TCP_PORT);
            tcpConnections.put(session.getId(), tcpSocket);

            // Thread para ler respostas do TCP e enviar para WebSocket
            new Thread(() -> readFromTCP(session, tcpSocket)).start();

            log.info("Conexão TCP estabelecida para sessão {}", session.getId());
        } catch (Exception e) {
            log.error("Erro ao conectar ao servidor TCP", e);
            session.close(CloseStatus.SERVER_ERROR);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        Socket tcpSocket = tcpConnections.get(session.getId());

        if (tcpSocket != null && tcpSocket.isConnected()) {
            try {
                // Envia mensagem para servidor TCP
                PrintWriter out = new PrintWriter(tcpSocket.getOutputStream(), true);
                out.println(payload);
                log.debug("Mensagem enviada ao TCP: {}", payload.substring(0, Math.min(100, payload.length())));
            } catch (Exception e) {
                log.error("Erro ao enviar mensagem para TCP", e);
            }
        } else {
            log.warn("Socket TCP não disponível para sessão {}", session.getId());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info("WebSocket desconectado: {}", session.getId());

        // Fecha conexão TCP
        Socket tcpSocket = tcpConnections.remove(session.getId());
        if (tcpSocket != null) {
            try {
                tcpSocket.close();
            } catch (Exception e) {
                log.error("Erro ao fechar socket TCP", e);
            }
        }
    }

    /**
     * Lê respostas do servidor TCP e envia para cliente WebSocket
     */
    private void readFromTCP(WebSocketSession session, Socket tcpSocket) {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(tcpSocket.getInputStream()))) {
            String line;
            while ((line = in.readLine()) != null) {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(line));
                    log.debug("Resposta TCP enviada ao WebSocket: {}", line.substring(0, Math.min(100, line.length())));
                } else {
                    break;
                }
            }
        } catch (Exception e) {
            log.error("Erro ao ler do TCP", e);
        } finally {
            try {
                if (session.isOpen()) {
                    session.close();
                }
            } catch (Exception e) {
                log.error("Erro ao fechar sessão WebSocket", e);
            }
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.error("Erro de transporte WebSocket", exception);
        session.close(CloseStatus.SERVER_ERROR);
    }
}
