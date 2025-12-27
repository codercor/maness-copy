import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GalleryItemDocument = GalleryItem & Document;

@Schema({ timestamps: true })
export class GalleryItem {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: string;

    @Prop({ required: true })
    duration: string;

    @Prop({ required: true })
    image: string;

    @Prop({ required: true })
    quickLook: string;

    @Prop({ default: false })
    featured: boolean;
}

export const GalleryItemSchema = SchemaFactory.createForClass(GalleryItem);
