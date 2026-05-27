"use client";

import { useLocale } from "next-intl";
import { LOCALE_COOKIE, localeLabels, locales, type Locale } from "@/src/i18n/config";
import Cookies from "js-cookie";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;

  const switchTo = (next: Locale) => {
    Cookies.set(LOCALE_COOKIE, next, { path: "/", expires: 365 });
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="w-5 h-5 text-muted-foreground" />
          <span className="sr-only">{localeLabels[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => switchTo(loc)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span>{localeLabels[loc]}</span>
            {locale === loc && (
              <span className="ml-auto w-2 h-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
