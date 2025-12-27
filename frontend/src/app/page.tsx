"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useReducedMotion } from "framer-motion";

// Components
import {
  Header,
  Footer,
  HeroSection,
  OffersSection,
  DestinationsSection,
  GallerySection,
  CommunitySection,
  NewsletterSection,
  AuthModal,
  AffiliateModal,
  MiniSummary,
} from "@/components";

// Data - only translations kept as static (they're UI strings)
import translationsData from "@/data/translations.json";
import contentTranslationsData from "@/data/content-translations.json";

// Types
import type {
  PackageId,
  PackageDetails,
  Package,
  GalleryItem,
  Testimonial,
  Language,
  Translations,
  ContentTranslations,
  LanguageOption,
  DestinationContentTranslation,
  GalleryContentTranslation,
} from "@/types";

// API Config
import { api } from "@/config/api";


const translations = translationsData as Record<Language, Translations>;
const contentTranslations = contentTranslationsData as Record<string, ContentTranslations>;

const sectionMap: Record<string, string> = {
  offers: "experience",
  "destination-gallery": "destinations",
  itinerary: "destinations",
};

const languageOptions: LanguageOption[] = [
  { id: "en", label: "English" },
  { id: "de", label: "German" },
  { id: "el", label: "Greek" },
];

export default function Home() {
  // Refs
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const bookingRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const itineraryRef = useRef<HTMLElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const userModalRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const heroBgRef = useRef<HTMLDivElement | null>(null);

  // Auth state
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Check for existing session
    const userStr = localStorage.getItem("menescape-user");
    if (userStr) {
      try {
        setSession({ user: JSON.parse(userStr) });
      } catch (e) {
        localStorage.removeItem("menescape-user");
      }
    }
  }, []);

  const handleLogin = (user: any) => {
    setSession({ user });
    setUserAuthOpen(false);
  };

  // State
  const [carouselState, setCarouselState] = useState({ canPrev: false, canNext: false });
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [testimonialPaused, setTestimonialPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const [navOpen, setNavOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [userAuthOpen, setUserAuthOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [footerEmail, setFooterEmail] = useState("");
  const [footerStatus, setFooterStatus] = useState("");
  const [includedOpen, setIncludedOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageId | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [packagesState, setPackagesState] = useState<PackageDetails>({});
  const [galleryState, setGalleryState] = useState<GalleryItem[]>([]);
  const [testimonialsState, setTestimonialsState] = useState<Testimonial[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("experience");
  const [showMiniSummary, setShowMiniSummary] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [itineraryProgress, setItineraryProgress] = useState(0);

  // Derived state
  const currentPackage = selectedPackage ? packagesState[selectedPackage] : null;
  const baseCopy = translations.en;
  const copy = translations[language] ?? baseCopy;
  const contentCopy = language === "en" ? null : contentTranslations[language] ?? null;
  const offersCards = copy.offers?.cards?.length === 3 ? copy.offers.cards : baseCopy.offers.cards;
  const itineraryServices = copy.itinerary?.services?.length === 3 ? copy.itinerary.services : baseCopy.itinerary.services;
  const communityPersonas = copy.community?.personas?.length === 5 ? copy.community.personas : baseCopy.community.personas;
  const trustItems = copy.booking?.trustItems?.length === 3 ? copy.booking.trustItems : baseCopy.booking.trustItems;
  const motionEnabled = !reducedMotion;

  // Helper functions
  const scrollCarousel = (direction: "next" | "prev") => {
    if (!carouselRef.current) return;
    const firstCard = carouselRef.current.querySelector<HTMLElement>("article");
    const amount = firstCard ? firstCard.offsetWidth + 24 : carouselRef.current.clientWidth * 0.8;
    carouselRef.current.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  const updateCarouselState = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const maxScroll = scrollWidth - clientWidth - 4;
    setCarouselState({
      canPrev: scrollLeft > 4,
      canNext: scrollLeft < maxScroll,
    });
  };

  const handleBookClick = () => {
    lastFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setModalOpen(true);
  };

  const handleUserOpen = () => {
    lastFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setUserAuthOpen(true);
  };

  const handleNewsletterSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!newsletterEmail.trim()) {
      setNewsletterStatus(copy.newsletter.invalid);
      return;
    }
    setNewsletterStatus(copy.newsletter.success);
    setNewsletterEmail("");
  };

  const handleFooterNewsletterSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!footerEmail.trim()) {
      setFooterStatus(copy.newsletter.invalid);
      return;
    }
    setFooterStatus(copy.newsletter.success);
    setFooterEmail("");
  };

  const getDestinationText = (packageId: string): DestinationContentTranslation | null => {
    const overrides = (contentCopy?.destinations as Record<string, DestinationContentTranslation> | undefined)?.[packageId];
    return overrides ?? null;
  };

  const getPackageText = (packageId: PackageId) => {
    const overrides = (contentCopy?.packages as Record<string, { name?: string; partnerName?: string; itinerary?: { title?: string; items?: string[] }[] }> | undefined)?.[packageId];
    return overrides ?? null;
  };

  const getGalleryText = (title: string): GalleryContentTranslation | null => {
    const overrides = (contentCopy?.gallery as Record<string, GalleryContentTranslation> | undefined)?.[title];
    return overrides ?? null;
  };

  const getTestimonialText = (index: number) => {
    const overrides = (contentCopy?.testimonials as { quote?: string; author?: string }[] | undefined)?.[index];
    return overrides ?? null;
  };

  const formatSpots = (count: number) => copy.booking.onlySpots.replace("{count}", String(count));

  const formatDate = (dateString: string) => {
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return dateString;
    return new Intl.DateTimeFormat(language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(parsed);
  };

  const packageText = selectedPackage ? getPackageText(selectedPackage) : null;
  const localizedPackage: Package | null = currentPackage ? {
    ...currentPackage,
    name: packageText?.name ?? currentPackage.name,
    partner: {
      ...currentPackage.partner,
      name: packageText?.partnerName ?? currentPackage.partner.name,
    },
    itinerary: currentPackage.itinerary.map((block, index) => {
      const override = packageText?.itinerary?.[index];
      return {
        ...block,
        title: override?.title ?? block.title,
        items: override?.items ?? block.items,
      };
    }),
  } : null;

  const confirmRedirect = () => {
    if (currentPackage?.partner?.url) {
      window.open(currentPackage.partner.url, "_blank", "noopener,noreferrer");
    }
    setModalOpen(false);
  };

  // Effects
  useEffect(() => {
    if (!modalOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModalOpen(false);
        return;
      }
      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    const timer = window.setTimeout(() => {
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      focusable?.[0]?.focus();
    }, 0);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
      lastFocusedRef.current?.focus();
    };
  }, [modalOpen]);

  useEffect(() => {
    if (!userAuthOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setUserAuthOpen(false);
        return;
      }
      if (event.key !== "Tab" || !userModalRef.current) return;
      const focusable = userModalRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    const timer = window.setTimeout(() => {
      const focusable = userModalRef.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      focusable?.[0]?.focus();
    }, 0);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
      lastFocusedRef.current?.focus();
    };
  }, [userAuthOpen]);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("menescape-language");
    if (storedLanguage === "en" || storedLanguage === "de" || storedLanguage === "el") {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("menescape-language", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (session && userAuthOpen) {
      setUserAuthOpen(false);
    }
  }, [session, userAuthOpen]);

  useEffect(() => {
    if (!newsletterStatus) return;
    const timer = window.setTimeout(() => setNewsletterStatus(""), 4000);
    return () => window.clearTimeout(timer);
  }, [newsletterStatus]);

  useEffect(() => {
    if (!footerStatus) return;
    const timer = window.setTimeout(() => setFooterStatus(""), 4000);
    return () => window.clearTimeout(timer);
  }, [footerStatus]);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      setDataLoading(true);
      try {
        // Load packages, gallery, and testimonials in parallel
        const [packagesRes, galleryRes, testimonialsRes] = await Promise.all([
          fetch(api.packages.list, { cache: "no-store" }),
          fetch(api.gallery.list, { cache: "no-store" }),
          fetch(api.testimonials.list, { cache: "no-store" }),
        ]);

        if (!active) return;

        // Process packages
        if (packagesRes.ok) {
          const data = (await packagesRes.json()) as { packages?: PackageDetails };
          if (data.packages && Object.keys(data.packages).length) {
            setPackagesState(data.packages);
            const keys = Object.keys(data.packages) as PackageId[];

            // Find if any package is selected (featured)
            const featuredPackageId = keys.find(key => data.packages![key].isSelected);

            // Set selected package - prefer featured, else first
            if (!selectedPackage || !keys.includes(selectedPackage)) {
              setSelectedPackage(featuredPackageId || keys[0]);
            }
          }
        }

        // Process gallery
        if (galleryRes.ok) {
          const galleryData = (await galleryRes.json()) as GalleryItem[];
          if (galleryData && galleryData.length > 0) {
            setGalleryState(galleryData);
          }
        }

        // Process testimonials
        if (testimonialsRes.ok) {
          const testimonialsData = (await testimonialsRes.json()) as Testimonial[];
          if (testimonialsData && testimonialsData.length > 0) {
            setTestimonialsState(testimonialsData);
          }
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        if (active) setDataLoading(false);
      }
    };
    loadData();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!navOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (!headerRef.current) return;
      if (!headerRef.current.contains(event.target as Node)) {
        setNavOpen(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [navOpen]);

  useEffect(() => {
    updateCarouselState();
    window.addEventListener("resize", updateCarouselState);
    return () => window.removeEventListener("resize", updateCarouselState);
  }, []);

  useEffect(() => {
    if (!selectedPackage) return;
    const nextDate = packagesState[selectedPackage]?.departures[0] ?? "";
    setSelectedDate(nextDate);
    setIncludedOpen(false);
  }, [packagesState, selectedPackage]);

  useEffect(() => {
    if (testimonialPaused) return;
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      setTestimonialIndex((index) => (index + 1) % testimonialsState.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [testimonialPaused, reducedMotion, testimonialsState.length]);

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!items.length) return;
    if (reducedMotion) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [reducedMotion, language]);

  useEffect(() => {
    if (reducedMotion) {
      if (heroBgRef.current) heroBgRef.current.style.transform = "";
      return;
    }
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const offset = Math.min(window.scrollY * 0.03, 12);
        if (heroBgRef.current) {
          heroBgRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
        }
        ticking = false;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reducedMotion]);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const progress = total > 0 ? window.scrollY / total : 0;
      setScrollProgress(progress);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        if (!timelineRef.current) {
          ticking = false;
          return;
        }
        const rect = timelineRef.current.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        const rawProgress = (viewHeight * 0.55 - rect.top) / rect.height;
        const clamped = Math.min(Math.max(rawProgress, 0), 1);
        setItineraryProgress(clamped);
        ticking = false;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("itinerary");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const bookingRect = bookingRef.current?.getBoundingClientRect();
      const footerRect = footerRef.current?.getBoundingClientRect();
      const bookingVisible = bookingRect && bookingRect.top < window.innerHeight && bookingRect.bottom > 0;
      const footerNear = footerRect && footerRect.top < window.innerHeight + 80;
      setShowMiniSummary(rect.bottom < 0 && !bookingVisible && !footerNear);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    if (!sections.length) return;
    let ticking = false;
    const updateActive = () => {
      const headerOffset = headerRef.current?.offsetHeight ?? 0;
      const scrollPos = window.scrollY + headerOffset + 80;
      let current = sections[0].id;
      for (const section of sections) {
        if (scrollPos >= section.offsetTop) {
          current = section.id;
        }
      }
      const mapped = sectionMap[current] ?? current;
      setActiveSection(mapped);
    };
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
    };
    updateActive();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("menescape-token");
    localStorage.removeItem("menescape-user");
    setSession(null);
  };

  return (
    <div className="bg-[var(--bg)] text-[var(--ink)]">
      <Header
        session={session?.user}
        language={language}
        setLanguage={setLanguage}
        languageOptions={languageOptions}
        copy={copy}
        activeSection={activeSection}
        scrollProgress={scrollProgress}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
        headerRef={headerRef}
        onUserAuthOpen={handleUserOpen}
        onLogout={handleLogout}
      />

      <main className="relative z-10 snap-y snap-proximity md:snap-none">
        <div className="ambient-coastal" aria-hidden="true" />
        <div className="light-leak" aria-hidden="true" />
        <div className="journey-rail" aria-hidden="true">
          <span
            className="journey-rail__progress"
            style={{ height: `${Math.min(scrollProgress * 100, 100)}%` }}
          />
        </div>

        <HeroSection copy={copy} motionEnabled={motionEnabled} heroBgRef={heroBgRef} />
        <div className="fade-band" aria-hidden="true" />

        <OffersSection copy={copy} offersCards={offersCards} motionEnabled={motionEnabled} />
        <div className="fade-band" aria-hidden="true" />

        <DestinationsSection
          copy={copy}
          packages={packagesState}
          selectedPackage={selectedPackage || ""}
          setSelectedPackage={setSelectedPackage}
          getDestinationText={getDestinationText}
          carouselRef={carouselRef}
          carouselState={carouselState}
          scrollCarousel={scrollCarousel}
          updateCarouselState={updateCarouselState}
          motionEnabled={motionEnabled}
        />
        <div className="fade-band" aria-hidden="true" />

        <GallerySection
          copy={copy}
          gallery={galleryState}
          getGalleryText={getGalleryText}
          motionEnabled={motionEnabled}
        />
        <div className="fade-band" aria-hidden="true" />

        <CommunitySection
          copy={copy}
          communityPersonas={communityPersonas}
          testimonials={testimonialsState}
          testimonialIndex={testimonialIndex}
          setTestimonialIndex={setTestimonialIndex}
          testimonialPaused={testimonialPaused}
          setTestimonialPaused={setTestimonialPaused}
          getTestimonialText={getTestimonialText}
          motionEnabled={motionEnabled}
          language={language}
        />
        <div className="fade-band" aria-hidden="true" />

        <NewsletterSection
          copy={copy}
          newsletterEmail={newsletterEmail}
          setNewsletterEmail={setNewsletterEmail}
          newsletterStatus={newsletterStatus}
          onSubmit={handleNewsletterSubmit}
          motionEnabled={motionEnabled}
        />
      </main>

      <Footer
        copy={copy}
        footerEmail={footerEmail}
        setFooterEmail={setFooterEmail}
        footerStatus={footerStatus}
        onFooterSubmit={handleFooterNewsletterSubmit}
        footerRef={footerRef}
      />

      {userAuthOpen && (
        <AuthModal
          copy={copy}
          userModalRef={userModalRef}
          onClose={() => setUserAuthOpen(false)}
          onLogin={handleLogin}
        />
      )}

      {modalOpen && localizedPackage && (
        <AffiliateModal
          copy={copy}
          localizedPackage={localizedPackage}
          modalRef={modalRef}
          onClose={() => setModalOpen(false)}
          onConfirm={confirmRedirect}
        />
      )}

      {showMiniSummary && localizedPackage && currentPackage && (
        <MiniSummary
          copy={copy}
          localizedPackage={localizedPackage}
          currentPackage={currentPackage}
          onBookClick={handleBookClick}
        />
      )}
    </div>
  );
}
