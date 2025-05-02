import {ResponseDto} from 'src/apis/dto/response';
import JoinType from 'src/types/aliases/join-type.alias';

// interface: get sign in user response body DTO //
export default interface GetSignInUserResponseDto extends ResponseDto {
  userId: string;
  userNickname: string;
  userLevel: number;
  userPassword: string;
  name: string,
  address: string,
  detailAddress: string | null,
  gender: string,
  profileImage: string | null,
  joinType: JoinType
}