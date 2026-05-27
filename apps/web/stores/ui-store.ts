import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SidebarTab = "home" | "diary" | "history" | "stats" | "settings";

interface UIState {
  sidebarCollapsed: boolean;
  activeTab: SidebarTab;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveTab: (tab: SidebarTab) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      activeTab: "home",

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: "ui-preferences",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
