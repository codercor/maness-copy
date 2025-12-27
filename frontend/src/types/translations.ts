export type Language = 'en' | 'de' | 'el';

export interface LanguageOption {
    id: Language;
    label: string;
}

export interface NavTranslations {
    destinations: string;
    packages: string;
    experience: string;
    community: string;
    about: string;
    contact: string;
}

export interface HeaderTranslations {
    signIn: string;
    signOut: string;
    findEscape: string;
    languageLabel: string;
}

export interface HeroTranslations {
    label: string;
    title: string;
    highlight: string;
    subhead: string;
    primaryCta: string;
    secondaryCta: string;
    scroll: string;
}

export interface OfferCard {
    title: string;
    text: string;
}

export interface OffersTranslations {
    label: string;
    title: string;
    subtitle: string;
    cards: OfferCard[];
}

export interface DestinationsTranslations {
    label: string;
    title: string;
    viewAll: string;
    quickLook: string;
    description: string;
    startingAt: string;
    viewPlan: string;
    selected: string;
}

export interface GalleryTranslations {
    label: string;
    title: string;
    subtitle: string;
    quickLook: string;
    startingFrom: string;
    viewDetails: string;
    viewAll: string;
}

export interface ServiceItem {
    title: string;
    text: string;
}

export interface ItineraryTranslations {
    label: string;
    title: string;
    subtitle: string;
    includedTitle: string;
    services: ServiceItem[];
}

export interface BookingTranslations {
    total: string;
    perPerson: string;
    tripWindow: string;
    onlySpots: string;
    whatsIncluded: string;
    bookNow: string;
    selectedDeparture: string;
    redirectNote: string;
    freeCancel: string;
    noFees: string;
    trustTitle: string;
    trustItems: string[];
}

export interface CommunityTranslations {
    label: string;
    title: string;
    subtitle: string;
    personas: string[];
    testimonialsLabel: string;
    play: string;
    pause: string;
}

export interface FooterTranslations {
    explore: string;
    resources: string;
    terms: string;
    privacy: string;
    legal: string;
    about: string;
    contact: string;
    cleaning: string;
    brandLine: string;
    phase4: string;
    join: string;
    rights: string;
    closing: string;
}

export interface NewsletterTranslations {
    label: string;
    title: string;
    subtitle: string;
    placeholder: string;
    button: string;
    success: string;
    invalid: string;
}

export interface AffiliateTranslations {
    label: string;
    title: string;
    description: string;
    descriptionSuffix: string;
    stay: string;
    continue: string;
}

export interface MiniSummaryTranslations {
    label: string;
    from: string;
}

export interface UserAuthTranslations {
    label: string;
    title: string;
    subtitle: string;
    google: string;
    note: string;
}

export interface AboutTranslations {
    title: string;
    subtitle: string;
    content: string[];
}

export interface ContactTranslations {
    title: string;
    subtitle: string;
    form: {
        name: string;
        email: string;
        message: string;
        submit: string;
        success: string;
    };
    info: {
        email: string;
        phone: string;
    };
}

export interface LegalTranslations {
    termsTitle: string;
    privacyTitle: string;
}

export interface CookieTranslations {
    message: string;
    accept: string;
    decline: string;
}

export interface Translations {
    nav: NavTranslations;
    header: HeaderTranslations;
    hero: HeroTranslations;
    offers: OffersTranslations;
    destinations: DestinationsTranslations;
    gallery: GalleryTranslations;
    itinerary: ItineraryTranslations;
    booking: BookingTranslations;
    community: CommunityTranslations;
    footer: FooterTranslations;
    newsletter: NewsletterTranslations;
    affiliate: AffiliateTranslations;
    miniSummary: MiniSummaryTranslations;
    userAuth: UserAuthTranslations;
    about: AboutTranslations;
    contact: ContactTranslations;
    legal: LegalTranslations;
    cookie: CookieTranslations;
}

export interface DestinationContentTranslation {
    title?: string;
    quickLook?: string;
}

export interface PackageContentTranslation {
    name?: string;
    partnerName?: string;
    itinerary?: { title?: string; items?: string[] }[];
}

export interface GalleryContentTranslation {
    title?: string;
    description?: string;
    duration?: string;
    quickLook?: string;
}

export interface ContentTranslations {
    destinations?: Record<string, DestinationContentTranslation>;
    packages?: Record<string, PackageContentTranslation>;
    gallery?: Record<string, GalleryContentTranslation>;
    testimonials?: { quote?: string; author?: string }[];
}

export type AllTranslations = Record<Language, Translations>;
export type AllContentTranslations = Record<Exclude<Language, 'en'>, ContentTranslations>;
