import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HeroSlideDocument = HeroSlide & Document;

// Supported languages (matching existing system)
export type SupportedLanguage = 'en' | 'de' | 'el';
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'de', 'el'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// Translated content for each hero slide
@Schema({ _id: false })
export class HeroSlideTranslatedContent {
    @Prop({ required: true })
    label: string; // e.g., "MenEscape — The Gateway"

    @Prop({ required: true })
    title: string; // e.g., "Your body. Your rules."

    @Prop({ required: true })
    highlight: string; // e.g., "Your getaway."

    @Prop({ required: true })
    subhead: string; // e.g., "We create spaces for..."

    @Prop({ required: true })
    primaryCta: string; // e.g., "Explore Destinations"

    @Prop({ required: true })
    secondaryCta: string; // e.g., "View Packages"
}

export const HeroSlideTranslatedContentSchema = SchemaFactory.createForClass(HeroSlideTranslatedContent);

// Hero slide translations map
@Schema({ _id: false })
export class HeroSlideTranslations {
    @Prop({ type: HeroSlideTranslatedContentSchema, required: true })
    en: HeroSlideTranslatedContent; // English is required (fallback)

    @Prop({ type: HeroSlideTranslatedContentSchema })
    de?: HeroSlideTranslatedContent; // German (optional)

    @Prop({ type: HeroSlideTranslatedContentSchema })
    el?: HeroSlideTranslatedContent; // Greek (optional)
}

export const HeroSlideTranslationsSchema = SchemaFactory.createForClass(HeroSlideTranslations);

// Available transition types
export type TransitionType = 'fade' | 'crossfade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'zoom-in' | 'zoom-out' | 'blur' | 'typing';
export const TRANSITION_TYPES: TransitionType[] = ['fade', 'crossfade', 'slide-left', 'slide-right', 'slide-up', 'slide-down', 'zoom-in', 'zoom-out', 'blur', 'typing'];

@Schema({ timestamps: true })
export class HeroSlide {
    @Prop({ required: true })
    imageUrl: string; // Path to the hero image

    @Prop({ type: HeroSlideTranslationsSchema, required: true })
    translations: HeroSlideTranslations;

    @Prop({ required: true, default: 0 })
    order: number; // Display order (lower = first)

    @Prop({ default: 5000 })
    transitionDuration: number; // Duration in milliseconds

    @Prop({ default: 'crossfade' })
    transitionType: TransitionType; // Type of transition effect for image

    @Prop({ default: 'fade' })
    textTransitionType: TransitionType; // Type of transition effect for text

    @Prop({ default: true })
    isActive: boolean; // Whether this slide is active/visible
}

export const HeroSlideSchema = SchemaFactory.createForClass(HeroSlide);

// Helper function to get translated content with fallback to English
export function getHeroSlideTranslatedContent(
    slide: HeroSlide,
    language: SupportedLanguage = 'en'
): HeroSlideTranslatedContent {
    // Try requested language, then fallback to English
    const content = slide.translations[language] || slide.translations.en;
    return content;
}
