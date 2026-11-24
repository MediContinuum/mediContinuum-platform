import { create } from "zustand";

interface UserUIState {
  selectedUserId: string | null;
  isUserSwitcherOpen: boolean;

  setSelectedUserId: (userId: string | null) => void;
  openUserSwitcher: () => void;
  closeUserSwitcher: () => void;
  clearUserSelection: () => void;
}

export const useUserStore = create<UserUIState>((set) => ({
  selectedUserId: null,
  isUserSwitcherOpen: false,

  setSelectedUserId: (userId) => set({ selectedUserId: userId }),

  openUserSwitcher: () => set({ isUserSwitcherOpen: true }),

  closeUserSwitcher: () => set({ isUserSwitcherOpen: false }),

  clearUserSelection: () =>
    set({
      selectedUserId: null,
      isUserSwitcherOpen: false,
    }),
}));
