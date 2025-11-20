import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Calendar } from "lucide-react";
import { useState } from "react";

export default function Archive() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline hover:opacity-80">
            <ChevronLeft size={20} className="text-indigo-600" />
            <span className="text-slate-900 font-semibold">Back</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Article Archive</h1>
          <div className="w-8" />
        </div>
      </header>

      {/* Archive Hero */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Calendar className="text-5xl" size={48} />
            <h1 className="text-4xl font-bold">Article Archive</h1>
          </div>
          <p className="text-lg text-indigo-100">
            Browse articles from previous months and years
          </p>
        </div>
      </section>

      {/* Archive Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Year & Month Selection */}
          <aside className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="font-bold text-slate-900 mb-4">Filter by Date</h2>

              {/* Year Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Year</h3>
                <div className="space-y-2">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`w-full text-left px-3 py-2 rounded transition ${
                        selectedYear === year
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Month Selection */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Month</h3>
                <div className="grid grid-cols-2 gap-2">
                  {months.map((month, index) => (
                    <button
                      key={month}
                      onClick={() => setSelectedMonth(index + 1)}
                      className={`px-2 py-2 text-sm rounded transition ${
                        selectedMonth === index + 1
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                      }`}
                    >
                      {month.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {months[selectedMonth - 1]} {selectedYear}
              </h2>
              <p className="text-slate-600">
                Articles published in this month
              </p>
            </div>

            {/* Articles List */}
            <div className="space-y-4">
              {/* Placeholder - TODO: Implement actual archive loading */}
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Sample Article {i}
                      </h3>
                      <p className="text-slate-600 mb-3">
                        This is a placeholder for archived articles. Articles will be loaded from the database based on the selected month and year.
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>Machine Learning</span>
                        <span>5 min read</span>
                        <span>{months[selectedMonth - 1]} {i}, {selectedYear}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Read
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-2">
              <Button variant="outline">Previous</Button>
              <Button variant="default">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
