import { MyPageBoard } from "src/types/interfaces";
import ResponseDto from "../response.dto";

// interface: get my page board response body DTO //
export default interface GetMyPageBoardResponseDto extends ResponseDto {
  myBoards: MyPageBoard[];
}