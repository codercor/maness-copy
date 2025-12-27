"use client";

import { TranslationProvider } from "@/context/TranslationContext";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TranslationProvider>{children}</TranslationProvider>;
}
