import ResponseDto from '../response.dto';

// interface: get my level response body DTO //
export default interface GetMyLevelResponseDto extends ResponseDto {
  userLevel: number;
  userScore: number;
}