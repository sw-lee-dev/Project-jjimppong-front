export default interface SignUpRequestDto { 
    userId: string;
    userNickname: string;
    userPassword: string;
    name: string;
    userEmail: string;
    authNumber: string;
    address: string;
    detailAddress: string;
    gender: string;
    userLevel: string;
    profileImage?: string;
    joinType: string;
    snsId?: string
}