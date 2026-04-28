import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { getArticleBySlug, getArticles, getTagConfig } from "@/lib/content";
import { TagBadge } from "@/components/TagBadge";
import { MDXImage } from "@/components/MDXImage";

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  const { locales } = await import("@/i18n/navigation");
  return locales.flatMap((locale) =>
    getArticles(locale).map((a) => ({ locale, slug: a.slug }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const article = getArticleBySlug(slug, locale);
  if (!article) return {};
  return { title: article.frontmatter.title, description: article.frontmatter.description };
}

const mdxComponents = { img: MDXImage };

export default async function ArticlePage({ params }: PageProps) {
  const { slug, locale } = await params;
  const article = getArticleBySlug(slug, locale);
  if (!article) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const { frontmatter, content } = article;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm mb-10 transition-colors hover:opacity-70"
        style={{ color: "var(--color-text-muted)" }}
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back")}
      </Link>

      <div className="mb-12">
        {frontmatter.date && (
          <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
            {new Date(frontmatter.date).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

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
