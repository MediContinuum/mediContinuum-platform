import { create } from "zustand";

export type ThemePreference = "light" | "dark" | "system";

interface UIState {
  isSidebarCollapsed: boolean;
  isMobileNavigationOpen: boolean;
  activeModal: string | null;
  theme: ThemePreference;

  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;

  openMobileNavigation: () => void;
  closeMobileNavigation: () => void;

  openModal: (modalName: string) => void;
  closeModal: () => void;

  setTheme: (theme: ThemePreference) => void;

  resetUI: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  isMobileNavigationOpen: false,
  activeModal: null,
  theme: "system",

  toggleSidebar: () =>
    set((state) => ({
      isSidebarCollapsed: !state.isSidebarCollapsed,
    })),

  setSidebarCollapsed: (value) => set({ isSidebarCollapsed: value }),

  openMobileNavigation: () => set({ isMobileNavigationOpen: true }),

  closeMobileNavigation: () => set({ isMobileNavigationOpen: false }),

  openModal: (modalName) => set({ activeModal: modalName }),

  closeModal: () => set({ activeModal: null }),

  setTheme: (theme) => set({ theme }),

  resetUI: () =>
    set({
      isSidebarCollapsed: false,
      isMobileNavigationOpen: false,
      activeModal: null,
      theme: "system",
    }),
}));
