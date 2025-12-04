package com.consultoria.app.tcp;

import com.consultoria.app.tcp.handler.CommandHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Servidor TCP/IP principal
 */
@Component
public class TCPServer {
    private static final Logger log = LoggerFactory.getLogger(TCPServer.class);

    @Value("${tcp.server.port:8888}")
    private int port;

    @Autowired(required = false)
    private List<CommandHandler> commandHandlersList;

    private ServerSocket serverSocket;
    private ExecutorService threadPool;
    private Thread serverThread;
    private boolean running = false;
    private Map<String, CommandHandler> commandHandlers = new HashMap<>();

    @PostConstruct
    public void initialize() {
        // Registra command handlers
        if (commandHandlersList != null) {
            for (CommandHandler handler : commandHandlersList) {
                commandHandlers.put(handler.getCommandType(), handler);
                log.info("Registrado handler para comando: {}", handler.getCommandType());
            }
        }

        // Inicia servidor em thread separada
        serverThread = new Thread(this::start);
        serverThread.setName("TCP-Server-Thread");
        serverThread.start();
    }

    /**
     * Inicia servidor TCP/IP
     */
    public void start() {
        try {
            serverSocket = new ServerSocket(port);
            threadPool = Executors.newFixedThreadPool(20); // Pool de 20 threads
            running = true;

            log.info("===========================================");
            log.info("Servidor TCP/IP iniciado na porta {}", port);
            log.info("Aguardando conexões...");
            log.info("===========================================");

            while (running) {
                try {
                    Socket clientSocket = serverSocket.accept();
                    ClientHandler clientHandler = new ClientHandler(clientSocket, commandHandlers);
                    threadPool.execute(clientHandler);
                } catch (IOException e) {
                    if (running) {
                        log.error("Erro ao aceitar conexão", e);
                    }
                }
            }
        } catch (IOException e) {
            log.error("Erro ao iniciar servidor TCP/IP", e);
        }
    }

    /**
     * Para servidor
     */
    @PreDestroy
    public void stop() {
        running = false;

        try {
            if (serverSocket != null && !serverSocket.isClosed()) {
                serverSocket.close();
            }

            if (threadPool != null) {
                threadPool.shutdown();
            }

            log.info("Servidor TCP/IP finalizado");
        } catch (IOException e) {
            log.error("Erro ao finalizar servidor", e);
        }
    }

    /**
     * Verifica se servidor está rodando
     */
    public boolean isRunning() {
        return running;
    }

    /**
     * Retorna porta do servidor
     */
    public int getPort() {
        return port;
    }
}
