import { browser } from '$app/environment';
import { writable, derived } from 'svelte/store';
import { en } from './en';
import { am } from './am';
import type { Translations } from './en';

export type Locale = 'en' | 'am';

const COOKIE_KEY = 'fidel-locale';
const LOCALES: Record<Locale, Translations> = { en, am };

function getInitialLocale(): Locale {
  if (!browser) return 'en';
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_KEY}=`))
    ?.split('=')[1];
  return cookie === 'am' ? 'am' : 'en';
}

function persistLocale(locale: Locale) {
  if (!browser) return;
  document.cookie = `${COOKIE_KEY}=${locale};path=/;max-age=31536000;SameSite=Lax`;
  document.documentElement.setAttribute('data-locale', locale);
}

export const locale = writable<Locale>(getInitialLocale());

locale.subscribe((l) => persistLocale(l));

export const t = derived(locale, ($locale) => LOCALES[$locale]);

export function toggleLocale() {
  locale.update((l) => (l === 'en' ? 'am' : 'en'));
}
