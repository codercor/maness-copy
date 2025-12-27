import { TestimonialsService } from './testimonials.service';
import { Testimonial } from './schemas/testimonial.schema';
export declare class TestimonialsController {
    private testimonialsService;
    constructor(testimonialsService: TestimonialsService);
    findAll(): Promise<Testimonial[]>;
}
