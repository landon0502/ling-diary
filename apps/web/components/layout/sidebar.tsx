"use client";

import type { ComponentType } from "react";
import { Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface SidebarProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
  menus?: Array<{
    path: string;
    label: string;
    icon: ComponentType<{ className?: string }>;
  }>;
}

export function AppSidebar({
  activeTab,
  onTabChange,
  menus = [],
}: SidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center flex-row gap-3 h-16 px-3 border-b border-sidebar-border">
        <div className="flex items-center justify-center size-6 rounded-xl shrink-0">
          <Sparkles className="size-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col group-data-[state=collapsed]:hidden min-w-0">
          <span className="font-bold text-lg truncate">LingDiary</span>
          <span className="text-xs text-muted-foreground">AI 英文日记</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {menus.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={item.path === activeTab}
                    onClick={() => onTabChange?.(item.path)}
                    tooltip={item.label}
                    className="h-9"
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
