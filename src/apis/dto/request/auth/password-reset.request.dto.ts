export default interface PasswordResetRequestDto { 
    userId: string;
    userEmail: string;
    authNumber: string;
}