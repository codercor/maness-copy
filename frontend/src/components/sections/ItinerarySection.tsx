"use client";

import { motion, type Variants } from "framer-motion";
import type { Translations, Package, ServiceItem, Language } from "@/types";
import { INCLUDED_SERVICES } from "@/types";

interface ItinerarySectionProps {
    copy: Translations;
    localizedPackage: Package;
    currentPackage: Package;
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    itineraryServices: ServiceItem[];
    trustItems: string[];
    includedOpen: boolean;
    setIncludedOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
    onBookClick: () => void;
    formatDate: (dateString: string) => string;
    formatSpots: (count: number) => string;
    itineraryRef: React.RefObject<HTMLElement | null>;
    bookingRef: React.RefObject<HTMLElement | null>;
    timelineRef: React.RefObject<HTMLDivElement | null>;
    itineraryProgress: number;
    motionEnabled: boolean;
    language: Language;
}

const motionEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const sectionHeaderVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: motionEase },
    },
};

const timelineContainerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const timelineLineVariants: Variants = {
    hidden: { scaleY: 0 },
    show: {
        scaleY: 1,
        transition: { duration: 0.9, ease: motionEase },
    },
};

const timelineItemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: motionEase },
    },
};

// Map service IDs to icons
const getServiceIcon = (serviceId: string): string => {
    const service = INCLUDED_SERVICES.find(s => s.id === serviceId);
    return service?.icon || 'check_circle';
};

const getServiceLabel = (serviceId: string): string => {
    const service = INCLUDED_SERVICES.find(s => s.id === serviceId);
    return service?.label || serviceId;
};

