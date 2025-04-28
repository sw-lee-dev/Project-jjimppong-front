import { ResponseDto } from 'src/apis/dto/response';
import { FilteredBoard } from 'src/types/interfaces';


export default interface GetFilteredBoardResponseDto extends ResponseDto{
    boards : FilteredBoard[];
}