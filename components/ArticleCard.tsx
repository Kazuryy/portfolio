import Link from "next/link";
import { Article, getTagConfig } from "@/lib/content";
import { TagBadge } from "./TagBadge";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { slug, frontmatter } = article;

  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col gap-4 rounded-2xl border p-6 hover:shadow-lg hover:border-indigo-500/50 transition-all duration-200"
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex-1">
        <h3
          className="text-lg font-semibold transition-colors group-hover:text-indigo-500"
          style={{ color: "var(--color-text)" }}
        >
          {frontmatter.title}
        </h3>
        <p
          className="mt-2 text-sm line-clamp-2"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {frontmatter.description}
        </p>
      </div>

      {frontmatter.tags && frontmatter.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {frontmatter.tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag} tag={tag} config={getTagConfig(tag)} size="xs" />
          ))}
          {frontmatter.tags.length > 3 && (
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{
                backgroundColor: "var(--color-bg-secondary)",
                color: "var(--color-text-muted)",
              }}
            >
              +{frontmatter.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {frontmatter.date && (
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          {new Date(frontmatter.date).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}
    </Link>
  );
}
