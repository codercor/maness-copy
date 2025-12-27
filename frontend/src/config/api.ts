// API configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
export const UPLOADS_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

export const api = {
    // Auth endpoints
    auth: {
        login: `${API_URL}/auth/login`,
        verify: `${API_URL}/auth/verify`,
    },
    // Packages endpoints
    packages: {
        list: `${API_URL}/packages`,
        get: (id: string) => `${API_URL}/packages/${id}`,
        create: `${API_URL}/packages`,
        update: (id: string) => `${API_URL}/packages/${id}`,
        delete: (id: string) => `${API_URL}/packages/${id}`,
        bulk: `${API_URL}/packages/bulk`,
    },
    // Gallery endpoints
    gallery: {
        list: `${API_URL}/gallery`,
    },
    // Testimonials endpoints
    testimonials: {
        list: `${API_URL}/testimonials`,
    },
    // Newsletter endpoints
    newsletter: {
        subscribe: `${API_URL}/newsletter/subscribe`,
    },
    // Upload endpoints
    upload: {
        image: `${API_URL}/upload/image`,
    },
};

