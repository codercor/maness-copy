import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TestimonialDocument = Testimonial & Document;

@Schema({ timestamps: true })
export class Testimonial {
    @Prop({ required: true })
    quote: string;

    @Prop({ required: true })
    author: string;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
