import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Search, TrendingUp, BookOpen, ChevronRight } from "lucide-react";
import { APP_TITLE, APP_DESCRIPTION, CATEGORIES, ARTICLES_PER_PAGE, ARTICLE_TYPE_LABELS } from "@/const";
import { Link } from "wouter";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

  // Fetch articles
  const { data: articlesData, isLoading: articlesLoading } = trpc.articles.list.useQuery({
    page: currentPage,
    limit: ARTICLES_PER_PAGE,
    categoryId: selectedCategory || undefined,
    search: searchQuery || undefined,
  });

  // Fetch categories
  const { data: categories } = trpc.categories.list.useQuery();

  const articles = articlesData?.articles || [];
  const totalPages = articlesData?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <span className="text-xl font-bold text-slate-900">{APP_TITLE}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {CATEGORIES.slice(0, 4).map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className="text-sm text-slate-600 hover:text-indigo-600 transition no-underline">
                {cat.name}
              </Link>
            ))}
          </nav>
          <Button variant="outline" size="sm">Search</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{APP_TITLE}</h1>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl">{APP_DESCRIPTION}</p>
          <div className="flex gap-4">
            <Button className="bg-white text-indigo-600 hover:bg-slate-100">Subscribe</Button>
            <Button variant="outline" className="border-white text-white hover:bg-indigo-600">Explore Articles</Button>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory(undefined);
                setCurrentPage(1);
              }}
            >
              All
            </Button>
            {(categories || CATEGORIES).map((cat: any) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentPage(1);
                }}
              >
                {cat.icon} {cat.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {articlesLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto text-slate-400 mb-4" size={48} />
            <p className="text-slate-600">No articles found. Check back soon!</p>
          </div>
        ) : (
          <>
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
                        <span className="text-xs text-slate-500">{new Date(article.createdAt).toLocaleDateString()}</span>
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

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">About</h4>
              <p className="text-slate-400 text-sm">AI News Hub brings you daily insights into the world of artificial intelligence.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {CATEGORIES.slice(0, 4).map((cat) => (
                  <li key={cat.slug}>
                    <Link href={`/category/${cat.slug}`} className="hover:text-white transition no-underline">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/privacy" className="hover:text-white transition no-underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition no-underline">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/contact" className="hover:text-white transition no-underline">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition no-underline">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2024 {APP_TITLE}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
