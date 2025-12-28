"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function GdprPage() {
    const { t } = useTranslation();

    return (
        <SiteLayout>
            <div className="pt-32 pb-20 px-6 md:px-12 lg:px-24">
                <div className="mx-auto max-w-4xl">
                    <h1 className="font-serif text-4xl font-bold text-[var(--navy)] mb-12">
                        {t.legal.gdprTitle}
                    </h1>

                    <div className="prose prose-lg max-w-none text-slate-600">
                        <p>Last updated: {new Date().toLocaleDateString()}</p>

                        <h3>Introduction</h3>
                        <p>At MenEscape, we prioritize your privacy and are dedicated to processing your personal data transparently, securely, and in accordance with the General Data Protection Regulation (GDPR).</p>

                        <h3>Data Controller</h3>
                        <p>MenEscape acts as the data controller for any personal information collected through this platform. If you have questions about how your data is handled, please contact us at contact@menescape.com.</p>

                        <h3>Your Rights</h3>
                        <p>Under the GDPR, you have the following rights regarding your personal data:</p>
                        <ul className="list-disc pl-5 mb-4">
                            <li className="mb-1"><strong>Right to Access:</strong> You can request a copy of the personal data we hold about you.</li>
                            <li className="mb-1"><strong>Right to Rectification:</strong> You can request corrections to inaccurate or incomplete data.</li>
                            <li className="mb-1"><strong>Right to Erasure:</strong> You can request the deletion of your personal data ("Right to be Forgotten") under certain conditions.</li>
                            <li className="mb-1"><strong>Right to Restrict Processing:</strong> You can ask us to limit how we use your data.</li>
                            <li><strong>Right to Data Portability:</strong> You can request to receive your personal data in a structured, commonly used format.</li>
                        </ul>

                        <h3>Legal Basis for Processing</h3>
                        <p>We process your data based on:</p>
                        <ul className="list-disc pl-5 mb-4">
                            <li><strong>Contractual Necessity:</strong> To fulfill bookings and services you request.</li>
                            <li><strong>Consent:</strong> When you subscribe to our newsletter or agree to cookies.</li>
                            <li><strong>Legitimate Interests:</strong> To improve our platform and ensure security.</li>
                        </ul>

                        <h3>Contact Us</h3>
                        <p>If you wish to exercise any of your rights or have concerns about your data, please reach out to our Data Protection Officer at contact@menescape.com.</p>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
