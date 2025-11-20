import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

export default function Terms() {
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
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms of Service</h1>

        <div className="prose prose-lg max-w-none">
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing and using the AI News Hub website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on AI News Hub's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>Modifying or copying the materials</li>
            <li>Using the materials for any commercial purpose or for any public display</li>
            <li>Attempting to decompile or reverse engineer any software contained on the website</li>
            <li>Removing any copyright or other proprietary notations from the materials</li>
            <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
          </ul>

          <h2>3. Disclaimer</h2>
          <p>
            The materials on AI News Hub's website are provided on an 'as is' basis. AI News Hub makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2>4. Limitations</h2>
          <p>
            In no event shall AI News Hub or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AI News Hub's website.
          </p>

          <h2>5. Accuracy of Materials</h2>
          <p>
            The materials appearing on AI News Hub's website could include technical, typographical, or photographic errors. AI News Hub does not warrant that any of the materials on its website are accurate, complete, or current. AI News Hub may make changes to the materials contained on its website at any time without notice.
          </p>

          <h2>6. Links</h2>
          <p>
            AI News Hub has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by AI News Hub of the site. Use of any such linked website is at the user's own risk.
          </p>

          <h2>7. Modifications</h2>
          <p>
            AI News Hub may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which AI News Hub is located, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>

          <h2>Contact</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at terms@ainewshub.com
          </p>
        </div>
      </article>
    </div>
  );
}
