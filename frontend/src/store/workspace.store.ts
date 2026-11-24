import { create } from "zustand";

export type WorkspaceType = "PERSONAL" | "FAMILY" | "ORGANISATION";

interface WorkspaceState {
  activeWorkspaceId: string | null;
  activeWorkspaceType: WorkspaceType;
  isWorkspaceSwitcherOpen: boolean;

  setActiveWorkspace: (
    workspaceId: string | null,
    workspaceType: WorkspaceType,
  ) => void;

  openWorkspaceSwitcher: () => void;
  closeWorkspaceSwitcher: () => void;
  clearWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeWorkspaceId: null,
  activeWorkspaceType: "PERSONAL",
  isWorkspaceSwitcherOpen: false,

  setActiveWorkspace: (workspaceId, workspaceType) =>
    set({
      activeWorkspaceId: workspaceId,
      activeWorkspaceType: workspaceType,
    }),

  openWorkspaceSwitcher: () => set({ isWorkspaceSwitcherOpen: true }),

  closeWorkspaceSwitcher: () => set({ isWorkspaceSwitcherOpen: false }),

  clearWorkspace: () =>
    set({
      activeWorkspaceId: null,
      activeWorkspaceType: "PERSONAL",
      isWorkspaceSwitcherOpen: false,
    }),
}));
