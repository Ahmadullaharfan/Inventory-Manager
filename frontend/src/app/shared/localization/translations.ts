import { english } from './languages/en';
import { pashto } from './languages/ps';
import { dari } from './languages/fa-af';

export const translations = {
  en: english,
  ps: pashto,
  'fa-AF': dari,
} as const;
