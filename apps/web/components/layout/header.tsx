"use client";

import { useTranslations } from "next-intl";
import { Bell, User, Flame, LogOut, Settings, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchDiary } from "@/components/search-diary";
import { ThemeToggle } from "../theme/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores";

interface HeaderProps {
  streak: number;
  onSelectDiary?: (diaryId: string) => void;
  onLogout?: () => void;
  onNavigate?: (tab: string) => void;
}

export function Header({
  streak,
  onSelectDiary,
  onLogout,
  onNavigate,
}: HeaderProps) {
  const t = useTranslations("layout");
  const user = useAuthStore((s) => s.user);
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 relative z-20">
      {/* Search */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <div className="relative w-full hidden sm:block">
          <SearchDiary onSelectDiary={onSelectDiary} />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Streak */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20">
          <Flame className="w-4 h-4 text-warning" />
          <span className="text-sm font-medium text-warning">
            {t("streakDays", { count: streak })}
          </span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </Button>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-accent transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onNavigate?.("settings")}
              className="cursor-pointer"
            >
              <UserCircle className="w-4 h-4 mr-2" />
              {t("profile")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onNavigate?.("settings")}
              className="cursor-pointer"
            >
              <Settings className="w-4 h-4 mr-2" />
              {t("settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
