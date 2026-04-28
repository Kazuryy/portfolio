import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
};

const skills = {
  "Cybersécurité": ["Pentest web", "Forensics", "Reverse", "OSINT", "Burp Suite", "Wireshark", "Wazuh"],
  "Infra / DevOps": ["Proxmox", "Docker", "Traefik", "Authentik", "Ansible", "Grafana", "Prometheus", "n8n"],
  "Dev": ["Python", "TypeScript", "Rust", "C#", "Bash", "React", "FastAPI", "SvelteKit"],
  "Réseaux": ["VLANs", "OSPF", "Stormshield", "Tailscale", "ProtonVPN", "SNMPv3", "Zabbix"],
};

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
      {/* Header */}
      <div className="mb-16">
        <h1
          className="text-4xl font-bold tracking-tight mb-4 gradient-title"
          style={{ display: "inline-block" }}
        >
          {t("title")}
        </h1>
        <p className="mt-6 text-lg leading-8 max-w-2xl" style={{ color: "var(--color-text-secondary)" }}>
          {t("description")}
        </p>
      </div>

      {/* Formation */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--color-text)" }}>
          {t("section_formation")}
        </h2>
        <div
          className="rounded-2xl border p-6"
          style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
                {t("school")}
              </h3>
              <p className="mt-1 text-sm" style={{ color: "var(--color-accent)" }}>
                {t("degree")}
              </p>
              <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {t("school_desc")}
              </p>
            </div>
            <span className="text-sm shrink-0" style={{ color: "var(--color-text-muted)" }}>
              {t("period")}
            </span>
          </div>
        </div>
      </section>

      {/* Compétences */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--color-text)" }}>
          {t("section_skills")}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {Object.entries(skills).map(([category, items]) => (
            <div
              key={category}
              className="rounded-2xl border p-6"
              style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}
            >
              <h3 className="text-base font-semibold mb-4" style={{ color: "var(--color-text)" }}>
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: "var(--color-bg-secondary)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--color-text)" }}>
          {t("section_contact")}
        </h2>
        <div className="flex flex-wrap gap-4">
          {[
            { href: "https://github.com/Kazuryy", icon: Github, label: "GitHub", external: true },
            { href: "https://linkedin.com/in/kazury", icon: Linkedin, label: "LinkedIn", external: true },
          ].map(({ href, icon: Icon, label, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all hover:scale-105 hover:border-indigo-500/50"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-card)",
                color: "var(--color-text-secondary)",
              }}
            >
              <Icon className="h-4 w-4" />
              {label}
              <ExternalLink className="h-3 w-3 opacity-50" />
            </a>
          ))}
          <Link
            href="/contact"
            className="flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all hover:scale-105 hover:border-indigo-500/50"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-card)",
              color: "var(--color-text-secondary)",
            }}
          >
            <Mail className="h-4 w-4" />
            Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
