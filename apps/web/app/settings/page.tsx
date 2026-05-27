"use client";

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

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            个人信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <div className="font-medium text-foreground">用户昵称</div>
              <div className="text-sm text-muted-foreground">
                user@example.com
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm">
            编辑资料
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            应用设置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">
                  深色模式
                </div>
                <div className="text-xs text-muted-foreground">
                  当前主题: {theme === "dark" ? "深色" : "浅色"}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? "切换到浅色" : "切换到深色"}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">语言</div>
                <div className="text-xs text-muted-foreground">简体中文</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              更改
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">
                  每日提醒
                </div>
                <div className="text-xs text-muted-foreground">每天 20:00</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              设置
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">学习目标</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                每日词数目标
              </span>
              <span className="text-sm font-medium text-foreground">
                150 词
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary w-3/4 rounded-full" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                每周日记目标
              </span>
              <span className="text-sm font-medium text-foreground">
                5 / 7 篇
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
