import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getArticles } from "@/lib/content";
import { ArticleCard } from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const locale = await getLocale();
  const t = await getTranslations("blog");
  const articles = getArticles(locale);

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

      {articles.length === 0 ? (
        <div
          className="text-center py-24 rounded-2xl border"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
        >
          {t("empty")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
