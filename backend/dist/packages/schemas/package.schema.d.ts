import { Document } from 'mongoose';
export type PackageDocument = Package & Document;
export type SupportedLanguage = 'en' | 'de' | 'el';
export declare const SUPPORTED_LANGUAGES: SupportedLanguage[];
export declare const DEFAULT_LANGUAGE: SupportedLanguage;
export declare class TranslatedContent {
    title: string;
    description: string;
    quickLook: string;
}
export declare const TranslatedContentSchema: import("mongoose").Schema<TranslatedContent, import("mongoose").Model<TranslatedContent, any, any, any, Document<unknown, any, TranslatedContent, any, import("mongoose").DefaultSchemaOptions> & TranslatedContent & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any, TranslatedContent>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TranslatedContent, Document<unknown, {}, TranslatedContent, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TranslatedContent & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    title?: import("mongoose").SchemaDefinitionProperty<string, TranslatedContent, Document<unknown, {}, TranslatedContent, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TranslatedContent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, TranslatedContent, Document<unknown, {}, TranslatedContent, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TranslatedContent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    quickLook?: import("mongoose").SchemaDefinitionProperty<string, TranslatedContent, Document<unknown, {}, TranslatedContent, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TranslatedContent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, TranslatedContent>;
export declare class PackageTranslations {
    en: TranslatedContent;
    de?: TranslatedContent;
    el?: TranslatedContent;
}
export declare const PackageTranslationsSchema: import("mongoose").Schema<PackageTranslations, import("mongoose").Model<PackageTranslations, any, any, any, Document<unknown, any, PackageTranslations, any, import("mongoose").DefaultSchemaOptions> & PackageTranslations & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any, PackageTranslations>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PackageTranslations, Document<unknown, {}, PackageTranslations, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PackageTranslations & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    en?: import("mongoose").SchemaDefinitionProperty<TranslatedContent, PackageTranslations, Document<unknown, {}, PackageTranslations, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PackageTranslations & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    de?: import("mongoose").SchemaDefinitionProperty<TranslatedContent | undefined, PackageTranslations, Document<unknown, {}, PackageTranslations, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PackageTranslations & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    el?: import("mongoose").SchemaDefinitionProperty<TranslatedContent | undefined, PackageTranslations, Document<unknown, {}, PackageTranslations, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PackageTranslations & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, PackageTranslations>;
export declare class Partner {
    name: string;
    url: string;
}
export declare class ItineraryDayContent {
    title: string;
    items: string[];
}
export declare const ItineraryDayContentSchema: import("mongoose").Schema<ItineraryDayContent, import("mongoose").Model<ItineraryDayContent, any, any, any, Document<unknown, any, ItineraryDayContent, any, import("mongoose").DefaultSchemaOptions> & ItineraryDayContent & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any, ItineraryDayContent>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ItineraryDayContent, Document<unknown, {}, ItineraryDayContent, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ItineraryDayContent & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    title?: import("mongoose").SchemaDefinitionProperty<string, ItineraryDayContent, Document<unknown, {}, ItineraryDayContent, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ItineraryDayContent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    items?: import("mongoose").SchemaDefinitionProperty<string[], ItineraryDayContent, Document<unknown, {}, ItineraryDayContent, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ItineraryDayContent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ItineraryDayContent>;
export declare class ItineraryDayTranslations {
    en: ItineraryDayContent;
    de?: ItineraryDayContent;
    el?: ItineraryDayContent;
}
export declare const ItineraryDayTranslationsSchema: import("mongoose").Schema<ItineraryDayTranslations, import("mongoose").Model<ItineraryDayTranslations, any, any, any, Document<unknown, any, ItineraryDayTranslations, any, import("mongoose").DefaultSchemaOptions> & ItineraryDayTranslations & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any, ItineraryDayTranslations>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ItineraryDayTranslations, Document<unknown, {}, ItineraryDayTranslations, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ItineraryDayTranslations & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    en?: import("mongoose").SchemaDefinitionProperty<ItineraryDayContent, ItineraryDayTranslations, Document<unknown, {}, ItineraryDayTranslations, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ItineraryDayTranslations & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    de?: import("mongoose").SchemaDefinitionProperty<ItineraryDayContent | undefined, ItineraryDayTranslations, Document<unknown, {}, ItineraryDayTranslations, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ItineraryDayTranslations & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    el?: import("mongoose").SchemaDefinitionProperty<ItineraryDayContent | undefined, ItineraryDayTranslations, Document<unknown, {}, ItineraryDayTranslations, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<ItineraryDayTranslations & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ItineraryDayTranslations>;
export declare class ItineraryDay {
    day: string;
    translations?: ItineraryDayTranslations;
    title?: string;
    items?: string[];
}
export declare class DestinationInfo {
    title: string;
    dates: string;
    price: string;
    image: string;
    quickLook: string;
}
export declare class Package {
    id: string;
    name: string;
    translations?: PackageTranslations;
    dates?: string;
    price?: string;
    image?: string;
    destinationId?: string;
    destinationIds?: string[];
    includedServices: string[];
    destination?: DestinationInfo;
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
    translations?: import("mongoose").SchemaDefinitionProperty<PackageTranslations | undefined, Package, Document<unknown, {}, Package, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Package & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    dates?: import("mongoose").SchemaDefinitionProperty<string | undefined, Package, Document<unknown, {}, Package, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Package & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    price?: import("mongoose").SchemaDefinitionProperty<string | undefined, Package, Document<unknown, {}, Package, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Package & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    image?: import("mongoose").SchemaDefinitionProperty<string | undefined, Package, Document<unknown, {}, Package, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Package & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    destinationId?: import("mongoose").SchemaDefinitionProperty<string | undefined, Package, Document<unknown, {}, Package, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Package & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    destinationIds?: import("mongoose").SchemaDefinitionProperty<string[] | undefined, Package, Document<unknown, {}, Package, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Package & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    includedServices?: import("mongoose").SchemaDefinitionProperty<string[], Package, Document<unknown, {}, Package, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Package & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    destination?: import("mongoose").SchemaDefinitionProperty<DestinationInfo | undefined, Package, Document<unknown, {}, Package, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Package & {
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
export declare function getTranslatedContent(pkg: Package, language?: SupportedLanguage): TranslatedContent | null;
