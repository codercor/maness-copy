import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PackageDocument = Package & Document;

// Supported languages
export type SupportedLanguage = 'en' | 'de' | 'el';
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'de', 'el'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// Translated content for each language
@Schema({ _id: false })
export class TranslatedContent {
    @Prop({ required: true })
    title: string;

    @Prop({ default: '' })
    description: string;

    @Prop({ default: '' })
    quickLook: string;
}

export const TranslatedContentSchema = SchemaFactory.createForClass(TranslatedContent);

// Package translations map
@Schema({ _id: false })
export class PackageTranslations {
    @Prop({ type: TranslatedContentSchema, required: true })
    en: TranslatedContent;  // English is required (fallback)

    @Prop({ type: TranslatedContentSchema })
    de?: TranslatedContent;  // German (optional)

    @Prop({ type: TranslatedContentSchema })
    el?: TranslatedContent;  // Greek (optional)
}

export const PackageTranslationsSchema = SchemaFactory.createForClass(PackageTranslations);

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

// Legacy DestinationInfo (kept for backward compatibility during migration)
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

@Schema({ timestamps: true })
export class Package {
    @Prop({ required: true, unique: true })
    id: string;

    @Prop({ required: true })
    name: string;

    // Multi-language content
    @Prop({ type: PackageTranslationsSchema })
    translations?: PackageTranslations;

    // Non-translatable fields (same for all languages)
    @Prop()
    dates?: string;

    @Prop()
    price?: string;

    @Prop()
    image?: string;

    // Reference to a single gallery item (destination)
    @Prop()
    destinationId?: string;

    // Legacy field - kept for backward compatibility
    @Prop({ type: [String], default: [] })
    destinationIds?: string[];

    // Included services (e.g., Catering, Transportation, Accommodation)
    @Prop({ type: [String], default: [] })
    includedServices: string[];

    // Legacy destination field (for backward compatibility)
    @Prop({ type: DestinationInfo })
    destination?: DestinationInfo;

    @Prop({ type: [String], required: true })
    departures: string[];

    @Prop({ required: true })
    spots: number;

    @Prop({ type: Partner, required: true })
    partner: Partner;

    @Prop({ type: [ItineraryDay], required: true })
    itinerary: ItineraryDay[];

    @Prop({ default: true })
    showOnHomepage: boolean;

    @Prop({ default: false })
    isSelected: boolean;
}

export const PackageSchema = SchemaFactory.createForClass(Package);

// Helper function to get translated content with fallback to English
export function getTranslatedContent(
    pkg: Package,
    language: SupportedLanguage = 'en'
): TranslatedContent | null {
    if (!pkg.translations) {
        // Fallback to legacy destination if no translations
        if (pkg.destination) {
            return {
                title: pkg.destination.title,
                description: pkg.destination.quickLook,
                quickLook: pkg.destination.quickLook,
            };
        }
        return null;
    }

    // Try requested language, then fallback to English
    const content = pkg.translations[language] || pkg.translations.en;
    return content || null;
}
