"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("nav");

  const navigation = [
    { name: t("home"), href: "/" as const },
    { name: t("projects"), href: "/projects" as const },
    { name: t("blog"), href: "/blog" as const },
    { name: t("about"), href: "/about" as const },
    { name: t("contact"), href: "/contact" as const },
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full border-b"
      style={{ backgroundColor: "var(--color-bg)", borderColor: "var(--color-border)" }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span
              className="text-xl font-bold gradient-title"
              style={{ display: "inline-block" }}
            >
              Kazury
            </span>
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex lg:hidden gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            type="button"
            className="p-2 rounded-lg"
            style={{ color: "var(--color-text-secondary)" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Menu</span>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-t"
          style={{ backgroundColor: "var(--color-bg)", borderColor: "var(--color-border)" }}
        >
          <div className="space-y-1 px-6 py-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-base font-medium"
                style={{ color: "var(--color-text-secondary)" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
