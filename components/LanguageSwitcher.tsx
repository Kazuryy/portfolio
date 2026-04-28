"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggle = () => {
    router.replace(pathname, { locale: locale === "fr" ? "en" : "fr" });
  };

  return (
    <button
      onClick={toggle}
      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors hover:opacity-80"
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        color: "var(--color-text-secondary)",
        cursor: "pointer",
      }}
      aria-label="Switch language"
    >
      {locale === "fr" ? "EN" : "FR"}
    </button>
  );
}
