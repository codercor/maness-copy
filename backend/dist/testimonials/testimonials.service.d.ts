import { Model } from 'mongoose';
import { Testimonial, TestimonialDocument } from './schemas/testimonial.schema';
export declare class TestimonialsService {
    private testimonialModel;
    constructor(testimonialModel: Model<TestimonialDocument>);
    findAll(): Promise<Testimonial[]>;
    seed(items: Partial<Testimonial>[]): Promise<void>;
}
