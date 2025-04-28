import { create } from "zustand";

interface PasswordReCheckStore {
  isVerified: boolean;

  verify: () => void;
  resetVerify: () => void;
}

const useStore = create<PasswordReCheckStore>((set) => ({
  isVerified: sessionStorage.getItem('isVerified') === 'true',

  verify: () => {
    sessionStorage.setItem('isVerified', 'true');
    set ({ isVerified: true });
  },
  resetVerify: () => {
    sessionStorage.removeItem('isVerified');
    set ({ isVerified: false });
  }
}));

export default useStore;