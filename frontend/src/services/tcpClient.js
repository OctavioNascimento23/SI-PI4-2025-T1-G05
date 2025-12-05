// Cliente TCP/IP via WebSocket para comunicação com servidor
class TCPClient {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.messageQueue = [];
        this.callbacks = new Map();
        this.requestCounter = 0;
        this.onConnectCallbacks = [];
        this.onDisconnectCallbacks = [];
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    // Conecta ao servidor WebSocket
    connect(url = 'ws://localhost:8080/tcp-bridge') {
        return new Promise((resolve, reject) => {
            try {
                this.socket = new WebSocket(url);

                this.socket.onopen = () => {
                    console.log('✅ Conectado ao servidor TCP/IP');
                    this.connected = true;
                    this.reconnectAttempts = 0;

                    // Processa fila de mensagens pendentes
                    while (this.messageQueue.length > 0) {
                        const msg = this.messageQueue.shift();
                        this.socket.send(msg);
                    }

                    // Chama callbacks de conexão
                    this.onConnectCallbacks.forEach(cb => cb());
                    resolve();
                };

                this.socket.onmessage = (event) => {
                    try {
                        const response = JSON.parse(event.data);
                        console.log('📩 Resposta recebida:', response);

                        // Chama callback correspondente
                        const callback = this.callbacks.get(response.requestId);
                        if (callback) {
                            callback(response);
                            this.callbacks.delete(response.requestId);
                        }
                    } catch (error) {
                        console.error('Erro ao processar mensagem:', error);
                    }
                };

                this.socket.onerror = (error) => {
                    console.error('❌ Erro WebSocket:', error);
                    reject(error);
                };

                this.socket.onclose = () => {
                    console.log('🔌 Desconectado do servidor');
                    this.connected = false;
                    this.onDisconnectCallbacks.forEach(cb => cb());

                    // Tenta reconectar
                    if (this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.reconnectAttempts++;
                        console.log(`🔄 Tentativa de reconexão ${this.reconnectAttempts}...`);
                        setTimeout(() => this.connect(url), 2000 * this.reconnectAttempts);
                    }
                };

            } catch (error) {
                reject(error);
            }
        });
    }

    // Envia mensagem e retorna Promise com resposta
    send(type, data, sessionId = null) {
        return new Promise((resolve, reject) => {
            const requestId = `req_${++this.requestCounter}_${Date.now()}`;

            const message = {
                type,
                requestId,
                sessionId,
                data
            };

            // Adiciona callback
            const timeout = setTimeout(() => {
                this.callbacks.delete(requestId);
                reject(new Error('Timeout: servidor não respondeu'));
            }, 30000); // 30 segundos

            this.callbacks.set(requestId, (response) => {
                clearTimeout(timeout);
                if (response.success) {
                    resolve(response);
                } else {
                    reject(new Error(response.message || 'Erro desconhecido'));
                }
            });

            const messageStr = JSON.stringify(message);

            if (this.connected && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(messageStr);
            } else {
                // Adiciona à fila se desconectado
                console.log('📬 Mensagem adicionada à fila (desconectado)');
                this.messageQueue.push(messageStr);
            }
        });
    }

    // Registra listener para conexão
    onConnect(callback) {
        this.onConnectCallbacks.push(callback);
    }

    // Registra listener para desconexão
    onDisconnect(callback) {
        this.onDisconnectCallbacks.push(callback);
    }

    // Desconecta
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
            this.connected = false;
        }
    }

    // Verifica se está conectado
    isConnected() {
        return this.connected && this.socket && this.socket.readyState === WebSocket.OPEN;
    }
}

// Exporta instância única (singleton)
const tcpClient = new TCPClient();
export default tcpClient;
