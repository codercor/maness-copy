"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function TermsPage() {
    const { t } = useTranslation();

    return (
        <SiteLayout>
            <div className="pt-32 pb-20 px-6 md:px-12 lg:px-24">
                <div className="mx-auto max-w-4xl">
                    <h1 className="font-serif text-4xl font-bold text-[var(--navy)] mb-12">
                        {t.legal.termsTitle}
                    </h1>

                    <div className="prose prose-lg max-w-none text-slate-600">
                        <p>Last updated: {new Date().toLocaleDateString()}</p>

                        <h3>1. Introduction</h3>
                        <p>Welcome to MenEscape. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions.</p>

                        <h3>2. Booking & Payments</h3>
                        <p>All bookings are subject to availability and confirmation. A deposit is required to secure your spot, with the balance due 60 days prior to departure.</p>

                        <h3>3. User Conduct</h3>
                        <p>We are committed to creating a safe, respectful environment. Harassment or inappropriate behavior towards other guests or staff will result in immediate removal from the trip without refund.</p>

                        <h3>4. Cancellations</h3>
                        <p>Cancellations made more than 90 days before departure are fully refundable minus a processing fee. Please refer to your specific booking confirmation for detailed cancellation policies.</p>

                        <h3>5. Liability</h3>
                        <p>MenEscape is not liable for personal injury, loss, or damage to property during your trip. We strongly recommend purchasing comprehensive travel insurance.</p>

                        {/* More placeholder content */}
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
