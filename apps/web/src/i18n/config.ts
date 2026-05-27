export const locales = ["zh-CN", "en-US"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh-CN";
export const LOCALE_COOKIE = "ling-diary-locale";

export const localeLabels: Record<Locale, string> = {
  "zh-CN": "简体中文",
  "en-US": "English",
};
