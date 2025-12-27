export interface DestinationInfo {
    title: string;
    dates: string;
    price: string;
    image: string;
    quickLook: string;
}

export interface ItineraryDay {
    day: string;
    title: string;
    items: string[];
}

export interface Partner {
    name: string;
    url: string;
}

export interface Package {
    id: PackageId;
    name: string;
    destination: DestinationInfo;
    departures: string[];
    spots: number;
    partner: Partner;
    itinerary: ItineraryDay[];
    showOnHomepage?: boolean;
    isSelected?: boolean;
}

export type PackageId = 'mykonos' | 'crete' | 'sitges' | 'telaviv' | 'grancanaria';

export type PackageDetails = Record<PackageId, Package>;

// Legacy type for backwards compatibility
export type Destination = DestinationInfo & { packageId: string };

