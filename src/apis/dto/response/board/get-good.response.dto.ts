// interface : get good response body DTO //

import ResponseDto from "../response.dto";

export default interface GetGoodResponseDto extends ResponseDto {
    goods : string[];
}