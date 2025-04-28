import { Comment } from "src/types/interfaces";
import ResponseDto from "../response.dto";


export default interface GetCommentResponseDto extends ResponseDto {
  
  comments: Comment[];
}