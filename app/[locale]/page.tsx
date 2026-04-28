import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Github, Linkedin, Mail, Terminal, Shield, Server } from "lucide-react";
import { getProjects } from "@/lib/content";
import { ProjectCard } from "@/components/ProjectCard";

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations("home");
  const featuredProjects = getProjects(locale).filter((p) => p.frontmatter.featured);

  const highlights = [
    { icon: Shield, title: t("highlights_sec_title"), description: t("highlights_sec_desc") },
    { icon: Server, title: t("highlights_infra_title"), description: t("highlights_infra_desc") },
    { icon: Terminal, title: t("highlights_dev_title"), description: t("highlights_dev_desc") },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl pb-2 gradient-title">
              Kazury
            </h1>
            <p className="mt-4 text-xl font-medium" style={{ color: "var(--color-accent)" }}>
              {t("subtitle")}
            </p>
            <p className="mt-6 text-lg leading-8" style={{ color: "var(--color-text-secondary)" }}>
              {t("description")}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/projects"
                className="rounded-full px-6 py-3 text-sm font-semibold shadow-sm transition-colors hover:opacity-90"
                style={{ backgroundColor: "var(--color-text)", color: "var(--color-bg)" }}
              >
                {t("cta_projects")}
              </Link>
              <Link
                href="/blog"
                className="group flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors hover:opacity-70"
                style={{ color: "var(--color-text)" }}
              >
                {t("cta_blog")}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Social links */}
            <div className="mt-10 flex items-center justify-center gap-4">
              {[
                { href: "https://github.com/kazury", icon: Github, label: "GitHub" },
                { href: "https://linkedin.com/in/kazury", icon: Linkedin, label: "LinkedIn" },
                { href: "mailto:contact@kazury.fr", icon: Mail, label: "Email" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all hover:scale-105"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-card)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-indigo-500 to-purple-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </section>

      {/* Highlights */}
      <section className="py-24 border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-5xl grid grid-cols-1 gap-6 sm:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border p-6 transition-colors hover:border-indigo-500/50"
                  style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}
                >
                  <Icon className="h-10 w-10 mb-4" style={{ color: "var(--color-accent)" }} />
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-text)" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "var(--color-text-secondary)" }}>{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      {featuredProjects.length > 0 && (
        <section className="py-24 border-t" style={{ borderColor: "var(--color-border)" }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--color-text)" }}>
                {t("featured_title")}
              </h2>
            </div>
            <div className="mx-auto max-w-5xl grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {t("see_all")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            className="mx-auto max-w-2xl rounded-3xl border p-8 text-center sm:p-12"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}
          >
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: "var(--color-text)" }}>
              {t("cta_title")}
            </h2>
            <p className="mt-4" style={{ color: "var(--color-text-secondary)" }}>
              {t("cta_desc")}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/about"
                className="rounded-full border px-6 py-3 text-sm font-semibold transition-colors hover:opacity-80"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
              >
                {t("cta_more")}
              </Link>
              <Link
                href="/contact"
                className="rounded-full px-6 py-3 text-sm font-semibold transition-colors hover:opacity-90"
                style={{ backgroundColor: "var(--color-text)", color: "var(--color-bg)" }}
              >
                {t("cta_contact")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
