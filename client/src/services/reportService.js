import api from './api';

export const reportService = {
    submitReport: async (reportData) => {
        const response = await api.post('/formateur/submit-report', reportData);
        return response.data;
    },

    getAdminReports: async () => {
        const response = await api.get('/admin/reports');
        return response.data;
    },

    getAbsenceRegistry: async () => {
        const response = await api.get('/admin/absence-registry');
        return response.data;
    },

    justifyAbsence: async (recordId, justified) => {
        const response = await api.post('/admin/justify-absence', { recordId, justified });
        return response.data;
    },

    submitDisciplinePenalty: async (penaltyData) => {
        const response = await api.post('/admin/discipline', penaltyData);
        return response.data;
    },

    getAdminSummary: async (period) => {
        const response = await api.get(`/admin/summary?period=${period}`);
        return response.data;
    }
};

export default reportService;
