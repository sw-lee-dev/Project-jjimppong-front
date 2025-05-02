import JoinType from 'src/types/aliases/join-type.alias';
import { create } from 'zustand';

// interface: 로그인 유저 정보 상태 구조 //
interface SignInUserStore {
  userId: string;
  userNickname: string;
  userPassword: string;
  userLevel: number;
  name: string;
  address: string;
  detailAddress: string | null;
  gender: string;
  profileImage: string | null;
  joinType: JoinType;

  setUserId: (userId: string) => void;
  setUserNickname: (userNickname: string) => void;
  setUserPassword: (userPassword: string) => void;
  setUserLevel: (userLevel: number) => void;
  setName: (name: string) => void;
  setAddress: (address: string) => void;
  setDetailAddress: (detailAddress: string | null) => void;
  setGender: (gender: string) => void;
  setProfileImage: (profileImage: string | null) => void;
  setJoinType: (JoinType: JoinType) => void;

  resetSignInUser: () => void;
}

// function: 로그인 유저 정보 스토어 생성 함수 //
const useStore = create<SignInUserStore>(set => ({
  userId: '',
  userNickname: '',
  userPassword: '',
  userLevel: 1,
  name: '',
  address: '',
  detailAddress: null,
  gender: '',
  profileImage: null,
  joinType: 'NORMAL',

  setUserId: (userId: string) => set(state => ({ ...state, userId })),
  setUserNickname: (userNickname: string) => set(state => ({ ...state, userNickname })),
  setUserPassword: (userPassword: string) => set(state => ({ ...state, userPassword })),
  setUserLevel: (userLevel: number) => set(state => ({ ...state, userLevel })),
  setName: (name: string) => set(state => ({ ...state, name })),
  setAddress: (address: string) => set(state => ({ ...state, address })),
  setDetailAddress: (detailAddress: string | null) => set(state => ({ ...state, detailAddress })),
  setGender: (gender: string) => set(state => ({ ...state, gender })),
  setProfileImage: (profileImage: string | null) => set(state => ({ ...state, profileImage })),
  setJoinType: (joinType: JoinType) => set(state => ({ ...state, joinType })),

  resetSignInUser: () => set(state => ({
    ...state,
    userId: '',
    userNickname: '',
    userPassword: '',
    userLevel: 1,
    name: '',
    address: '',
    detailAddress: null,
    gender: '',
    profileImage: null,
    joinType: 'NORMAL'
  }))
}));

export default useStore;