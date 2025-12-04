import tcpService from './TCPService';

const chatService = {
    sendMessage: async (projectId, content) => {
        return tcpService.sendChatMessage(projectId, content);
    },

    getMessages: async (projectId) => {
        return tcpService.getChatMessages(projectId);
    }
};

export default chatService;
