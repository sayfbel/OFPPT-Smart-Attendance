import api from './api';

export const attendanceService = {
    getActiveCheckins: async (groupId) => {
        const response = await api.get(`/formateur/active-checkins/${groupId}`);
        return response.data;
    },

    processCheckinQR: async (qrContent, groupId) => {
        const response = await api.post('/formateur/process-checkin-qr', { qrContent, groupId });
        return response.data;
    },

    clearCheckins: async (groupId) => {
        const response = await api.post('/formateur/clear-checkins', { groupId });
        return response.data;
    },

    updateCheckinStatus: async (studentId, groupId, status) => {
        const response = await api.post('/formateur/update-checkin-status', { studentId, groupId, status });
        return response.data;
    },

    getFormateurSchedule: async () => {
        const response = await api.get('/formateur/schedule');
        return response.data;
    }
};

export default attendanceService;
