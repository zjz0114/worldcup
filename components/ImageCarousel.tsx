"use client";

import { useState, useEffect } from "react";
import { useLanguage, Language } from "../lib/LanguageContext";

interface Slide {
  key: string;
  icon: string;
  gradient: string;
}

const slides: Slide[] = [
  { key: "politics", icon: "🏛️", gradient: "from-blue-600 to-purple-700" },
  { key: "sports", icon: "⚽", gradient: "from-green-600 to-emerald-700" },
  { key: "finance", icon: "💰", gradient: "from-amber-600 to-yellow-700" },
  { key: "tech", icon: "🤖", gradient: "from-cyan-600 to-blue-700" },
  { key: "culture", icon: "🎭", gradient: "from-pink-600 to-rose-700" },
];

const langToPath: Record<Language, string> = {
  en: 'en',
  zh: 'zh',
  ja: 'ja',
  fr: 'fr',
  ru: 'ru',
  de: 'de',
  es: 'es',
  ko: 'ko',
  pt: 'pt',
  it: 'it',
};

export default function ImageCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t, language } = useLanguage();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const getSlideLink = (key: string): string => {
    const path = langToPath[language] || 'en';
    return `https://polymarket.com/${path}/breaking/${key}`;
  };

  const getSlideTitle = (key: string): string => {
    return t.carousel?.[key as keyof typeof t.carousel] as string || key;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[200px] rounded-xl overflow-hidden group">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => {
          const title = getSlideTitle(slide.key);
          const link = getSlideLink(slide.key);

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Background */}
              <div className={`w-full h-full bg-gradient-to-br ${slide.gradient}`}>
                {/* Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <span className="text-[60px]">{slide.icon}</span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{slide.icon}</span>
                    <h3 className="text-base font-bold text-white">
                      {title}
                    </h3>
                  </div>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-white/90 text-gray-900 rounded-lg font-semibold text-sm transition-all"
                  >
                    {t.carousel?.viewDetails || 'View Details'}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
