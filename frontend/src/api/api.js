
import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const authApi = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        return response.data; // Should return the token string
    },
    register: async (username, email, password) => {
        // Note: Backend register endpoint returns a string message, not a token
        const response = await api.post('/auth/register', { username, email, password });
        return response.data;
    },
};

export const sweetsApi = {
    getAll: async () => {
        const response = await api.get('/sweets');
        return response.data;
    },
    search: async (params) => { // name, category, minPrice, maxPrice
        const response = await api.get('/sweets/search', { params });
        return response.data;
    },
    add: async (sweet) => {
        // sweet: { name, category, price, quantity, (no image_url in backend) }
        const response = await api.post('/sweets/add', sweet);
        return response.data;
    },
    update: async (id, sweet) => {
        const response = await api.put(`/sweets/${id}`, sweet);
        return response.data;
    },
    restock: async (id, quantity) => {
        const response = await api.post(`/sweets/${id}/restock`, null, { params: { quantity } });
        return response.data;
    },
    purchase: async (id, quantity) => {
        const response = await api.post(`/sweets/${id}/purchase`, null, { params: { quantity } });
        return response.data;
    },
    delete: async (id) => {
        await api.delete(`/sweets/delete/${id}`);
    }
};

export default api;
// End of file
