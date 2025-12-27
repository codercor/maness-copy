export interface GalleryItem {
    _id?: string;
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
