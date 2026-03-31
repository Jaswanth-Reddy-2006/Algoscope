import axios from 'axios';

export const VITE_API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'https://algoscope.me';
export const API_BASE_URL = VITE_API_BASE_URL.endsWith('/api') ? VITE_API_BASE_URL : `${VITE_API_BASE_URL}/api`;

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add JWT to headers if token exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('algoscope_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    async googleLogin(idToken: string) {
        const response = await api.post('/auth/google', { idToken });
        return response.data;
    },
    async register(userData: any) {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
    async login(credentials: any) {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    }
};

export const progressService = {
    async updateProgress(data: any) {
        const response = await api.post('/progress/update', data);
        return response.data;
    },
    async getProgress(userId: string) {
        const response = await api.get(`/progress/${userId}`);
        return response.data;
    }
};

export const analyticsService = {
    async getSummary() {
        const response = await api.get('/analytics/summary');
        return response.data;
    },
    async getTopics() {
        const response = await api.get('/analytics/topics');
        return response.data;
    },
    async getProficiency() {
        const response = await api.get('/analytics/proficiency');
        return response.data;
    },
    async getHeatmap() {
        const response = await api.get('/analytics/heatmap');
        return response.data;
    }
};

export const leetcodeService = {
    async connect(username?: string, sessionToken?: string) {
        const response = await api.post('/leetcode/connect', { username, sessionToken });
        return response.data;
    },
    async getStatus() {
        const response = await api.get('/leetcode/status');
        return response.data;
    },
    async disconnect() {
        const response = await api.delete('/leetcode/disconnect');
        return response.data;
    }
};

export const problemService = {
    async getProblems() {
        const response = await api.get('/problems');
        return response.data;
    },
    async syncLeetCode(username: string) {
        const response = await api.post('/leetcode/connect', { username });
        return response.data;
    }
};

export default api;
