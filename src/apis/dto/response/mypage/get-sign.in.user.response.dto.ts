import {ResponseDto} from 'src/apis/dto/response';

// interface: get sign in user response body DTO //
export default interface GetSignInUserResponseDto extends ResponseDto {
  userId: string;
  userNickname: string;
  userPassword: string;
  name: string,
  address: string,
  detailAddress: string | null,
  gender: string,
  profileImage: string | null
}