import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GalleryItemDocument = GalleryItem & Document;

// Supported languages (same as packages)
export type SupportedLanguage = 'en' | 'de' | 'el';
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'de', 'el'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// Translated content for each language
@Schema({ _id: false })
export class GalleryTranslatedContent {
    @Prop({ required: true })
    title: string;

    @Prop({ default: '' })
    description: string;

    @Prop({ default: '' })
    quickLook: string;
}

export const GalleryTranslatedContentSchema = SchemaFactory.createForClass(GalleryTranslatedContent);

// Gallery translations map
@Schema({ _id: false })
export class GalleryTranslations {
    @Prop({ type: GalleryTranslatedContentSchema, required: true })
    en: GalleryTranslatedContent;  // English is required (fallback)

    @Prop({ type: GalleryTranslatedContentSchema })
    de?: GalleryTranslatedContent;  // German (optional)

    @Prop({ type: GalleryTranslatedContentSchema })
    el?: GalleryTranslatedContent;  // Greek (optional)
}

export const GalleryTranslationsSchema = SchemaFactory.createForClass(GalleryTranslations);

@Schema({ timestamps: true })
export class GalleryItem {
    // Multi-language content
    @Prop({ type: GalleryTranslationsSchema })
    translations?: GalleryTranslations;

    // Legacy fields - kept for backward compatibility
    @Prop({ required: false })
    title: string;

    @Prop({ required: false })
    description: string;

    // Duration of typical trip to this destination (not translatable)
    @Prop({ required: true })
    duration: string;

    @Prop({ required: true })
    image: string;

    // Legacy field - kept for backward compatibility
    @Prop({ required: false })
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

// Helper function to get translated content with fallback to legacy fields
export function getGalleryTranslatedContent(
    item: GalleryItem,
    language: SupportedLanguage = 'en'
): { title: string; description: string; quickLook: string } {
    if (item.translations) {
        const content = item.translations[language] || item.translations.en;
        if (content) {
            return {
                title: content.title,
                description: content.description || '',
                quickLook: content.quickLook || '',
            };
        }
    }

    // Fallback to legacy fields
    return {
        title: item.title || '',
        description: item.description || '',
        quickLook: item.quickLook || '',
    };
}
