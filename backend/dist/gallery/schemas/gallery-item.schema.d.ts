import { Document } from 'mongoose';
export type GalleryItemDocument = GalleryItem & Document;
export declare class GalleryItem {
    title: string;
    description: string;
    price: string;
    duration: string;
    image: string;
    quickLook: string;
    featured: boolean;
}
export declare const GalleryItemSchema: import("mongoose").Schema<GalleryItem, import("mongoose").Model<GalleryItem, any, any, any, Document<unknown, any, GalleryItem, any, import("mongoose").DefaultSchemaOptions> & GalleryItem & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any, GalleryItem>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, GalleryItem, Document<unknown, {}, GalleryItem, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<GalleryItem & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    title?: import("mongoose").SchemaDefinitionProperty<string, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<GalleryItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<GalleryItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    price?: import("mongoose").SchemaDefinitionProperty<string, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<GalleryItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    duration?: import("mongoose").SchemaDefinitionProperty<string, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<GalleryItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    image?: import("mongoose").SchemaDefinitionProperty<string, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<GalleryItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    quickLook?: import("mongoose").SchemaDefinitionProperty<string, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<GalleryItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    featured?: import("mongoose").SchemaDefinitionProperty<boolean, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<GalleryItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, GalleryItem>;
