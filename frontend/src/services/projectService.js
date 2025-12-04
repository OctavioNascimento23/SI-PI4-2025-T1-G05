import api from './api';

const projectService = {
    createProject: async (projectData) => {
        const response = await api.post('/projects', projectData);
        return response.data;
    },

    getProjects: async () => {
        const response = await api.get('/projects');
        return response.data;
    },

    getProjectById: async (id) => {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },

    updateProject: async (id, projectData) => {
        const response = await api.put(`/projects/${id}`, projectData);
        return response.data;
    },

    deleteProject: async (id) => {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    },

    updateProjectStatus: async (id, status) => {
        const response = await api.patch(`/projects/${id}/status`, { status });
        return response.data;
    },

    getProjectHistory: async (id) => {
        const response = await api.get(`/projects/${id}/history`);
        return response.data;
    },

    getPendingProjects: async () => {
        const response = await api.get('/projects/pending');
        return response.data;
    },

    getConsultantProjects: async () => {
        const response = await api.get('/projects/consultant');
        return response.data;
    }
};

export default projectService;
