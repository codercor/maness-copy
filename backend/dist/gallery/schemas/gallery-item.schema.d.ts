import { Document } from 'mongoose';
export type GalleryItemDocument = GalleryItem & Document;
export type SupportedLanguage = 'en' | 'de' | 'el';
export declare const SUPPORTED_LANGUAGES: SupportedLanguage[];
export declare const DEFAULT_LANGUAGE: SupportedLanguage;
export declare class GalleryTranslatedContent {
    title: string;
    description: string;
    quickLook: string;
}
export declare const GalleryTranslatedContentSchema: import("mongoose").Schema<GalleryTranslatedContent, import("mongoose").Model<GalleryTranslatedContent, any, any, any, Document<unknown, any, GalleryTranslatedContent, any, import("mongoose").DefaultSchemaOptions> & GalleryTranslatedContent & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any, GalleryTranslatedContent>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, GalleryTranslatedContent, Document<unknown, {}, GalleryTranslatedContent, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<GalleryTranslatedContent & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    title?: import("mongoose").SchemaDefinitionProperty<string, GalleryTranslatedContent, Document<unknown, {}, GalleryTranslatedContent, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<GalleryTranslatedContent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, GalleryTranslatedContent, Document<unknown, {}, GalleryTranslatedContent, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<GalleryTranslatedContent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    quickLook?: import("mongoose").SchemaDefinitionProperty<string, GalleryTranslatedContent, Document<unknown, {}, GalleryTranslatedContent, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<GalleryTranslatedContent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, GalleryTranslatedContent>;
export declare class GalleryTranslations {
    en: GalleryTranslatedContent;
    de?: GalleryTranslatedContent;
    el?: GalleryTranslatedContent;
}
export declare const GalleryTranslationsSchema: import("mongoose").Schema<GalleryTranslations, import("mongoose").Model<GalleryTranslations, any, any, any, Document<unknown, any, GalleryTranslations, any, import("mongoose").DefaultSchemaOptions> & GalleryTranslations & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any, GalleryTranslations>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, GalleryTranslations, Document<unknown, {}, GalleryTranslations, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<GalleryTranslations & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    en?: import("mongoose").SchemaDefinitionProperty<GalleryTranslatedContent, GalleryTranslations, Document<unknown, {}, GalleryTranslations, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<GalleryTranslations & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    de?: import("mongoose").SchemaDefinitionProperty<GalleryTranslatedContent | undefined, GalleryTranslations, Document<unknown, {}, GalleryTranslations, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<GalleryTranslations & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    el?: import("mongoose").SchemaDefinitionProperty<GalleryTranslatedContent | undefined, GalleryTranslations, Document<unknown, {}, GalleryTranslations, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<GalleryTranslations & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, GalleryTranslations>;
export declare class GalleryItem {
    translations?: GalleryTranslations;
    title: string;
    description: string;
    duration: string;
    image: string;
    quickLook: string;
    featured: boolean;
    price?: string;
    packageId?: string;
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
    translations?: import("mongoose").SchemaDefinitionProperty<GalleryTranslations | undefined, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<GalleryItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
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
    price?: import("mongoose").SchemaDefinitionProperty<string | undefined, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<GalleryItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    packageId?: import("mongoose").SchemaDefinitionProperty<string | undefined, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<GalleryItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, GalleryItem>;
export declare function getGalleryTranslatedContent(item: GalleryItem, language?: SupportedLanguage): {
    title: string;
    description: string;
    quickLook: string;
};
