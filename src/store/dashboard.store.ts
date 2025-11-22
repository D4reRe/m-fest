import { create } from "zustand";

// Define types for state & actions
interface BearState {
  bears: number;
  food: string;
  feed: (food: string) => void;
}

// Create store using the curried form of `create`
export const useBearStore = create<BearState>()((set) => ({
  bears: 2,
  food: "honey",
  feed: (food) => set(() => ({ food })),
}));
