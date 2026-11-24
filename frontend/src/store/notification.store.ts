import { create } from "zustand";

interface NotificationUIState {
  isNotificationPanelOpen: boolean;
  isNotificationDrawerOpen: boolean;

  openNotificationPanel: () => void;
  closeNotificationPanel: () => void;
  toggleNotificationPanel: () => void;

  openNotificationDrawer: () => void;
  closeNotificationDrawer: () => void;

  resetNotificationUI: () => void;
}

export const useNotificationStore = create<NotificationUIState>((set) => ({
  isNotificationPanelOpen: false,
  isNotificationDrawerOpen: false,

  openNotificationPanel: () => set({ isNotificationPanelOpen: true }),

  closeNotificationPanel: () => set({ isNotificationPanelOpen: false }),

  toggleNotificationPanel: () =>
    set((state) => ({
      isNotificationPanelOpen: !state.isNotificationPanelOpen,
    })),

  openNotificationDrawer: () => set({ isNotificationDrawerOpen: true }),

  closeNotificationDrawer: () => set({ isNotificationDrawerOpen: false }),

  resetNotificationUI: () =>
    set({
      isNotificationPanelOpen: false,
      isNotificationDrawerOpen: false,
    }),
}));
