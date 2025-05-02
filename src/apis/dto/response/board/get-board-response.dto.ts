import { ResponseDto } from "..";

export default interface GetBoardResponseDto extends ResponseDto {
  userId: string;
  userNickname: string;
  userLevel: number;
  boardContent: string;
  boardTitle: string;
  boardAddressCategory: string;
  boardDetailCategory: string;
  boardWriteDate: string;
  boardViewCount: number;
  boardAddress: string;
  boardImage: string | null;
  boardScore: number;
}