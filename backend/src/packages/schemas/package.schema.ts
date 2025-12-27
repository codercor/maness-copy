import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PackageDocument = Package & Document;

@Schema()
export class DestinationInfo {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    dates: string;

    @Prop({ required: true })
    price: string;

    @Prop({ required: true })
    image: string;

    @Prop({ required: true })
    quickLook: string;
}

@Schema()
export class Partner {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    url: string;
}

@Schema()
export class ItineraryDay {
    @Prop({ required: true })
    day: string;

    @Prop({ required: true })
    title: string;

    @Prop({ type: [String], required: true })
    items: string[];
}

@Schema({ timestamps: true })
export class Package {
    @Prop({ required: true, unique: true })
    id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ type: DestinationInfo, required: true })
    destination: DestinationInfo;

    @Prop({ type: [String], required: true })
    departures: string[];

    @Prop({ required: true })
    spots: number;

    @Prop({ type: Partner, required: true })
    partner: Partner;

    @Prop({ type: [ItineraryDay], required: true })
    itinerary: ItineraryDay[];
}

export const PackageSchema = SchemaFactory.createForClass(Package);