export function ItinerarySection({
    copy,
    localizedPackage,
    currentPackage,
    selectedDate,
    setSelectedDate,
    itineraryServices,
    trustItems,
    includedOpen,
    setIncludedOpen,
    onBookClick,
    formatDate,
    formatSpots,
    itineraryRef,
    bookingRef,
    timelineRef,
    itineraryProgress,
    motionEnabled,
    language,
}: ItinerarySectionProps) {
    const sectionHeaderMotion = motionEnabled
        ? {
            initial: "hidden" as const,
            whileInView: "show" as const,
            viewport: { once: true, amount: 0.45 },
            variants: sectionHeaderVariants,
        }
        : { initial: false as const };

    return (
        <section
            ref={itineraryRef}
            className="sunset-wash py-24 scroll-mt-24 snap-start"
            id="itinerary"
        >
            <div className="mx-auto grid w-[min(1200px,92vw)] gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                    <motion.div className="mb-8" {...sectionHeaderMotion}>
                        <div className="flex items-center gap-3">
                            <span className="header-symbol">
                                <span className="material-symbols-outlined text-sm text-white">
                                    route
                                </span>
                            </span>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--gold)]">
                                {copy.itinerary.label}
                            </p>
                        </div>
                        <h2 className="display-title mt-4 text-3xl font-bold md:text-4xl">
                            {copy.itinerary.title} {localizedPackage.name}
                        </h2>
                        <div className="section-rule mt-4" />
                        <svg className="section-motif" viewBox="0 0 160 18" aria-hidden="true">
                            <path d="M0 10 C 20 4, 40 4, 60 10 S 100 16, 120 10 S 150 4, 160 10" />
                        </svg>
                        <p className="mt-2 text-slate-500">{copy.itinerary.subtitle}</p>
                    </motion.div>
                    <motion.div
                        ref={timelineRef}
                        className="timeline-line space-y-10 pl-12"
                        {...(motionEnabled
                            ? {
                                initial: "hidden",
                                whileInView: "show",
                                viewport: { once: true, amount: 0.35 },
                                variants: timelineContainerVariants,
                            }
                            : { initial: false })}
                    >
                        {motionEnabled ? (
                            <motion.span
                                className="timeline-line__stroke"
                                aria-hidden="true"
                                variants={timelineLineVariants}
                            />
                        ) : (
                            <span className="timeline-line__stroke" aria-hidden="true" />
                        )}
                        <span
                            className="timeline-marker"
                            aria-hidden="true"
                            style={{
                                top: `${Math.min(Math.max(itineraryProgress, 0.02), 0.98) * 100}%`,
                            }}
                        />
                        {localizedPackage.itinerary.map((block) => {
                            // Get content from translations or legacy fields
                            const trans = (block.translations as any)?.[language];
                            const title = trans?.title ||
                                block.translations?.en?.title ||
                                block.title ||
                                `Day ${block.day}`;

                            const items: string[] = trans?.items ||
                                block.translations?.en?.items ||
                                block.items ||
                                [];

                            return (
                                <motion.div
                                    key={block.day}
                                    variants={timelineItemVariants}
                                    className="flex items-start gap-4"
                                >
                                    <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--navy)] text-sm font-bold text-white">
                                        {block.day}
                                    </span>
                                    <div>
                                        <h3 className="text-xl font-bold text-[var(--navy)]">
                                            {title}
                                        </h3>
                                        <ul className="mt-3 space-y-2 text-sm text-slate-500">
                                            {items.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    <div className="mt-12">
                        <h3 className="text-xl font-bold text-[var(--navy)]">
                            {copy.itinerary.includedTitle}
                        </h3>
                        <div className="mt-6 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {/* Use package's includedServices if available, otherwise fallback to static */}
                            {currentPackage.includedServices && currentPackage.includedServices.length > 0 ? (
                                currentPackage.includedServices.map((serviceId) => (
                                    <div
                                        key={serviceId}
                                        className="lux-card rounded-2xl bg-white p-4 flex flex-col items-center text-center"
                                    >
                                        <span className="material-symbols-outlined text-3xl text-[var(--navy)]">
                                            {getServiceIcon(serviceId)}
                                        </span>
                                        <h4 className="mt-2 text-sm font-bold text-[var(--navy)]">{getServiceLabel(serviceId)}</h4>
                                    </div>
                                ))
                            ) : (
                                itineraryServices.map((service, index) => (
                                    <div
                                        key={service.title}
                                        className="lux-card rounded-2xl bg-white p-5"
                                    >
                                        <span className="material-symbols-outlined text-3xl text-[var(--navy)]">
                                            {INCLUDED_SERVICES[index]?.icon || 'check_circle'}
                                        </span>
                                        <h4 className="mt-3 text-lg font-bold">{service.title}</h4>
                                        <p className="mt-2 text-sm text-slate-500">{service.text}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <aside className="lg:sticky lg:top-28" id="booking" ref={bookingRef}>
                    <div
                        className="edge-glow lux-card overflow-hidden rounded-3xl bg-white"
                    >
                        <div className="bg-[var(--navy)] px-6 py-5 text-white">
                            <p className="text-sm text-white/70">{copy.booking.total}</p>
                            <div className="mt-1 text-3xl font-bold">
                                {currentPackage.price || currentPackage.destination?.price || ''}{" "}
                                <span className="text-sm font-normal text-white/70">
                                    {copy.booking.perPerson}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-4 p-6">
                            <div className="lux-field flex items-center gap-2 px-4 py-3 text-sm">
                                <span className="material-symbols-outlined text-base text-slate-500">
                                    calendar_today
                                </span>
                                <select
                                    className="w-full bg-transparent text-sm text-slate-600 focus:outline-none"
                                    value={selectedDate}
                                    onChange={(event) => setSelectedDate(event.target.value)}
                                    aria-label="Select arrival date"
                                >
                                    {currentPackage.departures.map((date) => (
                                        <option key={date} value={date}>
                                            {formatDate(date)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <p className="text-xs text-slate-500">
                                {copy.booking.tripWindow}: {currentPackage.dates || currentPackage.destination?.dates || ''}
                            </p>

                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-700">
                                {formatSpots(currentPackage.spots)}
                            </p>
                            <div className="rounded-2xl border border-black/10 px-4 py-3">
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-[0.2em] text-[var(--navy)]"
                                    onClick={() => setIncludedOpen((open) => !open)}
                                    aria-expanded={includedOpen}
                                    aria-controls="included-panel"
                                >
                                    {copy.booking.whatsIncluded}
                                    <span className="material-symbols-outlined text-base">
                                        {includedOpen ? "expand_less" : "expand_more"}
                                    </span>
                                </button>
                                <div
                                    id="included-panel"
                                    className={`overflow-hidden text-xs text-slate-500 transition-all duration-300 ${includedOpen ? "max-h-60 pt-3" : "max-h-0"
                                        }`}
                                >
                                    <ul className="space-y-2">
                                        {/* Use package's includedServices if available */}
                                        {currentPackage.includedServices && currentPackage.includedServices.length > 0 ? (
                                            currentPackage.includedServices.map((serviceId) => (
                                                <li key={serviceId} className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm text-[var(--gold)]">
                                                        {getServiceIcon(serviceId)}
                                                    </span>
                                                    {getServiceLabel(serviceId)}
                                                </li>
                                            ))
                                        ) : (
                                            itineraryServices.map((service, index) => (
                                                <li key={service.title} className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm text-[var(--gold)]">
                                                        {INCLUDED_SERVICES[index]?.icon || 'check_circle'}
                                                    </span>
                                                    {service.text}
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <a
                                href={currentPackage.partner.url}
                                className="cta-luxe block w-full rounded-full bg-[linear-gradient(135deg,_#ec4899,_#3b82f6)] py-3 text-center text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-500/30"
                                onClick={(event) => {
                                    event.preventDefault();
                                    onBookClick();
                                }}
                            >
                                {copy.booking.bookNow}
                            </a>
                            <p className="text-xs text-slate-500">
                                {copy.booking.selectedDeparture}: {formatDate(selectedDate)}
                            </p>
                            <p className="text-center text-xs text-slate-500">
                                {copy.booking.redirectNote}
                            </p>
                            <div className="border-t border-black/10 pt-4 text-xs text-slate-500">
                                <p className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-green-600">
                                        check_circle
                                    </span>
                                    {copy.booking.freeCancel}
                                </p>
                                <p className="mt-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-green-600">
                                        check_circle
                                    </span>
                                    {copy.booking.noFees}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        className="lux-card mt-6 rounded-3xl bg-white p-6 text-sm text-slate-500"
                    >
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--gold)]">
                            {copy.booking.trustTitle}
                        </p>
                        <ul className="mt-4 space-y-3">
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-base text-[var(--navy)]">
                                    lock
                                </span>
                                {trustItems[0]}
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-base text-[var(--navy)]">
                                    verified
                                </span>
                                {trustItems[1]}
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-base text-[var(--navy)]">
                                    shield
                                </span>
                                {trustItems[2]}
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </section>
    );
}
