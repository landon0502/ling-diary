"use client";

import { useTranslations } from "next-intl";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@teispace/next-themes";

export function ThemeButton() {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-card/80 border border-border backdrop-blur-sm hover:bg-secondary transition-colors"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
      <Moon className="absolute top-2.5 left-2.5 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
      <span className="sr-only">{t("toggle")}</span>
    </button>
  );
}
