import { create } from "zustand";

interface AuthState {
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
  isForgotPasswordModalOpen: boolean;
  isLoggingOut: boolean;

  openLoginModal: () => void;
  closeLoginModal: () => void;

  openRegisterModal: () => void;
  closeRegisterModal: () => void;

  openForgotPasswordModal: () => void;
  closeForgotPasswordModal: () => void;

  setLoggingOut: (value: boolean) => void;
  resetAuthUI: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoginModalOpen: false,
  isRegisterModalOpen: false,
  isForgotPasswordModalOpen: false,
  isLoggingOut: false,

  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),

  openRegisterModal: () => set({ isRegisterModalOpen: true }),
  closeRegisterModal: () => set({ isRegisterModalOpen: false }),

  openForgotPasswordModal: () => set({ isForgotPasswordModalOpen: true }),

  closeForgotPasswordModal: () => set({ isForgotPasswordModalOpen: false }),

  setLoggingOut: (value) => set({ isLoggingOut: value }),

  resetAuthUI: () =>
    set({
      isLoginModalOpen: false,
      isRegisterModalOpen: false,
      isForgotPasswordModalOpen: false,
      isLoggingOut: false,
    }),
}));
