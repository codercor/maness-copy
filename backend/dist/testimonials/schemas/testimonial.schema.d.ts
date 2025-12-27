import { Document } from 'mongoose';
export type TestimonialDocument = Testimonial & Document;
export declare class Testimonial {
    quote: string;
    author: string;
}
export declare const TestimonialSchema: import("mongoose").Schema<Testimonial, import("mongoose").Model<Testimonial, any, any, any, Document<unknown, any, Testimonial, any, import("mongoose").DefaultSchemaOptions> & Testimonial & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any, Testimonial>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Testimonial, Document<unknown, {}, Testimonial, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Testimonial & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    quote?: import("mongoose").SchemaDefinitionProperty<string, Testimonial, Document<unknown, {}, Testimonial, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Testimonial & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    author?: import("mongoose").SchemaDefinitionProperty<string, Testimonial, Document<unknown, {}, Testimonial, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Testimonial & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Testimonial>;
