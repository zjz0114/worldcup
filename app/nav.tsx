"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage, languages } from "@/lib/LanguageContext";

export default function Nav() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navItems = [
    { href: "/", label: t.nav.home, icon: "🏠" },
    { href: "/standings", label: t.nav.standings, icon: "📊" },
    { href: "/top-scorers", label: t.nav.topScorers, icon: "⚽" },
    { href: "/team-dynamics", label: t.nav.teamDynamics, icon: "🏆" },
    { href: "/player-dynamics", label: t.nav.playerDynamics, icon: "⭐" },
  ];

  const currentLang = languages.find((l) => l.code === language);

  return (
    <nav className="bg-gradient-to-r from-green-600/95 via-emerald-600/95 to-green-700/95 backdrop-blur-xl shadow-2xl sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 group">
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">⚽</span>
                <h1 className="text-white text-lg sm:text-2xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text">
                  World Cup 2026
                </h1>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-baseline space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 group"
                >
                  <span className="group-hover:scale-125 transition-transform">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Language Switcher - Desktop */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-xl text-sm font-medium transition-all border border-transparent hover:border-white/20"
              >
                <span className="text-xl">{currentLang?.flag}</span>
                <span className="hidden lg:inline">{currentLang?.nativeName}</span>
                <svg className={`w-4 h-4 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl py-2 z-50 border border-white/20">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all ${
                        language === lang.code
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="flex-1 text-left">{lang.nativeName}</span>
                      {language === lang.code && (
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Language Switcher - Mobile */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="text-white/90 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all"
              >
                {currentLang?.flag}
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl py-2 z-50 border border-white/20">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all ${
                        language === lang.code
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white/90 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-green-700/95 backdrop-blur-xl border-t border-white/10">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-white/90 hover:text-white hover:bg-white/10 flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all"
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
