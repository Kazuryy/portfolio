import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

// ---------- Tags ----------

export interface TagConfig {
  color: string;
  bgColor: string;
  darkColor: string;
  darkBgColor: string;
}

interface TagsData {
  tags: Record<string, TagConfig>;
  default: TagConfig;
}

let tagsCache: TagsData | null = null;

function getTagsData(): TagsData {
  if (tagsCache) return tagsCache;

  const tagsPath = path.join(contentDirectory, "tags.json");

  if (!fs.existsSync(tagsPath)) {
    return {
      tags: {},
      default: {
        color: "#4b5563",
        bgColor: "#f3f4f6",
        darkColor: "#9ca3af",
        darkBgColor: "#374151",
      },
    };
  }

  const tagsContent = fs.readFileSync(tagsPath, "utf-8");
  tagsCache = JSON.parse(tagsContent) as TagsData;
  return tagsCache;
}

export function getTagConfig(tag: string): TagConfig {
  const data = getTagsData();
  return data.tags[tag.toLowerCase()] ?? data.default;
}

// ---------- Projects ----------

export interface ProjectFrontmatter {
  title: string;
  description: string;
  date: string;
  tags?: string[];
  coverImage?: string;
  github?: string;
  status: "En cours" | "Terminé";
  featured?: boolean;
  order?: number;
}

export interface Project {
  slug: string;
  frontmatter: ProjectFrontmatter;
  content: string;
}

export function getProjects(locale: string = "fr"): Project[] {
  const dir = path.join(contentDirectory, "projects", locale);

  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf-8"));
      return {
        slug: file.replace(".md", ""),
        frontmatter: data as ProjectFrontmatter,
        content,
      };
    })
    .sort((a, b) => {
      const aOrder = a.frontmatter.order ?? 99;
      const bOrder = b.frontmatter.order ?? 99;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    });
}

export function getProjectBySlug(slug: string, locale: string = "fr"): Project | null {
  const filePath = path.join(contentDirectory, "projects", locale, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const { data, content } = matter(fs.readFileSync(filePath, "utf-8"));
  return { slug, frontmatter: data as ProjectFrontmatter, content };
}

// ---------- Blog ----------

export interface ArticleFrontmatter {
  title: string;
  description: string;
  date: string;
  tags?: string[];
  coverImage?: string;
  draft?: boolean;
}

export interface Article {
  slug: string;
  frontmatter: ArticleFrontmatter;
  content: string;
}

export function getArticles(locale: string = "fr"): Article[] {
  const dir = path.join(contentDirectory, "blog", locale);

  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf-8"));
      return {
        slug: file.replace(".md", ""),
        frontmatter: data as ArticleFrontmatter,
        content,
      };
    })
    .filter((a) => process.env.NODE_ENV === "production" ? !a.frontmatter.draft : true)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

export function getArticleBySlug(slug: string, locale: string = "fr"): Article | null {
  const filePath = path.join(contentDirectory, "blog", locale, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const { data, content } = matter(fs.readFileSync(filePath, "utf-8"));
  return { slug, frontmatter: data as ArticleFrontmatter, content };
}
