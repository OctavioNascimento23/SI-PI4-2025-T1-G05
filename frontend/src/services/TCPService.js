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

    async getChatMessages(projectId) {
        await this.init();
        
        this.sessionId = localStorage.getItem('sessionId');
        
        const response = await tcpClient.send('CHAT', {
            action: 'GET_MESSAGES',
            projectId: parseInt(projectId)
        }, this.sessionId);

        return response.data.messages || [];
    }

    async acceptProject(projectId) {
        await this.init();
        this.sessionId = localStorage.getItem('sessionId');
        
        const response = await tcpClient.send('CHAT', {
            action: 'ACCEPT_PROJECT',
            projectId: parseInt(projectId)
        }, this.sessionId);
        
        return response;
    }

    async sendChatMessage(projectId, content) {
        await this.init();
        
        this.sessionId = localStorage.getItem('sessionId');
        
        const response = await tcpClient.send('CHAT', {
            action: 'SEND_MESSAGE',
            projectId: parseInt(projectId),
            content: content
        }, this.sessionId);
        
        return response.data;
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
