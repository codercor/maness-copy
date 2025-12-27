import { Document } from 'mongoose';
export type PackageDocument = Package & Document;
export declare class DestinationInfo {
    title: string;
    dates: string;
    price: string;
    image: string;
    quickLook: string;
}
export declare class Partner {
    name: string;
    url: string;
}
export declare class ItineraryDay {
    day: string;
    title: string;
    items: string[];
}
export declare class Package {
    id: string;
    name: string;
    destination: DestinationInfo;
    departures: string[];
    spots: number;
    partner: Partner;
    itinerary: ItineraryDay[];
    showOnHomepage: boolean;
    isSelected: boolean;
}
export declare const PackageSchema: import("mongoose").Schema<Package, import("mongoose").Model<Package, any, any, any, Document<unknown, any, Package, any, import("mongoose").DefaultSchemaOptions> & Package & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any, Package>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Package, Document<unknown, {}, Package, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Package & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, {
    id?: import("mongoose").SchemaDefinitionProperty<string, Package, Document<unknown, {}, Package, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Package & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Package, Document<unknown, {}, Package, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Package & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    destination?: import("mongoose").SchemaDefinitionProperty<DestinationInfo, Package, Document<unknown, {}, Package, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Package & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    departures?: import("mongoose").SchemaDefinitionProperty<string[], Package, Document<unknown, {}, Package, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Package & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    spots?: import("mongoose").SchemaDefinitionProperty<number, Package, Document<unknown, {}, Package, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Package & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    partner?: import("mongoose").SchemaDefinitionProperty<Partner, Package, Document<unknown, {}, Package, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Package & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    itinerary?: import("mongoose").SchemaDefinitionProperty<ItineraryDay[], Package, Document<unknown, {}, Package, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Package & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    showOnHomepage?: import("mongoose").SchemaDefinitionProperty<boolean, Package, Document<unknown, {}, Package, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Package & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    isSelected?: import("mongoose").SchemaDefinitionProperty<boolean, Package, Document<unknown, {}, Package, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Package & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
}, Package>;
