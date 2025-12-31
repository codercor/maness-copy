"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function PrivacyPage() {
    const { t } = useTranslation();

    return (
        <SiteLayout>
            <div className="pt-32 pb-20 px-6 md:px-12 lg:px-24">
                <div className="mx-auto max-w-4xl">
                    <h1 className="font-serif text-4xl font-bold text-[var(--navy)] mb-12">
                        {t.legal.privacyTitle}
                    </h1>

                    <div className="prose prose-lg max-w-none text-slate-600">
                        <p>Last updated: {new Date().toLocaleDateString()}</p>

                        <h3>1. Information We Collect</h3>
                        <p>We collect information you provide directly to us, such as when you create an account, make a booking, or sign up for our newsletter. This may include your name, email address, and payment information.</p>

                        <h3>2. How We Use Your Information</h3>
                        <p>We use your information to facilitate your bookings, communicate trip updates, and improve our services. We do not sell your personal data to third parties.</p>

                        <h3>3. Data Security</h3>
                        <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>

                        <h3>4. Your Rights</h3>
                        <p>You have the right to access, correct, or delete your personal data. You may also object to processing or request data portability. Contact us at contact@men-escape.com to exercise these rights.</p>

                        {/* More placeholder content */}
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
