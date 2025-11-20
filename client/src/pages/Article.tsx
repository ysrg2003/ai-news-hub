import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Share2, Calendar, Clock, User, ChevronLeft, Bookmark } from "lucide-react";
import { ARTICLE_TYPE_LABELS, SOCIAL_SHARE_PLATFORMS } from "@/const";
import { useState } from "react";

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const [tableOfContents, setTableOfContents] = useState<Array<{ id: string; text: string; level: number }>>([]);

  const { data: article, isLoading } = trpc.articles.bySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: !!slug }
  );

  // Extract headings for table of contents
  const extractHeadings = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const headings: Array<{ id: string; text: string; level: number }> = [];

    doc.querySelectorAll("h2, h3").forEach((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;
      headings.push({
        id,
        text: heading.textContent || "",
        level: parseInt(heading.tagName[1]),
      });
    });

    setTableOfContents(headings);
    return doc.body.innerHTML;
  };

  const shareArticle = (platform: string) => {
    if (!article) return;

    const url = window.location.href;
    const title = article.title;

    const shareUrls: Record<string, string> = {
      twitter: `${SOCIAL_SHARE_PLATFORMS.twitter}?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      facebook: `${SOCIAL_SHARE_PLATFORMS.facebook}?u=${encodeURIComponent(url)}`,
      linkedin: `${SOCIAL_SHARE_PLATFORMS.linkedin}?url=${encodeURIComponent(url)}`,
      reddit: `${SOCIAL_SHARE_PLATFORMS.reddit}?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Article not found</h1>
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
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareArticle("twitter")}
              className="gap-2"
            >
              <Share2 size={16} />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Bookmark size={16} />
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-semibold px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
              {ARTICLE_TYPE_LABELS[article.articleType as keyof typeof ARTICLE_TYPE_LABELS]}
            </span>
            <span className="text-sm text-slate-600">
              {article.readTime} min read
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-slate-600 text-sm mb-8 pb-8 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{new Date(article.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{article.authorName || "AI News Hub"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{article.readTime} minutes</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {article.image && (
          <div className="mb-12 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-400 to-indigo-600">
            <img
              src={article.image}
              alt={article.imageAltText ?? article.title}
              className="w-full h-96 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: extractHeadings(article.content ?? "") }}
            />

            {/* Article Footer */}
            <div className="border-t border-slate-200 pt-8 mt-12">
              <div className="flex flex-wrap gap-2 mb-8">
                {/* Tags will be added after fetching from database */}
              </div>

              {/* Share Section */}
              <div className="bg-slate-100 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Share this article</h3>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareArticle("twitter")}
                  >
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareArticle("facebook")}
                  >
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareArticle("linkedin")}
                  >
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareArticle("reddit")}
                  >
                    Reddit
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Table of Contents */}
            {tableOfContents.length > 0 && (
              <Card className="p-6 sticky top-24">
                <h3 className="font-bold text-slate-900 mb-4">Table of Contents</h3>
                <nav className="space-y-2">
                  {tableOfContents.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      className={`block text-sm no-underline hover:text-indigo-600 transition ${
                        heading.level === 3 ? "pl-4 text-slate-600" : "text-slate-700 font-medium"
                      }`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </Card>
            )}

            {/* About Author */}
            <Card className="p-6 mt-6">
              <h3 className="font-bold text-slate-900 mb-3">About the Author</h3>
              <p className="text-sm text-slate-600">
                {article.authorName || "AI News Hub"} is dedicated to bringing you the latest insights and breakthroughs in artificial intelligence.
              </p>
            </Card>
          </aside>
        </div>
      </article>

      {/* Related Articles */}
      <section className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">More from this category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placeholder for related articles */}
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gradient-to-br from-slate-200 to-slate-300" />
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">Related Article {i}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2">Coming soon...</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
