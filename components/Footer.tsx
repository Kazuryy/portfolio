"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer
      className="border-t"
      style={{ backgroundColor: "var(--color-bg-secondary)", borderColor: "var(--color-border)" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            © {new Date().getFullYear()} Kazury
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/kazury"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
              style={{ color: "var(--color-text-muted)" }}
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/kazury"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
              style={{ color: "var(--color-text-muted)" }}
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:contact@kazury.fr"
              className="transition-opacity hover:opacity-70"
              style={{ color: "var(--color-text-muted)" }}
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>

          <nav className="flex gap-6">
            <Link
              href="/projects"
              className="text-sm transition-opacity hover:opacity-70"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t("projects")}
            </Link>
            <Link
              href="/blog"
              className="text-sm transition-opacity hover:opacity-70"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t("blog")}
            </Link>
            <Link
              href="/contact"
              className="text-sm transition-opacity hover:opacity-70"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t("contact")}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
