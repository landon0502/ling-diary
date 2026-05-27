"use client";
import { useTranslations } from "next-intl";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/layout";
import { Header } from "@/components/layout";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { BookOpen, PenLine, BarChart3, Settings, Home } from "lucide-react";
import { useAuthStore } from "@/stores";
import { useRequest } from "ahooks";

export function Wrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = useTranslations("layout");
  const router = useRouter();
  const pathname = usePathname();
  const handleTabChange = (tab: string) => {
    router.push(tab);
  };

  const { runAsync: doLogout } = useRequest(
    async () => {
      const { logout } = useAuthStore.getState();
      await logout();
    },
    {
      manual: true,
      onSuccess: () => router.push("/login"),
    }
  );

  const menuItems = [
    { path: "/home", label: t("home"), icon: Home },
    { path: "/diary", label: t("writeDiary"), icon: PenLine },
    { path: "/history", label: t("diaryHistory"), icon: BookOpen },
    { path: "/analytics", label: t("analytics"), icon: BarChart3 },
    { path: "/settings", label: t("settings"), icon: Settings },
  ];

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "12em",
            "--sidebar-width-icon": "3rem",
          } as React.CSSProperties
        }
      >
        <div className="flex w-screen h-screen overflow-hidden">
          <AppSidebar
            activeTab={pathname}
            menus={menuItems}
            onTabChange={handleTabChange}
          />
          <SidebarInset>
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header
                streak={15}
                onLogout={doLogout}
                onNavigate={() => router.push("/settings")}
              />
              <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                {children}
              </main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
