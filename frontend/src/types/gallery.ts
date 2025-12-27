export interface GalleryItem {
    title: string;
    description: string;
    price: string;
    duration: string;
    image: string;
    quickLook: string;
    featured?: boolean;
}

export interface Testimonial {
    quote: string;
    author: string;
}
