import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { ARTICLES_PER_PAGE, ARTICLE_TYPE_LABELS } from "@/const";
import { useState, useEffect } from "react";
import { Link } from "wouter";

export default function SearchResults() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    const query = params.get("q") || "";
    setSearchQuery(query);
    setCurrentPage(1);

    if (query.trim()) {
      performSearch(query);
    }
  }, [location]);

  const performSearch = async (query: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual search using Gemini API
      // For now, return empty results
      setResults([]);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const paginatedResults = results.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );
  const totalPages = Math.ceil(results.length / ARTICLES_PER_PAGE);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline hover:opacity-80">
            <ChevronLeft size={20} className="text-indigo-600" />
            <span className="text-slate-900 font-semibold">Back</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Search Results</h1>
          <div className="w-8" />
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Search AI News Hub</h1>
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-3 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) {
                  performSearch(e.target.value);
                }
              }}
              className="w-full pl-12 pr-4 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-indigo-500 text-white placeholder-indigo-200"
            />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <main className="container mx-auto px-4 py-12">
        {searchQuery ? (
          <>
            <div className="mb-8">
              <p className="text-slate-600">
                {isLoading
                  ? "Searching..."
                  : results.length === 0
                  ? `No results found for "${searchQuery}"`
                  : `Found ${results.length} result${results.length !== 1 ? "s" : ""} for "${searchQuery}"`}
              </p>
            </div>

            {!isLoading && paginatedResults.length > 0 && (
              <>
                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {paginatedResults.map((article: any) => (
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
                          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-slate-600 text-sm mb-4 flex-1 line-clamp-2">
                            {article.excerpt}
                          </p>
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
          </>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto text-slate-400 mb-4" size={48} />
            <p className="text-slate-600 text-lg">Enter a search query to get started</p>
          </div>
        )}
      </main>
    </div>
  );
}
