import { Board } from "src/types/interfaces";
import { ResponseDto } from "..";

export default interface GetMyBoardResponseDto extends ResponseDto {
  boards: Board[];
}