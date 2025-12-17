import { create } from "zustand";

// Define types for state & actions
interface BearState {
  bears: number;
  food: string;
  feed: (food: string) => void;
}

interface DialogState {
  isOpen: boolean;
  activeDialog: number | null;
  open: (id: number) => void;
  close: () => void;
}

// Create store using the curried form of `create`
export const useBearStore = create<BearState>()((set) => ({
  bears: 2,
  food: "honey",
  feed: (food) => set(() => ({ food })),
}));

export const useDialog = create<DialogState>()((set) => ({
  isOpen: false,
  activeDialog: null,
  open: (id) => set(() => ({ isOpen: true, activeDialog: id })),
  close: () =>
    set({
      isOpen: false,
      activeDialog: null,
    }),
}));
