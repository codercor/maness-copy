import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Schemas
const TranslatedContentSchema = new mongoose.Schema({
    title: String,
    description: String,
    quickLook: String,
}, { _id: false });

const PackageTranslationsSchema = new mongoose.Schema({
    en: { type: TranslatedContentSchema, required: true },
    de: TranslatedContentSchema,
    el: TranslatedContentSchema,
}, { _id: false });

const GalleryTranslationsSchema = new mongoose.Schema({
    en: { type: TranslatedContentSchema, required: true },
    de: TranslatedContentSchema,
    el: TranslatedContentSchema,
}, { _id: false });

const PartnerSchema = new mongoose.Schema({
    name: String,
    url: String,
}, { _id: false });

const ItineraryDayContentSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    items: { type: [String], default: [] },
}, { _id: false });

const ItineraryDayTranslationsSchema = new mongoose.Schema({
    en: { type: ItineraryDayContentSchema, required: true },
    de: ItineraryDayContentSchema,
    el: ItineraryDayContentSchema,
}, { _id: false });

const ItineraryDaySchema = new mongoose.Schema({
    day: { type: String, required: true },
    translations: { type: ItineraryDayTranslationsSchema },
    // Legacy fields
    title: String,
    items: [String],
});

const PackageSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: String,
    translations: PackageTranslationsSchema,
    dates: String,
    price: String,
    image: String,
    destinationIds: { type: [String], default: [] },
    departures: [String],
    spots: Number,
    partner: { type: PartnerSchema, required: true },
    itinerary: [ItineraryDaySchema],
    showOnHomepage: { type: Boolean, default: true },
    isSelected: { type: Boolean, default: false },
}, { timestamps: true });

const GalleryItemSchema = new mongoose.Schema({
    translations: GalleryTranslationsSchema,
    title: String,
    description: String,
    price: String,
    duration: String,
    image: String,
    quickLook: String,
    featured: { type: Boolean, default: false },
    packageId: String,
}, { timestamps: true });

const TestimonialSchema = new mongoose.Schema({
    quote: String,
    author: String,
}, { timestamps: true });

// Hero Slide Schema
const HeroSlideTranslatedContentSchema = new mongoose.Schema({
    label: String,
    title: String,
    highlight: String,
    subhead: String,
    primaryCta: String,
    secondaryCta: String,
}, { _id: false });

const HeroSlideTranslationsSchema = new mongoose.Schema({
    en: { type: HeroSlideTranslatedContentSchema, required: true },
    de: HeroSlideTranslatedContentSchema,
    el: HeroSlideTranslatedContentSchema,
}, { _id: false });

const HeroSlideSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    translations: { type: HeroSlideTranslationsSchema, required: true },
    order: { type: Number, required: true, default: 0 },
    transitionDuration: { type: Number, default: 5000 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Package = mongoose.model('Package', PackageSchema);
const GalleryItem = mongoose.model('GalleryItem', GalleryItemSchema);
const Testimonial = mongoose.model('Testimonial', TestimonialSchema);
const HeroSlide = mongoose.model('HeroSlide', HeroSlideSchema);

// ========================================
// PACKAGES - 4 main travel packages
// ========================================
const initialPackages = {
    mykonos: {
        id: "mykonos",
        name: "Mykonos Adventure",
        translations: {
            en: {
                title: "Mykonos, Greece",
                description: "Experience the iconic white-washed buildings and vibrant nightlife of this legendary Greek island. Explore beautiful beaches, charming streets, and unforgettable sunsets.",
                quickLook: "Paradise beaches & legendary nightlife"
            },
            de: {
                title: "Mykonos, Griechenland",
                description: "Erleben Sie die ikonischen weißgetünchten Gebäude und das pulsierende Nachtleben dieser legendären griechischen Insel.",
                quickLook: "Paradiesische Strände & legendäres Nachtleben"
            },
            el: {
                title: "Μύκονος, Ελλάδα",
                description: "Ζήστε τα εμβληματικά ασβεστωμένα κτίρια και τη ζωντανή νυχτερινή ζωή αυτού του θρυλικού ελληνικού νησιού.",
                quickLook: "Παραδεισένιες παραλίες & θρυλική νυχτερινή ζωή"
            }
        },
        dates: "June 15-22, 2025",
        price: "€2,499",
        image: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=800",
        destinationIds: [],
        departures: ["2025-06-15", "2025-07-20", "2025-08-10"],
        spots: 8,
        partner: { name: "Greek Escapes", url: "https://example.com/mykonos?aff=menescape" },
        itinerary: [
            {
                day: "01",
                translations: {
                    en: { title: "Arrival & Welcome", items: ["VIP Airport pickup", "Check-in at luxury villa", "Welcome sunset dinner"] },
                    de: { title: "Ankunft & Willkommen", items: ["VIP-Flughafenabholung", "Check-in in der Luxusvilla", "Willkommens-Abendessen bei Sonnenuntergang"] },
                    el: { title: "Άφιξη & Καλωσόρισμα", items: ["VIP παραλαβή από αεροδρόμιο", "Check-in σε πολυτελή βίλα", "Δείπνο καλωσορίσματος στο ηλιοβασίλεμα"] }
                }
            },
            {
                day: "02",
                translations: {
                    en: { title: "Beach & Chill", items: ["Super Paradise Beach Club", "Private cabana reservation", "Evening cocktail mixer"] },
                    de: { title: "Strand & Entspannung", items: ["Super Paradise Beach Club", "Private Cabana-Reservierung", "Abendlicher Cocktail-Mixer"] },
                    el: { title: "Παραλία & Χαλάρωση", items: ["Super Paradise Beach Club", "Κράτηση ιδιωτικής καμπάνας", "Βραδινό κοκτέιλ πάρτι"] }
                }
            },
            {
                day: "03",
                translations: {
                    en: { title: "Town Exploration", items: ["Guided tour of Mykonos Town", "Shopping in Matogianni", "Dinner at Interni"] },
                    de: { title: "Stadterkundung", items: ["Führung durch Mykonos-Stadt", "Shopping in Matogianni", "Abendessen im Interni"] },
                    el: { title: "Εξερεύνηση Πόλης", items: ["Ξενάγηση στη Χώρα της Μυκόνου", "Ψώνια στα Ματογιάννια", "Δείπνο στο Interni"] }
                }
            },
            {
                day: "04",
                translations: {
                    en: { title: "Catamaran Cruise", items: ["Private catamaran to Delos", "Snorkeling and lunch onboard", "Sunset champagne toast"] },
                    de: { title: "Katamaran-Kreuzfahrt", items: ["Privater Katamaran nach Delos", "Schnorcheln und Mittagessen an Bord", "Champagner-Toast bei Sonnenuntergang"] },
                    el: { title: "Κρουαζιέρα με Καταμαράν", items: ["Ιδιωτικό καταμαράν για Δήλο", "Κολύμπι με αναπνευστήρα και γεύμα", "Πρόποση με σαμπάνια στο ηλιοβασίλεμα"] }
                }
            }
        ]
    },
    ibiza: {
        id: "ibiza",
        name: "Ibiza Experience",
        translations: {
            en: {
                title: "Ibiza, Spain",
                description: "Discover the magic of Ibiza with world-famous clubs, stunning beaches, and breathtaking sunsets. From rave to relaxation.",
                quickLook: "World-class clubs & crystal waters"
            },
            de: {
                title: "Ibiza, Spanien",
                description: "Entdecken Sie die Magie Ibizas mit weltberühmten Clubs, atemberaubenden Stränden und unvergesslichen Sonnenuntergängen.",
                quickLook: "Weltklasse-Clubs & kristallklares Wasser"
            },
            el: {
                title: "Ίμπιζα, Ισπανία",
                description: "Ανακαλύψτε τη μαγεία της Ίμπιζα με τα παγκοσμίως φημισμένα κλαμπ και τις εκπληκτικές παραλίες.",
                quickLook: "Κλαμπ παγκόσμιας κλάσης & κρυστάλλινα νερά"
            }
        },
        dates: "July 10-17, 2025",
        price: "€2,199",
        image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800",
        destinationIds: [],
        departures: ["2025-07-10", "2025-08-15"],
        spots: 5,
        partner: { name: "Ibiza Vibes", url: "https://example.com/ibiza?aff=menescape" },
        itinerary: [
            {
                day: "01",
                translations: {
                    en: { title: "Hola Ibiza", items: ["Private transfer to Finca", "Poolside welcome drinks", "Dinner at Old Town"] },
                    de: { title: "Hola Ibiza", items: ["Privattransfer zur Finca", "Willkommensdrinks am Pool", "Abendessen in der Altstadt"] },
                    el: { title: "Hola Ίμπιζα", items: ["Ιδιωτική μεταφορά στη Finca", "Ποτά καλωσορίσματος στην πισίνα", "Δείπνο στην Παλιά Πόλη"] }
                }
            },
            {
                day: "02",
                translations: {
                    en: { title: "Formentera Day Trip", items: ["Ferry to Formentera", "Bike rental & beach hopping", "Sunset at Beso Beach"] },
                    de: { title: "Tagesausflug Formentera", items: ["Fähre nach Formentera", "Fahrradverleih & Strand-Hopping", "Sonnenuntergang am Beso Beach"] },
                    el: { title: "Ημερήσια εκδρομή Φορμεντέρα", items: ["Πλοίο για Φορμεντέρα", "Ενοικίαση ποδηλάτου & παραλίες", "Ηλιοβασίλεμα στο Beso Beach"] }
                }
            },
            {
                day: "03",
                translations: {
                    en: { title: "Club Night", items: ["Pre-party at villa", "VIP entry to Hï Ibiza", "Sunrise chillout"] },
                    de: { title: "Club-Nacht", items: ["Pre-Party in der Villa", "VIP-Eintritt ins Hï Ibiza", "Sonnenaufgangs-Chillout"] },
                    el: { title: "Βραδιά Clubbing", items: ["Pre-party στη βίλα", "VIP είσοδος στο Hï Ibiza", "Χαλάρωση με την ανατολή"] }
                }
            }
        ]
    },
    santorini: {
        id: "santorini",
        name: "Santorini Escape",
        translations: {
            en: {
                title: "Santorini, Greece",
                description: "Luxurious relaxation on the caldera edge. Enjoy private cruises, wine tasting, and the most romantic sunsets in the world.",
                quickLook: "Luxury views & wine tasting"
            },
            de: {
                title: "Santorini, Griechenland",
                description: "Luxuriöse Entspannung am Rande der Caldera. Genießen Sie private Kreuzfahrten, Weinproben und die romantischsten Sonnenuntergänge.",
                quickLook: "Luxus-Aussichten & Weinprobe"
            },
            el: {
                title: "Σαντορίνη, Ελλάδα",
                description: "Πολυτελής χαλάρωση στην καλντέρα. Απολαύστε ιδιωτικές κρουαζιέρες, γευσιγνωσία κρασιού και τα πιο ρομαντικά ηλιοβασιλέματα.",
                quickLook: "Θέα πολυτέλειας & γευσιγνωσία"
            }
        },
        dates: "Sept 5-12, 2025",
        price: "€2,899",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
        destinationIds: [],
        departures: ["2025-09-05", "2025-10-01"],
        spots: 10,
        partner: { name: "Aegean Luxury", url: "https://example.com/santorini?aff=menescape" },
        itinerary: [
            {
                day: "01",
                translations: {
                    en: { title: "Caldera Arrival", items: ["Transfer to Oia suites", "Welcome wine tasting", "Dinner with volcano view"] },
                    de: { title: "Ankunft an der Caldera", items: ["Transfer zu den Oia-Suiten", "Willkommens-Weinprobe", "Abendessen mit Vulkanblick"] },
                    el: { title: "Άφιξη στην Καλντέρα", items: ["Μεταφορά στις σουίτες στην Οία", "Γευσιγνωσία κρασιού", "Δείπνο με θέα το ηφαίστειο"] }
                }
            },
            {
                day: "02",
                translations: {
                    en: { title: "Volcano Hike & Springs", items: ["Private boat tour", "Hike up the volcano", "Swim in hot springs"] },
                    de: { title: "Vulkanwanderung & Quellen", items: ["Private Bootstour", "Wanderung auf den Vulkan", "Schwimmen in heißen Quellen"] },
                    el: { title: "Πεζοπορία στο Ηφαίστειο", items: ["Ιδιωτική εκδρομή με σκάφος", "Πεζοπορία στο ηφαίστειο", "Κολύμπι στις ιαματικές πηγές"] }
                }
            },
            {
                day: "03",
                translations: {
                    en: { title: "Winery Tour", items: ["Visit 3 top wineries", "Traditional greek lunch", "Sunset at Santo Wines"] },
                    de: { title: "Weingut-Tour", items: ["Besuch von 3 Top-Weingütern", "Traditionelles griechisches Mittagessen", "Sonnenuntergang bei Santo Wines"] },
                    el: { title: "Γύρος Οινοποιείων", items: ["Επίσκεψη σε 3 κορυφαία οινοποιεία", "Παραδοσιακό ελληνικό γεύμα", "Ηλιοβασίλεμα στο Santo Wines"] }
                }
            }
        ]
    },
    barcelona: {
        id: "barcelona",
        name: "Barcelona & Sitges",
        translations: {
            en: {
                title: "Barcelona & Sitges",
                description: "The perfect mix of city culture and coastal relaxation. Gaudi architecture by day, Sitges beach bars by night.",
                quickLook: "City culture & beach vibes"
            },
            de: {
                title: "Barcelona & Sitges",
                description: "Die perfekte Mischung aus Stadtkultur und Entspannung an der Küste. Gaudi-Architektur am Tag, Sitges-Strandbars bei Nacht.",
                quickLook: "Stadtkultur & Strand-Vibes"
            },
            el: {
                title: "Βαρκελώνη & Sitges",
                description: "Ο τέλειος συνδυασμός πολιτισμού πόλης και παραθαλάσσιας χαλάρωσης. Αρχιτεκτονική Gaudi τη μέρα, beach bars του Sitges τη νύχτα.",
                quickLook: "Κουλτούρα πόλης & παραλία"
            }
        },
        dates: "Aug 20-27, 2025",
        price: "€1,999",
        image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800",
        destinationIds: [],
        departures: ["2025-08-20"],
        spots: 15,
        partner: { name: "Catalan Freedom", url: "https://example.com/barcelona?aff=menescape" },
        itinerary: [
            {
                day: "01",
                translations: {
                    en: { title: "Hola BCN", items: ["Check-in at Eixample hotel", "Tapas crawl tour", "Rooftop drinks"] },
                    de: { title: "Hola BCN", items: ["Check-in im Eixample Hotel", "Tapas-Tour", "Rooftop-Drinks"] },
                    el: { title: "Hola BCN", items: ["Check-in σε ξενοδοχείο στο Eixample", "Γύρος για Tapas", "Ποτά σε ταράτσα"] }
                }
            },
            {
                day: "02",
                translations: {
                    en: { title: "Sitges Day Trip", items: ["Train to Sitges", "Main beach day", "Evening drag show"] },
                    de: { title: "Tagesausflug Sitges", items: ["Zug nach Sitges", "Hauptstrand-Tag", "Abendliche Drag-Show"] },
                    el: { title: "Εκδρομή στο Sitges", items: ["Τρένο για Sitges", "Ημέρα στην παραλία", "Βραδινό drag show"] }
                }
            },
            {
                day: "03",
                translations: {
                    en: { title: "Architecture & Parks", items: ["Sagrada Familia visit", "Park Guell walk", "Farewell Paella dinner"] },
                    de: { title: "Architektur & Parks", items: ["Besuch Sagrada Familia", "Spaziergang Park Guell", "Abschieds-Paella-Essen"] },
                    el: { title: "Αρχιτεκτονική & Πάρκα", items: ["Επίσκεψη Sagrada Familia", "Βόλτα στο Park Guell", "Αποχαιρετιστήριο δείπνο Paella"] }
                }
            }
        ]
    }
};

// ========================================
// GALLERY - Derived from packages for display
// ========================================
const initialGallery = Object.values(initialPackages).map(pkg => ({
    translations: pkg.translations,
    title: pkg.translations.en.title,
    description: pkg.translations.en.description,
    price: pkg.price,
    duration: "7 nights", // Simplified for gallery
    image: pkg.image,
    quickLook: pkg.translations.en.quickLook,
    featured: pkg.id !== 'barcelona', // Feature first 3
    packageId: pkg.id
}));

// ========================================
// HERO CAROUSEL - Homepage hero slides
// ========================================
const initialHeroSlides = [
    {
        imageUrl: "/05.jpg",
        order: 0,
        transitionDuration: 5000,
        transitionType: 'crossfade',
        textTransitionType: 'fade',
        isActive: true,
        translations: {
            en: {
                label: "MenEscape — The Gateway",
                title: "Your body. Your rules.",
                highlight: "Your getaway.",
                subhead: "We create spaces for a liberating, exciting, and pleasurable getaway.",
                primaryCta: "Explore Destinations",
                secondaryCta: "View Packages"
            },
            de: {
                label: "MenEscape — Das Tor",
                title: "Dein Körper. Deine Regeln.",
                highlight: "Dein Rückzug.",
                subhead: "Wir schaffen Räume für einen befreienden, aufregenden und genussvollen Urlaub.",
                primaryCta: "Reiseziele entdecken",
                secondaryCta: "Pakete ansehen"
            },
            el: {
                label: "MenEscape — Η Πύλη",
                title: "Το σώμα σου. Οι κανόνες σου.",
                highlight: "Η απόδρασή σου.",
                subhead: "Δημιουργούμε χώρους για μια απελευθερωτική, συναρπαστική και απολαυστική απόδραση.",
                primaryCta: "Εξερεύνησε Προορισμούς",
                secondaryCta: "Δες τα Πακέτα"
            }
        }
    },
    {
        imageUrl: "/best.jpg",
        order: 1,
        transitionDuration: 5000,
        transitionType: 'zoom-in',
        textTransitionType: 'slide-left',
        isActive: true,
        translations: {
            en: {
                label: "MenEscape — Experience Freedom",
                title: "Unforgettable moments.",
                highlight: "Unmatched experiences.",
                subhead: "Join a community of like-minded travelers seeking authentic connections and ultimate freedom.",
                primaryCta: "Explore Destinations",
                secondaryCta: "View Packages"
            },
            de: {
                label: "MenEscape — Erlebe Freiheit",
                title: "Unvergessliche Momente.",
                highlight: "Unvergleichliche Erlebnisse.",
                subhead: "Werde Teil einer Gemeinschaft Gleichgesinnter auf der Suche nach echten Verbindungen und ultimativer Freiheit.",
                primaryCta: "Reiseziele entdecken",
                secondaryCta: "Pakete ansehen"
            },
            el: {
                label: "MenEscape — Βίωσε την Ελευθερία",
                title: "Αξέχαστες στιγμές.",
                highlight: "Ασύγκριτες εμπειρίες.",
                subhead: "Γίνε μέλος μιας κοινότητας ομοϊδεατών ταξιδιωτών που αναζητούν αυθεντικές συνδέσεις και απόλυτη ελευθερία.",
                primaryCta: "Εξερεύνησε Προορισμούς",
                secondaryCta: "Δες τα Πακέτα"
            }
        }
    },
    {
        imageUrl: "/resort-life.jpg",
        order: 2,
        transitionDuration: 5000,
        transitionType: 'slide-left',
        textTransitionType: 'blur',
        isActive: true,
        translations: {
            en: {
                label: "MenEscape — Luxury Awaits",
                title: "Paradise found.",
                highlight: "Your escape begins.",
                subhead: "Discover hidden gems and exclusive destinations designed for connection and adventure.",
                primaryCta: "Explore Destinations",
                secondaryCta: "View Packages"
            },
            de: {
                label: "MenEscape — Luxus erwartet dich",
                title: "Paradies gefunden.",
                highlight: "Deine Flucht beginnt.",
                subhead: "Entdecke verborgene Schätze und exklusive Ziele für Verbindung und Abenteuer.",
                primaryCta: "Reiseziele entdecken",
                secondaryCta: "Pakete ansehen"
            },
            el: {
                label: "MenEscape — Πολυτέλεια σε περιμένει",
                title: "Παράδεισος βρέθηκε.",
                highlight: "Η απόδρασή σου ξεκινά.",
                subhead: "Ανακάλυψε κρυμμένους θησαυρούς και αποκλειστικούς προορισμούς για σύνδεση και περιπέτεια.",
                primaryCta: "Εξερεύνησε Προορισμούς",
                secondaryCta: "Δες τα Πακέτα"
            }
        }
    }
];

// ========================================
// TESTIMONIALS
// ========================================
const initialTestimonials = [
    { quote: "An absolutely incredible experience! The organization was flawless.", author: "James M., London" },
    { quote: "Best vacation I've ever had. MenEscape knows how to create unforgettable moments.", author: "David K., Berlin" },
    { quote: "From the accommodations to the nightlife, everything exceeded my expectations.", author: "Michael R., New York" },
    { quote: "I was skeptical at first, but this trip changed my perspective on group travel.", author: "Thomas L., Amsterdam" },
];

// ========================================
// SEED FUNCTION
// ========================================
async function seed() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/menescape';

    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Always clear non-user data
    console.log('🗑️  Clearing existing data (keeping users)...');
    await Package.deleteMany({});
    await GalleryItem.deleteMany({});
    await Testimonial.deleteMany({});
    await HeroSlide.deleteMany({});
    console.log('   ✅ Cleared packages, gallery items, testimonials, and hero slides');

    // Seed packages
    console.log('🌱 Seeding packages...');
    for (const [id, pkg] of Object.entries(initialPackages)) {
        await Package.create({ ...pkg, id });
        console.log(`   ✅ Created package: ${id}`);
    }

    // Seed gallery with translations
    console.log('🌱 Seeding destinations with translations...');
    await GalleryItem.insertMany(initialGallery);
    console.log(`   ✅ Created ${initialGallery.length} destinations`);

    // Seed hero carousel
    console.log('🌱 Seeding hero carousel slides...');
    await HeroSlide.insertMany(initialHeroSlides);
    console.log(`   ✅ Created ${initialHeroSlides.length} hero slides`);

    // Seed testimonials
    console.log('🌱 Seeding testimonials...');
    await Testimonial.insertMany(initialTestimonials);
    console.log(`   ✅ Created ${initialTestimonials.length} testimonials`);

    console.log('🎉 Seed completed successfully!');
    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
