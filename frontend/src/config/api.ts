// API configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
export const UPLOADS_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

export const api = {
    // Auth endpoints
    auth: {
        login: `${API_URL}/auth/login`,
        google: `${API_URL}/auth/google`,
        verify: `${API_URL}/auth/verify`,
        me: `${API_URL}/auth/me`,
        changePassword: `${API_URL}/auth/change-password`,
    },
    // Users endpoints
    users: {
        list: `${API_URL}/users`,
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
        get: (id: string) => `${API_URL}/gallery/${id}`,
        packages: (id: string) => `${API_URL}/gallery/${id}/packages`,
        create: `${API_URL}/gallery`,
        update: (id: string) => `${API_URL}/gallery/${id}`,
        delete: (id: string) => `${API_URL}/gallery/${id}`,
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
    // Hero Carousel endpoints
    heroCarousel: {
        list: `${API_URL}/hero-carousel`, // Public endpoint
        admin: `${API_URL}/hero-carousel/admin`, // Admin - get all including inactive
        create: `${API_URL}/hero-carousel`,
        update: (id: string) => `${API_URL}/hero-carousel/${id}`,
        delete: (id: string) => `${API_URL}/hero-carousel/${id}`,
        reorder: `${API_URL}/hero-carousel/reorder/bulk`,
    },
};

