import api from './api';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    updateAdminProfile: async (name, email) => {
        const response = await api.put('/auth/update-profile', { name, email });
        return response.data;
    },

    updateAdminPassword: async (currentPassword, newPassword) => {
        const response = await api.put('/auth/update-password', { currentPassword, newPassword });
        return response.data;
    },

    updateFormateurProfile: async (profile) => {
        const response = await api.put('/formateur/update-profile', profile);
        return response.data;
    },

    updateFormateurPassword: async (currentPassword, newPassword) => {
        const response = await api.put('/formateur/update-password', { currentPassword, newPassword });
        return response.data;
    },

    forceUpdatePassword: async (currentPassword, newPassword) => {
        const response = await api.put('/formateur/force-update-password', { currentPassword, newPassword });
        return response.data;
    }
};

export default authService;
