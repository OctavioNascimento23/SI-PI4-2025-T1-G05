import tcpService from './TCPService';

const authService = {
    login: async (email, password) => {
        try {
            const response = await tcpService.login(email, password);
            
            if (response.success) {
                const { sessionId, userId, name, role } = response.data;
                
                // Store sessionId e user info no localStorage
                localStorage.setItem('sessionId', sessionId);
                localStorage.setItem('user', JSON.stringify({ userId, name, email, role }));
                
                console.log('✅ Login TCP bem-sucedido:', { userId, name, role });
                return response.data;
            } else {
                throw new Error(response.message || 'Erro no login');
            }
        } catch (error) {
            console.error('❌ Erro ao fazer login via TCP:', error);
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await tcpService.register(
                userData.name,
                userData.email,
                userData.password,
                userData.role
            );
            
            if (response.success) {
                const { sessionId, userId, name, role } = response.data;
                
                // Store sessionId e user info no localStorage
                localStorage.setItem('sessionId', sessionId);
                localStorage.setItem('user', JSON.stringify({ userId, name, email: userData.email, role }));
                
                console.log('✅ Registro TCP bem-sucedido:', { userId, name, role });
                return response.data;
            } else {
                throw new Error(response.message || 'Erro no registro');
            }
        } catch (error) {
            console.error('❌ Erro ao registrar via TCP:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await tcpService.logout();
        } catch (error) {
            console.error('Erro ao fazer logout via TCP:', error);
        }
        
        // Limpa localStorage mesmo se logout TCP falhar
        localStorage.removeItem('sessionId');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getSessionId: () => {
        return localStorage.getItem('sessionId');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('sessionId');
    }
};

export default authService;
