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
}, { timestamps: true });

const GalleryItemSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: String,
    duration: String,
    image: String,
    quickLook: String,
    featured: { type: Boolean, default: false },
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
    {
        title: "Mykonos Island Escape",
        description: "7 nights of luxury in the heart of the Cyclades with exclusive beach access and nightlife experiences.",
        price: "€2,499",
        duration: "7 nights",
        image: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=600",
        quickLook: "Paradise beaches & legendary nightlife",
        featured: true,
    },
    {
        title: "Ibiza Sunset Experience",
        description: "Experience the best of Ibiza's legendary sunsets, beach clubs, and world-famous nightlife.",
        price: "€2,799",
        duration: "7 nights",
        image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600",
        quickLook: "World-class clubs & crystal waters",
        featured: false,
    },
    {
        title: "Santorini Romance",
        description: "Explore volcanic landscapes, blue-domed churches, and spectacular caldera views.",
        price: "€2,899",
        duration: "8 nights",
        image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600",
        quickLook: "Breathtaking sunsets & volcanic beauty",
        featured: false,
    },
    {
        title: "Barcelona & Beyond",
        description: "Dive into Catalan culture with Gaudí architecture, tapas tours, and Mediterranean vibes.",
        price: "€2,199",
        duration: "7 nights",
        image: "https://images.unsplash.com/photo-1583422409516-2895a77ef2c9?w=600",
        quickLook: "Art, architecture & Mediterranean flair",
        featured: false,
    },
    {
        title: "Greek Island Hopping",
        description: "Visit multiple islands including Mykonos, Santorini, and hidden gems only locals know.",
        price: "€3,299",
        duration: "10 nights",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
        quickLook: "Multi-island adventure & exploration",
        featured: true,
    },
    {
        title: "Mediterranean Weekender",
        description: "A short escape to refresh and recharge with curated local experiences.",
        price: "€899",
        duration: "3 nights",
        image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600",
        quickLook: "Quick getaway for busy professionals",
        featured: false,
    },
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
