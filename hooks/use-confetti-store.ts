import { create } from "zustand";

type ConfettiStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useConfettiStore = create<ConfettiStore>((set) => {
  return {
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  };
});

