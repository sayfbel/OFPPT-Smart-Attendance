import api from './api';

export const studentService = {
    // Users (Students/Formateurs/Admins)
    getUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    createUser: async (userData) => {
        const response = await api.post('/admin/users', userData);
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.put(`/admin/users/${id}`, userData);
        return response.data;
    },

    deleteUser: async (id, role) => {
        const response = await api.delete(`/admin/users/${id}?role=${role}`);
        return response.data;
    },

    importUsers: async (formData) => {
        const response = await api.post('/admin/users/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    getStudentProfile: async (id) => {
        const response = await api.get(`/admin/students/${id}`);
        return response.data;
    },

    // Groups
    getGroups: async () => {
        const response = await api.get('/admin/groups');
        return response.data;
    },

    createGroup: async (groupData) => {
        const response = await api.post('/admin/groups', groupData);
        return response.data;
    },

    updateGroup: async (id, groupData) => {
        const response = await api.put(`/admin/groups/${id}`, groupData);
        return response.data;
    },

    deleteGroup: async (id) => {
        const response = await api.delete(`/admin/groups/${id}`);
        return response.data;
    },

    // Filieres
    getFilieres: async () => {
        const response = await api.get('/admin/filieres');
        return response.data;
    },

    createFiliere: async (filiereData) => {
        const response = await api.post('/admin/filieres', filiereData);
        return response.data;
    },

    updateFiliere: async (id, filiereData) => {
        const response = await api.put(`/admin/filieres/${id}`, filiereData);
        return response.data;
    },

    deleteFiliere: async (id) => {
        const response = await api.delete(`/admin/filieres/${id}`);
        return response.data;
    },

    // Salles
    getSalles: async () => {
        const response = await api.get('/admin/salles');
        return response.data;
    },

    createSalle: async (salleData) => {
        const response = await api.post('/admin/salles', salleData);
        return response.data;
    },

    updateSalle: async (id, salleData) => {
        const response = await api.put(`/admin/salles/${id}`, salleData);
        return response.data;
    },

    deleteSalle: async (id) => {
        const response = await api.delete(`/admin/salles/${id}`);
        return response.data;
    },

    // Formateurs list for admin
    getFormateurs: async () => {
        const response = await api.get('/admin/formateurs');
        return response.data;
    },

    // Schedules
    getAdminSchedule: async () => {
        const response = await api.get('/admin/schedule');
        return response.data;
    },

    createSchedule: async (scheduleData) => {
        const response = await api.post('/admin/schedule', scheduleData);
        return response.data;
    },

    updateSchedule: async (id, scheduleData) => {
        const response = await api.put(`/admin/schedule/${id}`, scheduleData);
        return response.data;
    },

    deleteSchedule: async (id) => {
        const response = await api.delete(`/admin/schedule/${id}`);
        return response.data;
    },

    // Formateur Group/Users fetching (used on formateur screens)
    getFormateurGroups: async () => {
        const response = await api.get('/formateur/groups');
        return response.data;
    },

    getFormateurUsersByGroup: async (groupId) => {
        const response = await api.get(`/formateur/users/by-group/${groupId}`);
        return response.data;
    }
};

export default studentService;
