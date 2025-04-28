import { ResponseDto } from "..";

export default interface SignInResponseDto extends ResponseDto { 
    accessToken: string;
    expiration: number;
}