"use client";

import { useTranslationContext } from "@/context/TranslationContext";

export function useTranslation() {
    return useTranslationContext();
}
