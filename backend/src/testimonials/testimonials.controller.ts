import { Controller, Get } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { Testimonial } from './schemas/testimonial.schema';

@Controller('testimonials')
export class TestimonialsController {
    constructor(private testimonialsService: TestimonialsService) { }

    @Get()
    async findAll(): Promise<Testimonial[]> {
        return this.testimonialsService.findAll();
    }
}
