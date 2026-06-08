"use client";

import Link from "next/link";
import Nav from "./nav";
import { useLanguage } from "@/lib/LanguageContext";
import { useState, useEffect } from "react";
import PenaltyGame from "@/components/PenaltyGame";
import ChampionVoting from "@/components/ChampionVoting";

export default function Home() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const quickLinks = [
    { href: "/standings", icon: "📊", title: t.home.liveStandings, color: "from-green-400 to-emerald-500" },
    { href: "/top-scorers", icon: "⚽", title: t.home.topScorers, color: "from-amber-400 to-orange-500" },
    { href: "/team-dynamics", icon: "🏆", title: t.home.teamDynamics, color: "from-blue-400 to-cyan-500" },
    { href: "/player-dynamics", icon: "🌟", title: t.home.playerDynamics, color: "from-purple-400 to-pink-500" },
  ];

  const stats = [
    { value: "48", label: "Teams", icon: "🏈" },
    { value: "16", label: "Host Cities", icon: "🏙️" },
    { value: "104", label: "Matches", icon: "⚽" },
    { value: "3", label: "Host Nations", icon: "🌍" },
  ];

  const keyDates = [
    { event: "Opening", date: "Jun 11", icon: "🎉" },
    { event: "Group Stage", date: "Jun 11-26", icon: "⚽" },
    { event: "Round of 16", date: "Jul 4-6", icon: "💥" },
    { event: "Final", date: "Jul 19", icon: "🏆" },
  ];

  const stadiumImages = [
    { name: "MetLife", city: "New York", flag: "🇺🇸" },
    { name: "AT&T", city: "Dallas", flag: "🇺🇸" },
    { name: "SoFi", city: "Los Angeles", flag: "🇺🇸" },
    { name: "Azteca", city: "Mexico City", flag: "🇲🇽" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <Nav />
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center py-12 sm:py-16 lg:py-20 relative">
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 rounded-full backdrop-blur mb-8">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-red-300 text-sm font-semibold tracking-wide">COMING SOON</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 via-teal-400 to-cyan-400 mb-6 bg-300% animate-shimmer">
              WORLD CUP 2026
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-green-200/80 max-w-2xl mx-auto mb-10">
              {t.home.heroSubtitle}
            </p>

            {/* Host Countries */}
            <div className="flex justify-center gap-6 flex-wrap">
              {[
                { flag: "🇺🇸", name: "USA" },
                { flag: "🇨🇦", name: "Canada" },
                { flag: "🇲🇽", name: "Mexico" },
              ].map((country) => (
                <div key={country.name} className="text-center group">
                  <div className="text-4xl sm:text-5xl mb-2 group-hover:scale-125 transition-transform">{country.flag}</div>
                  <div className="text-white/60 text-xs">{country.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Banner */}
        <div className={`grid grid-cols-4 gap-4 sm:gap-8 mb-12 sm:mb-16 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {stats.map((stat, i) => (
            <div key={stat.value} className="text-center p-4 sm:p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:bg-white/10 transition-all hover:scale-105">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">{stat.value}</div>
              <div className="text-white/60 text-xs sm:text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Interactive Section: Game + Voting */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Penalty Game */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-400/20 rounded-3xl p-5 sm:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/20 rounded-full blur-3xl"></div>
            <div className="text-center mb-4 relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 flex items-center justify-center gap-2">
                <span className="text-3xl animate-bounce">⚽</span>
                Penalty Shootout
              </h2>
              <p className="text-green-200/60 text-xs sm:text-sm mt-1">Test your skills!</p>
            </div>
            <PenaltyGame />
          </div>

          {/* Champion Voting */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-400/20 rounded-3xl p-5 sm:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
            <ChampionVoting />
          </div>
        </div>

        {/* Quick Links */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 sm:mb-16 transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className="group">
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 sm:p-6 text-center hover:bg-white/10 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-white/10">
                <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-125 transition-transform">{link.icon}</div>
                <div className="text-white font-semibold text-sm">{link.title}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Key Dates */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-5 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span>📅</span>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Key Dates</span>
            </h3>
            <div className="space-y-3">
              {keyDates.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">{item.event}</div>
                  </div>
                  <div className="text-blue-400 font-bold text-xs bg-blue-500/20 px-2 py-1 rounded">{item.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stadiums */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-5 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span>🏟️</span>
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Featured Stadiums</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {stadiumImages.map((stadium, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                  <div className="text-xl mb-1">{stadium.flag}</div>
                  <div className="text-white font-semibold text-xs">{stadium.name}</div>
                  <div className="text-white/50 text-xs">{stadium.city}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className={`bg-gradient-to-r from-white/5 to-white/10 backdrop-blur border border-white/10 rounded-3xl p-6 sm:p-8 text-center transition-all duration-1000 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">About the Tournament</span>
          </h3>
          <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {t.home.aboutText}
          </p>
        </div>
      </main>

      <footer className="border-t border-white/10 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-3">
            <span className="text-xl">⚽</span>
            <span className="text-white/40 text-xs">2026 World Cup Tracker</span>
            <span className="text-xl">⚽</span>
          </div>
          <p className="text-white/30 text-xs">{t.home.footer}</p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-shimmer {
          background-size: 200% 200%;
          animation: shimmer 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
