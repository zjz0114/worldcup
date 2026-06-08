import { en } from './en';
import { zh } from './zh';
import { ko } from './ko';
import { ja } from './ja';
import { ru } from './ru';
import { es } from './es';
import { fr } from './fr';
import { de } from './de';
import { pt } from './pt';
import { ar } from './ar';

export const translations = {
  en,
  zh,
  ko,
  ja,
  ru,
  es,
  fr,
  de,
  pt,
  ar,
} as const;

export type Language = keyof typeof translations;

export const languages: { code: Language; name: string; nativeName: string; flag: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

export type TranslationKey = keyof typeof en;
