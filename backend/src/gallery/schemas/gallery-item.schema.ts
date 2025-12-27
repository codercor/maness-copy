import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GalleryItemDocument = GalleryItem & Document;

@Schema({ timestamps: true })
export class GalleryItem {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    // Duration of typical trip to this destination
    @Prop({ required: true })
    duration: string;

    @Prop({ required: true })
    image: string;

    @Prop({ required: true })
    quickLook: string;

    @Prop({ default: false })
    featured: boolean;

    // Legacy field - kept for backward compatibility
    // Prices are now on packages, not destinations
    @Prop()
    price?: string;

    // Legacy field - kept for backward compatibility
    @Prop()
    packageId?: string;
}

export const GalleryItemSchema = SchemaFactory.createForClass(GalleryItem);
