import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial, TestimonialDocument } from './schemas/testimonial.schema';

@Injectable()
export class TestimonialsService {
    constructor(
        @InjectModel(Testimonial.name) private testimonialModel: Model<TestimonialDocument>,
    ) { }

    async findAll(): Promise<Testimonial[]> {
        return this.testimonialModel.find().exec();
    }

    async seed(items: Partial<Testimonial>[]): Promise<void> {
        const count = await this.testimonialModel.countDocuments().exec();
        if (count === 0 && items.length > 0) {
            await this.testimonialModel.insertMany(items);
        }
    }
}
