"use client";

import { useState, useEffect } from "react";
import Nav from "../nav";
import { useLanguage } from "@/lib/LanguageContext";

const dataSources = [
  { id: "flashscore", name: "FlashScore", url: "https://www.flashscore.com/football/world/world-cup/#/standings/" },
  { id: "soccerway", name: "Soccerway", url: "https://int.soccerway.com/international/world/world-cup/2026/group-stage/r93873/" },
  { id: "espn", name: "ESPN", url: "https://www.espn.com/soccer/standings/_/league/FIFA.WC" },
  { id: "fifa", name: "FIFA Official", url: "https://www.fifa.com/tournaments/mens/world-cup/2026/standings" },
  { id: "goal", name: "Goal.com", url: "https://www.goal.com/en/world-cup/2026/table/2mvib7y3l3v9f1hsv7x3b3h3l" },
];

export default function StandingsPage() {
  const { t } = useLanguage();
  const [selectedSource, setSelectedSource] = useState(dataSources[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSourceChange = (sourceId: string) => {
    const source = dataSources.find((s) => s.id === sourceId);
    if (source) {
      setSelectedSource(source);
    }
  };

  const openText = t.standings.openIn.replace("{name}", selectedSource.name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <Nav />
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Header */}
        <div className={`text-center mb-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-full backdrop-blur mb-6">
            <span className="text-4xl">📊</span>
            <span className="text-green-300 text-lg font-semibold">{t.standings.title}</span>
          </div>
        </div>

        {/* Source Selection */}
        <div className={`mb-8 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <label className="block text-sm font-medium text-green-200 mb-4 flex items-center gap-2">
            <span className="text-xl">🔍</span>
            {t.standings.selectSource}
          </label>
          <div className="flex flex-wrap gap-3">
            {dataSources.map((source) => (
              <button
                key={source.id}
                onClick={() => handleSourceChange(source.id)}
                className={`px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                  selectedSource.id === source.id
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl shadow-green-500/30 scale-105"
                    : "bg-white/5 text-green-200 hover:bg-white/10 border border-green-400/20 hover:border-green-400/40"
                }`}
              >
                {source.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 mb-8 relative overflow-hidden transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>

          <div className="flex items-center justify-between mb-8 relative">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border border-green-400/30">
                <span className="text-3xl">📊</span>
              </div>
              <div>
                <div className="text-green-200 text-sm mb-1">{t.standings.currentSource}</div>
                <div className="text-white text-xl font-bold">{selectedSource.name}</div>
              </div>
            </div>
          </div>

          <a
            href={selectedSource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-5 px-6 rounded-2xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-green-500/30 text-lg overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <span>{openText}</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </a>
        </div>

        {/* Note Section */}
        <div className={`bg-blue-500/10 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-6 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div>
              <h3 className="font-semibold text-blue-200 mb-3 text-base flex items-center gap-2">
                <span>{t.standings.note}</span>
              </h3>
              <ul className="text-sm text-blue-200/80 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>{t.standings.note1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>{t.standings.note2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>{t.standings.note3}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
