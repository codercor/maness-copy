import { Language } from './translations';

// Supported languages
export type SupportedLanguage = Language;
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// Translated content for each language
export interface TranslatedContent {
    title: string;
    description: string;
    quickLook: string;
}

// Package translations map
export interface PackageTranslations {
    en: TranslatedContent;   // English is required (fallback)
    de?: TranslatedContent;  // German (optional)
    el?: TranslatedContent;  // Greek (optional)
}

// Legacy destination info (for backward compatibility)
export interface DestinationInfo {
    title: string;
    dates: string;
    price: string;
    image: string;
    quickLook: string;
}

// Itinerary day translatable content
export interface ItineraryDayContent {
    title: string;
    items: string[];
}

// Itinerary day translations map
export interface ItineraryDayTranslations {
    en: ItineraryDayContent;   // English is required (fallback)
    de?: ItineraryDayContent;  // German (optional)
    el?: ItineraryDayContent;  // Greek (optional)
}

export interface ItineraryDay {
    day: string;
    // Multi-language content
    translations?: ItineraryDayTranslations;
    // Legacy fields (kept for backward compatibility)
    title?: string;
    items?: string[];
}

export interface Partner {
    name: string;
    url: string;
}

export interface Package {
    id: PackageId;
    name: string;

    // Multi-language content
    translations?: PackageTranslations;

    // Non-translatable fields (same for all languages)
    dates?: string;
    price?: string;
    image?: string;

    // Reference to single gallery item (destination)
    destinationId?: string;

    // Legacy field - kept for backward compatibility
    destinationIds?: string[];

    // Included services
    includedServices?: string[];

    // Legacy destination field (for backward compatibility)
    destination?: DestinationInfo;

    departures: string[];
    spots: number;
    partner: Partner;
    itinerary: ItineraryDay[];
    showOnHomepage?: boolean;
    isSelected?: boolean;
}

// Predefined included services options
export const INCLUDED_SERVICES = [
    { id: 'accommodation', label: 'Accommodation', icon: 'hotel' },
    { id: 'catering', label: 'Catering', icon: 'restaurant' },
    { id: 'transportation', label: 'Transportation', icon: 'directions_car' },
    { id: 'flights', label: 'Flights', icon: 'flight' },
    { id: 'activities', label: 'Activities', icon: 'hiking' },
    { id: 'guide', label: 'Tour Guide', icon: 'person' },
    { id: 'insurance', label: 'Travel Insurance', icon: 'shield' },
    { id: 'transfers', label: 'Airport Transfers', icon: 'airport_shuttle' },
];

export type PackageId = string;

export type PackageDetails = Record<PackageId, Package>;



// Legacy type for backwards compatibility
export type Destination = DestinationInfo & { packageId: string };

// Helper function to get translated content with fallback
export function getTranslatedContent(
    pkg: Package,
    language: SupportedLanguage = 'en'
): TranslatedContent | null {
    if (pkg.translations) {
        // Try requested language, then fallback to English
        const content = pkg.translations[language] || pkg.translations.en;
        return content || null;
    }

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

// Helper to get package display fields in a specific language
export function getPackageDisplay(pkg: Package, language: SupportedLanguage = 'en') {
    const content = getTranslatedContent(pkg, language);

    return {
        title: content?.title || pkg.name,
        description: content?.description || '',
        quickLook: content?.quickLook || '',
        dates: pkg.dates || pkg.destination?.dates || '',
        price: pkg.price || pkg.destination?.price || '',
        image: pkg.image || pkg.destination?.image || '',
    };
}
