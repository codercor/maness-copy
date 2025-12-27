import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Schemas
const DestinationInfoSchema = new mongoose.Schema({
    title: String,
    dates: String,
    price: String,
    image: String,
    quickLook: String,
});

const PartnerSchema = new mongoose.Schema({
    name: String,
    url: String,
});

const ItineraryDaySchema = new mongoose.Schema({
    day: String,
    title: String,
    items: [String],
});

const PackageSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: String,
    destination: DestinationInfoSchema,
    departures: [String],
    spots: Number,
    partner: PartnerSchema,
    itinerary: [ItineraryDaySchema],
    showOnHomepage: { type: Boolean, default: true },
    isSelected: { type: Boolean, default: false },
}, { timestamps: true });

const GalleryItemSchema = new mongoose.Schema({
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

const Package = mongoose.model('Package', PackageSchema);
const GalleryItem = mongoose.model('GalleryItem', GalleryItemSchema);
const Testimonial = mongoose.model('Testimonial', TestimonialSchema);

// Initial data
const initialPackages = {
    mykonos: {
        id: "mykonos",
        name: "Mykonos Adventure",
        destination: {
            title: "Mykonos, Greece",
            dates: "June 15-22, 2025",
            price: "€2,499",
            image: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=800",
            quickLook: "Experience the iconic white-washed buildings and vibrant nightlife of this legendary Greek island."
        },
        departures: ["2025-06-15", "2025-07-20", "2025-08-10"],
        spots: 12,
        partner: { name: "Greek Escapes", url: "https://example.com/mykonos" },
        itinerary: [
            { day: "01", title: "Arrival & Welcome", items: ["Airport pickup", "Hotel check-in", "Welcome dinner"] },
            { day: "02", title: "Beach Day", items: ["Paradise Beach", "Water sports", "Beach club"] },
            { day: "03", title: "Town Exploration", items: ["Mykonos Town tour", "Little Venice", "Shopping"] },
            { day: "04", title: "Island Adventure", items: ["Boat trip", "Swimming", "BBQ on beach"] },
            { day: "05", title: "Relaxation Day", items: ["Spa morning", "Pool time", "Nightlife"] },
            { day: "06", title: "Cultural Day", items: ["Delos island", "Ancient ruins", "Farewell dinner"] },
            { day: "07", title: "Departure", items: ["Breakfast", "Airport transfer"] }
        ]
    },
    ibiza: {
        id: "ibiza",
        name: "Ibiza Experience",
        destination: {
            title: "Ibiza, Spain",
            dates: "July 5-12, 2025",
            price: "€2,799",
            image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800",
            quickLook: "Discover the magic of Ibiza with world-famous clubs and stunning beaches."
        },
        departures: ["2025-07-05", "2025-08-02", "2025-09-06"],
        spots: 15,
        partner: { name: "Ibiza Ventures", url: "https://example.com/ibiza" },
        itinerary: [
            { day: "01", title: "Welcome to Ibiza", items: ["Airport greeting", "Villa check-in", "Welcome party"] },
            { day: "02", title: "Beach Hopping", items: ["Cala Comte", "Cala Bassa", "Café del Mar sunset"] },
            { day: "03", title: "Old Town", items: ["Dalt Vila tour", "Historic fortress", "Local tapas"] },
            { day: "04", title: "Boat Day", items: ["Private yacht", "Formentera visit", "Snorkeling"] },
            { day: "05", title: "Wellness", items: ["Yoga", "Spa treatments", "Healthy lunch"] },
            { day: "06", title: "Party Night", items: ["Beach club", "VIP club experience", "Late night"] },
            { day: "07", title: "Farewell", items: ["Brunch", "Last photos", "Airport transfer"] }
        ]
    },
    santorini: {
        id: "santorini",
        name: "Santorini Dreams",
        destination: {
            title: "Santorini, Greece",
            dates: "September 1-8, 2025",
            price: "€2,899",
            image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
            quickLook: "Witness breathtaking sunsets and explore the romantic beauty of this volcanic paradise."
        },
        departures: ["2025-09-01", "2025-09-15", "2025-10-05"],
        spots: 10,
        partner: { name: "Aegean Tours", url: "https://example.com/santorini" },
        itinerary: [
            { day: "01", title: "Arrival", items: ["Ferry from Athens", "Caldera view hotel", "Wine tasting"] },
            { day: "02", title: "Oia Exploration", items: ["Blue dome churches", "Art galleries", "Sunset spot"] },
            { day: "03", title: "Volcanic Adventure", items: ["Volcano hike", "Hot springs", "Village visit"] },
            { day: "04", title: "Wine & Dine", items: ["Winery tours", "Wine tasting", "Gourmet dinner"] },
            { day: "05", title: "Beach Day", items: ["Red Beach", "Black sand swimming", "Seafood lunch"] },
            { day: "06", title: "Sunset Cruise", items: ["Catamaran tour", "Swimming", "Dinner on deck"] },
            { day: "07", title: "Free Day", items: ["Personal exploration", "Shopping", "Spa optional"] },
            { day: "08", title: "Departure", items: ["Breakfast with view", "Transfer"] }
        ]
    },
    barcelona: {
        id: "barcelona",
        name: "Barcelona Nights",
        destination: {
            title: "Barcelona, Spain",
            dates: "October 10-17, 2025",
            price: "€2,199",
            image: "https://images.unsplash.com/photo-1583422409516-2895a77ef2c9?w=800",
            quickLook: "Experience Gaudí's masterpieces, vibrant tapas culture, and Mediterranean beaches."
        },
        departures: ["2025-10-10", "2025-11-07", "2025-04-15"],
        spots: 18,
        partner: { name: "Barcelona Experiences", url: "https://example.com/barcelona" },
        itinerary: [
            { day: "01", title: "Hola Barcelona", items: ["Airport pickup", "Gothic Quarter hotel", "Tapas dinner"] },
            { day: "02", title: "Gaudí Day", items: ["Sagrada Familia", "Park Güell", "Casa Batlló"] },
            { day: "03", title: "Beach & Culture", items: ["Barceloneta Beach", "Born neighborhood", "Flamenco show"] },
            { day: "04", title: "Food & Wine", items: ["La Boqueria market", "Cooking class", "Wine tasting"] },
            { day: "05", title: "Day Trip", items: ["Montserrat monastery", "Mountain hiking", "Cava tasting"] },
            { day: "06", title: "Art & Nightlife", items: ["Picasso Museum", "Rooftop bars", "Club experience"] },
            { day: "07", title: "Adéu", items: ["Shopping time", "Final lunch", "Airport transfer"] }
        ]
    }
};

const initialGallery = [
    // Featured items
    { title: "Mykonos Island Escape", description: "7 nights of luxury in the heart of the Cyclades with exclusive beach access and nightlife experiences.", price: "€2,499", duration: "7 nights", image: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=600", quickLook: "Paradise beaches & legendary nightlife", featured: true, packageId: "mykonos" },
    { title: "Greek Island Hopping", description: "Visit multiple islands including Mykonos, Santorini, and hidden gems only locals know.", price: "€3,299", duration: "10 nights", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600", quickLook: "Multi-island adventure & exploration", featured: true, packageId: "mykonos" },
    { title: "Ultimate Barcelona", description: "Premium 10-night Barcelona experience with VIP access to clubs and exclusive dining.", price: "€3,499", duration: "10 nights", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600", quickLook: "VIP Barcelona experience", featured: true, packageId: "barcelona" },

    // Mykonos packages
    { title: "Mykonos Beach Bliss", description: "Sun, sand, and unforgettable memories on the iconic beaches of Mykonos.", price: "€1,899", duration: "5 nights", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600", quickLook: "Beach paradise awaits", featured: false, packageId: "mykonos" },
    { title: "Mykonos Nightlife Tour", description: "Experience the legendary clubs and bars that made Mykonos famous worldwide.", price: "€2,199", duration: "4 nights", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600", quickLook: "Party capital of Greece", featured: false, packageId: "mykonos" },
    { title: "Mykonos Luxury Retreat", description: "5-star accommodations with private yacht excursions and personal concierge.", price: "€4,999", duration: "7 nights", image: "https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=600", quickLook: "Ultimate luxury experience", featured: false, packageId: "mykonos" },
    { title: "Mykonos Adventure Week", description: "Water sports, hiking, and outdoor adventures on this beautiful island.", price: "€2,099", duration: "6 nights", image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600", quickLook: "Adventure & excitement", featured: false, packageId: "mykonos" },
    { title: "Mykonos Cultural Journey", description: "Discover ancient history and local traditions beyond the beaches.", price: "€1,799", duration: "5 nights", image: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=600", quickLook: "Culture meets paradise", featured: false, packageId: "mykonos" },

    // Ibiza packages
    { title: "Ibiza Sunset Experience", description: "Experience the best of Ibiza's legendary sunsets, beach clubs, and world-famous nightlife.", price: "€2,799", duration: "7 nights", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600", quickLook: "World-class clubs & crystal waters", featured: false, packageId: "ibiza" },
    { title: "Ibiza Club Circuit", description: "VIP access to the hottest clubs: Pacha, Amnesia, Ushuaïa, and more.", price: "€3,199", duration: "5 nights", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600", quickLook: "Legendary club experience", featured: false, packageId: "ibiza" },
    { title: "Ibiza Beach Hop", description: "Explore hidden coves and famous beaches with boat trips included.", price: "€2,299", duration: "6 nights", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600", quickLook: "Beach hopping paradise", featured: false, packageId: "ibiza" },
    { title: "Ibiza Wellness Escape", description: "Yoga retreats, spa treatments, and healthy dining in tranquil settings.", price: "€2,599", duration: "7 nights", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600", quickLook: "Relax & rejuvenate", featured: false, packageId: "ibiza" },
    { title: "Ibiza Old Town Discovery", description: "Explore Dalt Vila's UNESCO heritage and authentic Ibizan culture.", price: "€1,699", duration: "4 nights", image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600", quickLook: "History & heritage", featured: false, packageId: "ibiza" },
    { title: "Mediterranean Weekender", description: "A short escape to refresh and recharge with curated local experiences.", price: "€899", duration: "3 nights", image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600", quickLook: "Quick getaway for busy professionals", featured: false, packageId: "ibiza" },

    // Santorini packages
    { title: "Santorini Romance", description: "Explore volcanic landscapes, blue-domed churches, and spectacular caldera views.", price: "€2,899", duration: "8 nights", image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600", quickLook: "Breathtaking sunsets & volcanic beauty", featured: false, packageId: "santorini" },
    { title: "Santorini Wine Tour", description: "Visit volcanic vineyards and taste unique Assyrtiko wines.", price: "€2,199", duration: "5 nights", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600", quickLook: "Wine lovers paradise", featured: false, packageId: "santorini" },
    { title: "Santorini Sailing", description: "Private catamaran tours around the caldera with swimming stops.", price: "€3,099", duration: "6 nights", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600", quickLook: "Sail the Aegean", featured: false, packageId: "santorini" },
    { title: "Santorini Photo Tour", description: "Capture stunning photos at the most iconic locations with a professional guide.", price: "€2,499", duration: "5 nights", image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600", quickLook: "Instagram-worthy moments", featured: false, packageId: "santorini" },
    { title: "Santorini Culinary Journey", description: "Cooking classes, food tours, and fine dining experiences.", price: "€2,699", duration: "6 nights", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600", quickLook: "Taste of Greece", featured: false, packageId: "santorini" },
    { title: "Santorini Volcano Trek", description: "Hike the volcanic landscapes and swim in hot springs.", price: "€1,999", duration: "4 nights", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600", quickLook: "Volcanic adventure", featured: false, packageId: "santorini" },

    // Barcelona packages
    { title: "Barcelona & Beyond", description: "Dive into Catalan culture with Gaudí architecture, tapas tours, and Mediterranean vibes.", price: "€2,199", duration: "7 nights", image: "https://images.unsplash.com/photo-1583422409516-2895a77ef2c9?w=600", quickLook: "Art, architecture & Mediterranean flair", featured: false, packageId: "barcelona" },
    { title: "Barcelona Foodie Tour", description: "Tapas crawls, market visits, and hands-on cooking classes.", price: "€1,899", duration: "5 nights", image: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=600", quickLook: "Culinary delights", featured: false, packageId: "barcelona" },
    { title: "Barcelona Art & Architecture", description: "Gaudí masterpieces, Picasso Museum, and contemporary art galleries.", price: "€2,099", duration: "5 nights", image: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=600", quickLook: "Artistic inspiration", featured: false, packageId: "barcelona" },
    { title: "Barcelona Beach & Party", description: "Barceloneta beaches by day, clubs by night.", price: "€1,799", duration: "4 nights", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600", quickLook: "Sun & nightlife", featured: false, packageId: "barcelona" },
    { title: "Barcelona Football Experience", description: "Camp Nou tour, match tickets, and local football culture.", price: "€2,399", duration: "5 nights", image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=600", quickLook: "Football fan dream", featured: false, packageId: "barcelona" },
    { title: "Barcelona Day Trips", description: "Explore Montserrat, Costa Brava, and Girona from Barcelona.", price: "€2,599", duration: "7 nights", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600", quickLook: "Beyond the city", featured: false, packageId: "barcelona" },

    // Additional varied packages
    { title: "Aegean Explorer", description: "10-day journey through the best of the Greek islands.", price: "€3,799", duration: "10 nights", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600", quickLook: "Island hopping adventure", featured: false, packageId: "mykonos" },
    { title: "Spanish Riviera", description: "Costa Brava beaches combined with Barcelona culture.", price: "€2,899", duration: "8 nights", image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600", quickLook: "Beach & culture combo", featured: false, packageId: "barcelona" },
    { title: "Cyclades Discovery", description: "Explore Mykonos, Santorini, and lesser-known Cycladic gems.", price: "€3,499", duration: "12 nights", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600", quickLook: "Complete Cyclades tour", featured: false, packageId: "santorini" },
    { title: "Balearic Islands Tour", description: "Ibiza, Mallorca, and Menorca in one amazing trip.", price: "€3,999", duration: "14 nights", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600", quickLook: "Island trio adventure", featured: false, packageId: "ibiza" },
    { title: "Mediterranean Luxe", description: "First-class experiences across Greece and Spain.", price: "€5,999", duration: "14 nights", image: "https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=600", quickLook: "Premium Mediterranean tour", featured: false, packageId: "santorini" },
    { title: "Beach Bum Special", description: "Our most affordable beach-focused getaway.", price: "€999", duration: "4 nights", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600", quickLook: "Budget-friendly beach fun", featured: false, packageId: "mykonos" },
    { title: "Party Capital Tour", description: "Mykonos and Ibiza - the ultimate party combination.", price: "€4,199", duration: "10 nights", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600", quickLook: "Non-stop party action", featured: false, packageId: "ibiza" },
    { title: "Couples Retreat", description: "Romantic getaway with sunset dinners and spa treatments.", price: "€3,299", duration: "7 nights", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600", quickLook: "Romance in paradise", featured: false, packageId: "santorini" },
    { title: "Solo Traveler Special", description: "Meet like-minded travelers on this social adventure.", price: "€1,599", duration: "5 nights", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600", quickLook: "Make friends worldwide", featured: false, packageId: "barcelona" },
    { title: "Group Getaway", description: "Special rates for groups of 6+ travelers.", price: "€1,399", duration: "5 nights", image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600", quickLook: "Celebrate together", featured: false, packageId: "mykonos" },
    { title: "Summer Festival Tour", description: "Timed with the best summer music festivals.", price: "€2,999", duration: "7 nights", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600", quickLook: "Festival season fun", featured: false, packageId: "ibiza" },
    { title: "Autumn Escape", description: "Fewer crowds, lower prices, perfect weather.", price: "€1,699", duration: "6 nights", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600", quickLook: "Off-season perfection", featured: false, packageId: "santorini" },
    { title: "Winter Sun Getaway", description: "Escape the cold with mild Mediterranean winters.", price: "€1,499", duration: "5 nights", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600", quickLook: "Winter warmth", featured: false, packageId: "barcelona" },
    { title: "Spring Break Blast", description: "The ultimate spring break experience.", price: "€2,099", duration: "5 nights", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600", quickLook: "Spring break mayhem", featured: false, packageId: "mykonos" },
    { title: "Extended Stay", description: "Work remotely from paradise with our long-stay packages.", price: "€4,499", duration: "30 nights", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600", quickLook: "Live the dream", featured: false, packageId: "ibiza" },
    { title: "Last Minute Deal", description: "Spontaneous getaway at amazing prices.", price: "€799", duration: "3 nights", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600", quickLook: "Grab it now!", featured: false, packageId: "mykonos" },
    { title: "Early Bird Special", description: "Book 6+ months ahead for the best rates.", price: "€1,899", duration: "7 nights", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600", quickLook: "Plan ahead & save", featured: false, packageId: "santorini" },
    { title: "All-Inclusive Plus", description: "Everything included - flights, meals, activities, and drinks.", price: "€3,999", duration: "7 nights", image: "https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=600", quickLook: "Worry-free vacation", featured: false, packageId: "barcelona" },
    { title: "Photography Expedition", description: "Capture stunning Mediterranean landscapes with pro guidance.", price: "€2,799", duration: "6 nights", image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600", quickLook: "Shoot like a pro", featured: false, packageId: "santorini" },
    { title: "Fitness Retreat", description: "Morning workouts, healthy meals, and active excursions.", price: "€2,399", duration: "7 nights", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600", quickLook: "Stay fit on vacation", featured: false, packageId: "ibiza" },
    { title: "Digital Detox", description: "Disconnect from devices, reconnect with yourself.", price: "€2,599", duration: "5 nights", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600", quickLook: "Unplug & unwind", featured: false, packageId: "mykonos" },
];

const initialTestimonials = [
    { quote: "An absolutely incredible experience! The organization was flawless and I made friends for life.", author: "James M., London" },
    { quote: "Best vacation I've ever had. MenEscape knows how to create unforgettable moments.", author: "David K., Berlin" },
    { quote: "From the accommodations to the nightlife, everything exceeded my expectations.", author: "Michael R., New York" },
    { quote: "I was skeptical at first, but this trip changed my perspective on group travel. Highly recommend!", author: "Thomas L., Amsterdam" },
];

async function seed() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/menescape';
    const forceSeed = process.env.FORCE_SEED === 'true';

    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    if (forceSeed) {
        console.log('🗑️  Force seed: clearing existing data...');
        await Package.deleteMany({});
        await GalleryItem.deleteMany({});
        await Testimonial.deleteMany({});
    }

    // Seed packages
    const pkgCount = await Package.countDocuments();
    if (pkgCount === 0) {
        console.log('🌱 Seeding packages...');
        for (const [id, pkg] of Object.entries(initialPackages)) {
            await Package.create({ ...pkg, id });
            console.log(`   ✅ Created package: ${id}`);
        }
    } else {
        console.log(`📦 Packages already exist (${pkgCount}). Skipping.`);
    }

    // Seed gallery
    const galleryCount = await GalleryItem.countDocuments();
    if (galleryCount === 0) {
        console.log('🌱 Seeding gallery...');
        await GalleryItem.insertMany(initialGallery);
        console.log(`   ✅ Created ${initialGallery.length} gallery items`);
    } else {
        console.log(`🖼️  Gallery already exists (${galleryCount}). Skipping.`);
    }

    // Seed testimonials
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
        console.log('🌱 Seeding testimonials...');
        await Testimonial.insertMany(initialTestimonials);
        console.log(`   ✅ Created ${initialTestimonials.length} testimonials`);
    } else {
        console.log(`💬 Testimonials already exist (${testimonialCount}). Skipping.`);
    }

    console.log('🎉 Seed completed successfully!');
    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
