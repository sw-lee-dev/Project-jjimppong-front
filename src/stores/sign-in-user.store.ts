import { create } from 'zustand';

// interface: 로그인 유저 정보 상태 구조 //
interface SignInUserStore {
  userId: string;
  userNickname: string;
  userPassword: string;
  name: string;
  address: string;
  detailAddress: string | null;
  gender: string;
  profileImage: string | null;

  setUserId: (userId: string) => void;
  setUserNickname: (userNickname: string) => void;
  setUserPassword: (userPassword: string) => void;
  setName: (name: string) => void;
  setAddress: (address: string) => void;
  setDetailAddress: (detailAddress: string | null) => void;
  setGender: (gender: string) => void;
  setProfileImage: (profileImage: string | null) => void;

  resetSignInUser: () => void;
}

// function: 로그인 유저 정보 스토어 생성 함수 //
const useStore = create<SignInUserStore>(set => ({
  userId: '',
  userNickname: '',
  userPassword: '',
  name: '',
  address: '',
  detailAddress: null,
  gender: '',
  profileImage: null,

  setUserId: (userId: string) => set(state => ({ ...state, userId })),
  setUserNickname: (userNickname: string) => set(state => ({ ...state, userNickname })),
  setUserPassword: (userPassword: string) => set(state => ({ ...state, userPassword })),
  setName: (name: string) => set(state => ({ ...state, name })),
  setAddress: (address: string) => set(state => ({ ...state, address })),
  setDetailAddress: (detailAddress: string | null) => set(state => ({ ...state, detailAddress })),
  setGender: (gender: string) => set(state => ({ ...state, gender })),
  setProfileImage: (profileImage: string | null) => set(state => ({ ...state, profileImage })),

  resetSignInUser: () => set(state => ({
    ...state,
    userId: '',
    userNickname: '',
    userPassword: '',
    name: '',
    address: '',
    detailAddress: null,
    gender: '',
    profileImage: null
  }))
}));

export default useStore;