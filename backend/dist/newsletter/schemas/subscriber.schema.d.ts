import { Document } from 'mongoose';
export type SubscriberDocument = Subscriber & Document;
export declare class Subscriber {
    email: string;
    active: boolean;
    source: string;
}
export declare const SubscriberSchema: import("mongoose").Schema<Subscriber, import("mongoose").Model<Subscriber, any, any, any, Document<unknown, any, Subscriber, any, import("mongoose").DefaultSchemaOptions> & Subscriber & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any, Subscriber>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Subscriber, Document<unknown, {}, Subscriber, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Subscriber & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    email?: import("mongoose").SchemaDefinitionProperty<string, Subscriber, Document<unknown, {}, Subscriber, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Subscriber & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    active?: import("mongoose").SchemaDefinitionProperty<boolean, Subscriber, Document<unknown, {}, Subscriber, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Subscriber & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    source?: import("mongoose").SchemaDefinitionProperty<string, Subscriber, Document<unknown, {}, Subscriber, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Subscriber & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Subscriber>;
