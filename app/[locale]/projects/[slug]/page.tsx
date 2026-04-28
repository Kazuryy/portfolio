import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { getProjectBySlug, getProjects, getTagConfig, ProjectFrontmatter } from "@/lib/content";
import { TagBadge } from "@/components/TagBadge";
import { MDXImage } from "@/components/MDXImage";

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  const { locales } = await import("@/i18n/navigation");
  return locales.flatMap((locale) =>
    getProjects(locale).map((p) => ({ slug: p.slug }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const project = getProjectBySlug(slug, locale);
  if (!project) return {};
  return { title: project.frontmatter.title, description: project.frontmatter.description };
}

const mdxComponents = { img: MDXImage };

export default async function ProjectPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const project = getProjectBySlug(slug, locale);
  if (!project) notFound();

  return <ProjectContent frontmatter={project.frontmatter} content={project.content} />;
}

function ProjectContent({
  frontmatter,
  content,
}: {
  frontmatter: ProjectFrontmatter;
  content: string;
}) {
  const t = useTranslations("projects");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm mb-10 transition-colors hover:opacity-70"
        style={{ color: "var(--color-text-muted)" }}
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back")}
      </Link>

      <div className="mb-12">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{
              backgroundColor: frontmatter.status === "Terminé" ? "rgba(34, 197, 94, 0.15)" : "rgba(234, 179, 8, 0.15)",
              color: frontmatter.status === "Terminé" ? "#16a34a" : "#ca8a04",
            }}
          >
            {frontmatter.status === "Terminé" ? t("status_done") : t("status_wip")}
          </span>
          {frontmatter.date && (
            <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {new Date(frontmatter.date).toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}
            </span>
          )}
        </div>

        <h1
          className="text-4xl font-bold tracking-tight gradient-title"
          style={{ display: "inline-block" }}
        >
          {frontmatter.title}
        </h1>

        <p className="mt-4 text-lg" style={{ color: "var(--color-text-secondary)" }}>
          {frontmatter.description}
        </p>

        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {frontmatter.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} config={getTagConfig(tag)} size="sm" />
            ))}
          </div>
        )}

        {frontmatter.github && (
          <div className="mt-6">
            <a
              href={frontmatter.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all hover:scale-105"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-card)",
                color: "var(--color-text-secondary)",
              }}
            >
              <Github className="h-4 w-4" />
              {t("see_github")}
              <ExternalLink className="h-3 w-3 opacity-50" />
            </a>
          </div>
        )}
      </div>

      <hr style={{ borderColor: "var(--color-border)" }} className="mb-12" />

      <div className="prose-custom">
        <MDXRemote
          source={content}
          components={mdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]] } }}
        />
      </div>
    </div>
  );
}
