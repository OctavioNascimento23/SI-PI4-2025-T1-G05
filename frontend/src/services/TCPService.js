// Criado por Gabriel dos Santos
import tcpClient from './tcpClient';

// Serviço de alto nível para comunicação TCP/IP
class TCPService {
    constructor() {
        this.sessionId = localStorage.getItem('sessionId');
        this.connected = false;
    }

    // Inicializa conexão
    async init() {
        if (!this.connected) {
            await tcpClient.connect();
            this.connected = true;
        }
    }

    // ===== AUTENTICAÇÃO =====

    async login(email, password) {
        await this.init();
        const response = await tcpClient.send('AUTH', {
            action: 'LOGIN',
            email,
            password
        });

        if (response.success) {
            this.sessionId = response.data.sessionId;
            localStorage.setItem('sessionId', this.sessionId);
            localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response;
    }

    async register(name, email, password, role) {
        await this.init();
        const response = await tcpClient.send('AUTH', {
            action: 'REGISTER',
            name,
            email,
            password,
            role
        });

        if (response.success) {
            this.sessionId = response.data.sessionId;
            localStorage.setItem('sessionId', this.sessionId);
            localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response;
    }

    async logout() {
        await tcpClient.send('AUTH', {
            action: 'LOGOUT'
        }, this.sessionId);

        this.sessionId = null;
        localStorage.removeItem('sessionId');
        localStorage.removeItem('user');
        tcpClient.disconnect();
        this.connected = false;
    }

    // ===== PERFIL =====

    async updateProfile(profileData) {
        return await tcpClient.send('PROFILE', {
            action: 'UPDATE',
            ...profileData
        }, this.sessionId);
    }

    async uploadPhoto(photoFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const base64 = e.target.result.split(',')[1];
                    const response = await tcpClient.send('PROFILE', {
                        action: 'UPLOAD_PHOTO',
                        photoData: base64,
                        fileName: photoFile.name
                    }, this.sessionId);
                    resolve(response);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(photoFile);
        });
    }

    async getProfile(userId = null) {
        return await tcpClient.send('PROFILE', {
            action: 'GET',
            ...(userId && { userId })
        }, this.sessionId);
    }

    // ===== CHAT =====

    /**
     * Envia uma mensagem de chat via TCP
     * @param {number} projectId - ID do projeto
     * @param {number} userId - ID do usuário remetente
     * @param {string} content - Conteúdo da mensagem
     */
    async sendChatMessage(projectId, userId, content) {
        console.log(`[TCP-CHAT] Enviando mensagem - Projeto: ${projectId}, Usuário: ${userId}`);
        
        await this.init();
        const response = await tcpClient.send('CHAT', {
            action: 'SEND',
            projectId,
            userId,
            content
        }, this.sessionId);

        if (response.success) {
            console.log(`[TCP-CHAT] ✓ Mensagem enviada com sucesso - ID: ${response.data.messageId}`);
        } else {
            console.error(`[TCP-CHAT] ✗ Erro ao enviar mensagem: ${response.message}`);
        }

        return response;
    }

    /**
     * Obtém mensagens de um projeto via TCP
     * @param {number} projectId - ID do projeto
     * @param {number} userId - ID do usuário
     */
    async getChatMessages(projectId, userId) {
        console.log(`[TCP-CHAT] Buscando mensagens - Projeto: ${projectId}, Usuário: ${userId}`);
        
        await this.init();
        const response = await tcpClient.send('CHAT', {
            action: 'GET_MESSAGES',
            projectId,
            userId
        }, this.sessionId);

        if (response.success) {
            const messageCount = response.data.messages ? response.data.messages.length : 0;
            console.log(`[TCP-CHAT] ✓ ${messageCount} mensagens recuperadas`);
        } else {
            console.error(`[TCP-CHAT] ✗ Erro ao buscar mensagens: ${response.message}`);
        }

        return response;
    }

    /**
     * Obtém projetos com chat ativo para o usuário via TCP
     * @param {number} userId - ID do usuário
     */
    async getProjectsWithChat(userId) {
        console.log(`[TCP-CHAT] Buscando projetos com chat ativo para usuário: ${userId}`);
        
        await this.init();
        const response = await tcpClient.send('CHAT', {
            action: 'GET_PROJECTS_WITH_CHAT',
            userId
        }, this.sessionId);

        if (response.success) {
            const projectCount = response.data.projects ? response.data.projects.length : 0;
            console.log(`[TCP-CHAT] ✓ ${projectCount} projetos com chat encontrados`);
        } else {
            console.error(`[TCP-CHAT] ✗ Erro ao buscar projetos: ${response.message}`);
        }

        return response;
    }

    /**
     * Polling de mensagens - atualiza mensagens periodicamente
     * @param {number} projectId - ID do projeto
     * @param {number} userId - ID do usuário
     * @param {function} callback - Função chamada com novas mensagens
     * @param {number} interval - Intervalo em ms (padrão: 3000ms)
     * @returns {function} - Função para parar o polling
     */
    startChatPolling(projectId, userId, callback, interval = 3000) {
        console.log(`[TCP-CHAT] Iniciando polling de mensagens (intervalo: ${interval}ms)`);
        
        let lastMessageCount = 0;
        
        const poll = async () => {
            try {
                const response = await this.getChatMessages(projectId, userId);
                if (response.success && response.data.messages) {
                    const messages = response.data.messages;
                    if (messages.length !== lastMessageCount) {
                        console.log(`[TCP-CHAT] 📬 Novas mensagens detectadas: ${messages.length - lastMessageCount}`);
                        callback(messages);
                        lastMessageCount = messages.length;
                    }
                }
            } catch (error) {
                console.error('[TCP-CHAT] Erro no polling:', error);
            }
        };

        // Busca imediata
        poll();
        
        // Configura intervalo
        const intervalId = setInterval(poll, interval);

        // Retorna função para parar polling
        return () => {
            console.log('[TCP-CHAT] Parando polling de mensagens');
            clearInterval(intervalId);
        };
    }

    // ===== UTILIDADES =====

    isAuthenticated() {
        return !!this.sessionId;
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
}

// Exporta instância única
const tcpService = new TCPService();
export default tcpService;
