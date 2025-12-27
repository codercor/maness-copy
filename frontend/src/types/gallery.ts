export interface GalleryItem {
    title: string;
    description: string;
    price: string;
    duration: string;
    image: string;
    quickLook: string;
    featured?: boolean;
    packageId?: string;
}

export interface Testimonial {
    quote: string;
    author: string;
}
