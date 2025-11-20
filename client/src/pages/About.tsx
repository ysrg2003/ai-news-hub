import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Zap, Target, Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline hover:opacity-80">
            <ChevronLeft size={20} className="text-indigo-600" />
            <span className="text-slate-900 font-semibold">Back</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">About AI News Hub</h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            AI News Hub is your premier source for daily artificial intelligence news, trends, and breakthroughs. We believe that AI is transforming the world, and everyone deserves access to clear, accurate, and engaging information about these transformations.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
              <Target className="text-indigo-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h2>
            <p className="text-slate-600">
              To democratize AI knowledge by providing daily, high-quality articles that explain complex AI concepts in simple, accessible language for everyone.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
              <Zap className="text-indigo-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Our Vision</h2>
            <p className="text-slate-600">
              To become the most trusted and comprehensive source for AI news, helping people understand and navigate the rapidly evolving world of artificial intelligence.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
              <Users className="text-indigo-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Our Community</h2>
            <p className="text-slate-600">
              We serve researchers, professionals, students, and curious minds who want to stay informed about the latest developments in artificial intelligence.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Our Values</h2>
          <div className="space-y-4">
            <div className="p-6 bg-white rounded-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Accuracy & Credibility</h3>
              <p className="text-slate-600">
                We prioritize factual accuracy and cite reliable sources. Every article is carefully researched and fact-checked.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Simplicity & Clarity</h3>
              <p className="text-slate-600">
                We explain complex AI concepts in simple, understandable language. No jargon, no confusion—just clear insights.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Independence & Objectivity</h3>
              <p className="text-slate-600">
                We provide unbiased coverage of AI news and trends. Our editorial independence is paramount.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Accessibility</h3>
              <p className="text-slate-600">
                Quality AI news should be free and accessible to everyone, regardless of their background or expertise level.
              </p>
            </div>
          </div>
        </div>

        {/* Content Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">What We Cover</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">🤖 Machine Learning</h3>
              <p className="text-sm text-slate-600">Latest algorithms, techniques, and applications</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">💬 Natural Language Processing</h3>
              <p className="text-sm text-slate-600">Language models, chatbots, and text analysis</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">👁️ Computer Vision</h3>
              <p className="text-sm text-slate-600">Image recognition, object detection, and more</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">✨ Generative AI</h3>
              <p className="text-sm text-slate-600">Creative AI, image generation, and synthesis</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">🚀 AI Applications</h3>
              <p className="text-sm text-slate-600">Real-world use cases across industries</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">⚖️ AI Ethics</h3>
              <p className="text-sm text-slate-600">Responsible AI, bias, and fairness</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with AI News Hub</h2>
          <p className="text-lg text-indigo-100 mb-8">
            Get daily insights into the world of artificial intelligence delivered to your inbox.
          </p>
          <Button className="bg-white text-indigo-600 hover:bg-slate-100">
            Subscribe Now
          </Button>
        </div>
      </div>
    </div>
  );
}
