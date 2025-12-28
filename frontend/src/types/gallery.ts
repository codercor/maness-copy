// Translated content for gallery items
export interface GalleryTranslatedContent {
    title: string;
    description: string;
    quickLook: string;
}

// Gallery item translations map (content translations, not UI translations)
export interface GalleryItemTranslations {
    en: GalleryTranslatedContent;   // English is required (fallback)
    de?: GalleryTranslatedContent;  // German (optional)
    el?: GalleryTranslatedContent;  // Greek (optional)
}

export interface GalleryItem {
    _id?: string;
    // Multi-language content
    translations?: GalleryItemTranslations;
    // Legacy fields - kept for backward compatibility
    title: string;
    description: string;
    duration: string;
    image: string;
    quickLook: string;
    featured?: boolean;
    // Legacy field - prices are on packages, not destinations
    price?: string;
    packageId?: string;
}

export interface Testimonial {
    quote: string;
    author: string;
}
