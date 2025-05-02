export default interface SnsSignUpRequestDto { 
    userNickname: string;
    name: string;
    userEmail: string;
    authNumber: string;
    address: string;
    detailAddress?: string;
    gender: string;
    userLevel: string;
    profileImage?: string;
    joinType: 'KAKAO' | 'NAVER';
    snsId: string;
}