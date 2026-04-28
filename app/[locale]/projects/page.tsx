import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getProjects } from "@/lib/content";
import { ProjectCard } from "@/components/ProjectCard";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const locale = await getLocale();
  const t = await getTranslations("projects");
  const projects = getProjects(locale);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mb-12">
        <h1
          className="text-4xl font-bold tracking-tight gradient-title"
          style={{ display: "inline-block" }}
        >
          {t("title")}
        </h1>
        <p className="mt-4 text-lg max-w-2xl" style={{ color: "var(--color-text-secondary)" }}>
          {t("subtitle")}
        </p>
      </div>

      {projects.length === 0 ? (
        <div
          className="text-center py-24 rounded-2xl border"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
        >
          {t("empty")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
