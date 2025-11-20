import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function Privacy() {
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
      <article className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none">
          <h2>Introduction</h2>
          <p>
            AI News Hub ("we", "us", "our", or "Company") operates the AI News Hub website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
          </p>

          <h2>Information Collection and Use</h2>
          <p>
            We collect several different types of information for various purposes to provide and improve our Service to you.
          </p>

          <h3>Types of Data Collected:</h3>
          <ul>
            <li>Personal Data: Email address, name, and usage information</li>
            <li>Usage Data: Browser type, IP address, pages visited, and time spent</li>
            <li>Cookies and Tracking: We use cookies to track your preferences</li>
          </ul>

          <h2>Use of Data</h2>
          <p>AI News Hub uses the collected data for various purposes:</p>
          <ul>
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information for improving our Service</li>
          </ul>

          <h2>Security of Data</h2>
          <p>
            The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the top of this Privacy Policy.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@ainewshub.com
          </p>
        </div>
      </article>
    </div>
  );
}
