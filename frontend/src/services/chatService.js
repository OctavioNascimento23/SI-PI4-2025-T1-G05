import api from './api';

const chatService = {
    sendMessage: async (projectId, content) => {
        const response = await api.post(`/chat/${projectId}/messages`, { content });
        return response.data;
    },

    getMessages: async (projectId) => {
        const response = await api.get(`/chat/${projectId}/messages`);
        return response.data;
    }
};

export default chatService;
