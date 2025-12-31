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
    en: HeroSlideTranslatedContent;  // English (required)
    de?: HeroSlideTranslatedContent; // German (optional)
    el?: HeroSlideTranslatedContent; // Greek (optional)
}

// Transition types
export type TransitionType = 'fade' | 'crossfade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'zoom-in' | 'zoom-out' | 'blur' | 'typing';

export const TRANSITION_OPTIONS: { value: TransitionType; label: string }[] = [
    { value: 'fade', label: 'Fade' },
    { value: 'crossfade', label: 'Crossfade (Default)' },
    { value: 'slide-up', label: 'Slide Up' },
    { value: 'slide-down', label: 'Slide Down' },
    { value: 'slide-left', label: 'Slide Left' },
    { value: 'slide-right', label: 'Slide Right' },
    { value: 'zoom-in', label: 'Zoom In' },
    { value: 'zoom-out', label: 'Zoom Out' },
    { value: 'blur', label: 'Blur Transition' },
    { value: 'typing', label: 'Typing Animation' },
];

export interface HeroSlide {
    _id?: string;
    imageUrl: string;
    translations: HeroSlideTranslations;
    order: number;
    transitionDuration: number;
    transitionType: TransitionType;
    textTransitionType: TransitionType;
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
