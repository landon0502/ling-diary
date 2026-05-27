"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  User,
  Settings as SettingsIcon,
  Moon,
  Globe,
} from "lucide-react";
import { useTheme } from "@teispace/next-themes";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {t("personalInfo")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <div className="font-medium text-foreground">user@example.com</div>
              <div className="text-sm text-muted-foreground">
                user@example.com
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm">
            {t("editProfile")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            {t("appSettings")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {t("darkMode")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("currentTheme", {
                    theme: theme === "dark" ? t("dark") : t("light"),
                  })}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? t("switchToLight") : t("switchToDark")}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {t("language")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("currentLanguage")}
                </div>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {t("dailyReminder")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("dailyReminderTime")}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              {t("setReminder")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("learningGoal")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {t("dailyWordGoal")}
              </span>
              <span className="text-sm font-medium text-foreground">
                150 words
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary w-3/4 rounded-full" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {t("weeklyDiaryGoal")}
              </span>
              <span className="text-sm font-medium text-foreground">
                5 / 7
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-success w-[71%] rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
