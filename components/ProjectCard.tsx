import Link from "next/link";
import { Github } from "lucide-react";
import { Project, getTagConfig } from "@/lib/content";
import { TagBadge } from "./TagBadge";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { slug, frontmatter } = project;

  return (
    <Link
      href={`/projects/${slug}`}
      className="group relative flex flex-col gap-4 rounded-2xl border p-6 hover:shadow-lg hover:border-indigo-500/50 transition-all duration-200"
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Status badge */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{
            backgroundColor:
              frontmatter.status === "Terminé"
                ? "rgba(34, 197, 94, 0.15)"
                : "rgba(234, 179, 8, 0.15)",
            color:
              frontmatter.status === "Terminé" ? "#16a34a" : "#ca8a04",
          }}
        >
          {frontmatter.status}
        </span>
        {frontmatter.github && (
          <span
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: "var(--color-text-muted)" }}
          >
            <Github className="h-4 w-4" />
          </span>
        )}
      </div>

      {/* Content */}
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

      {/* Tags */}
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
    </Link>
  );
}
