import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES, ARTICLES_PER_PAGE, ARTICLE_TYPE_LABELS } from "@/const";
import { useState } from "react";

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: category } = trpc.categories.bySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: !!slug }
  );

  const { data: articlesData, isLoading } = trpc.articles.byCategory.useQuery(
    {
      categorySlug: slug ?? "",
      page: currentPage,
      limit: ARTICLES_PER_PAGE,
    },
    { enabled: !!slug }
  );

  const articles = articlesData?.articles || [];
  const totalPages = articlesData?.totalPages || 1;

  const categoryInfo = CATEGORIES.find((c) => c.slug === slug);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Category not found</h1>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline hover:opacity-80">
            <ChevronLeft size={20} className="text-indigo-600" />
            <span className="text-slate-900 font-semibold">Back</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">{categoryInfo.name}</h1>
          <div className="w-8" />
        </div>
      </header>

      {/* Category Hero */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{categoryInfo.icon}</span>
            <h1 className="text-4xl font-bold">{categoryInfo.name}</h1>
          </div>
          <p className="text-lg text-indigo-100 max-w-2xl">
            {category?.description || `Explore the latest articles and insights about ${categoryInfo.name} in artificial intelligence.`}
          </p>
        </div>
      </section>

      {/* Articles Section */}
      <main className="container mx-auto px-4 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">No articles in this category yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {articles.map((article: any) => (
                <Link key={article.id} href={`/article/${article.slug}`} className="no-underline">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                    {article.image && (
                      <div className="w-full h-48 bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                        <img
                          src={article.image}
                          alt={article.imageAltText}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-700 rounded">
                          {ARTICLE_TYPE_LABELS[article.articleType as keyof typeof ARTICLE_TYPE_LABELS]}
                        </span>
                        <span className="text-xs text-slate-500">{article.readTime} min read</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{article.title}</h3>
                      <p className="text-slate-600 text-sm mb-4 flex-1 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <span className="text-xs text-slate-500">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                        <ChevronRight className="text-indigo-600" size={16} />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
