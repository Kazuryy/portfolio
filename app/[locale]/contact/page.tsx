import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  const t = useTranslations("contact");

  const links = [
    {
      label: "GitHub",
      description: t("github_desc"),
      href: "https://github.com/kazury",
      icon: Github,
      external: true,
    },
    {
      label: "LinkedIn",
      description: t("linkedin_desc"),
      href: "https://linkedin.com/in/kazury",
      icon: Linkedin,
      external: true,
    },
    {
      label: "Email",
      description: t("email_desc"),
      href: "mailto:contact@kazury.fr",
      icon: Mail,
      external: false,
    },
  ];

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 lg:px-8">
      <div className="mb-12">
        <h1
          className="text-4xl font-bold tracking-tight gradient-title"
          style={{ display: "inline-block" }}
        >
          {t("title")}
        </h1>
        <p className="mt-4 text-lg" style={{ color: "var(--color-text-secondary)" }}>
          {t("subtitle")}
        </p>
      </div>

      <div className="space-y-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-5 rounded-2xl border p-6 transition-all hover:border-indigo-500/50 hover:shadow-lg"
              style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <Icon className="h-6 w-6" style={{ color: "var(--color-accent)" }} />
              </div>
              <div className="flex-1">
                <p
                  className="font-semibold group-hover:text-indigo-500 transition-colors"
                  style={{ color: "var(--color-text)" }}
                >
                  {link.label}
                </p>
                <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {link.description}
                </p>
              </div>
              {link.external && (
                <ExternalLink
                  className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--color-text-muted)" }}
                />
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
