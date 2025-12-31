// Hero Carousel Types
export type SupportedLanguage = 'en' | 'de' | 'el';

export interface HeroSlideTranslatedContent {
    label: string;
    title: string;
    highlight: string;
    subhead: string;
    primaryCta: string;
    secondaryCta: string;
}

export interface HeroSlideTranslations {
    en: HeroSlideTranslatedContent;
    de?: HeroSlideTranslatedContent;
    el?: HeroSlideTranslatedContent;
}

export interface HeroSlide {
    _id?: string;
    imageUrl: string;
    translations: HeroSlideTranslations;
    order: number;
    transitionDuration: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Helper to get translated content with fallback
export function getHeroSlideContent(
    slide: HeroSlide,
    language: SupportedLanguage = 'en'
): HeroSlideTranslatedContent {
    return slide.translations[language] || slide.translations.en;
}
