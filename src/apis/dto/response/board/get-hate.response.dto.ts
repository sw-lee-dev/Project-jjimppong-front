// interface : get hate response body DTO //

import ResponseDto from "../response.dto";

export default interface GetHateResponseDto extends ResponseDto {
    hates : string[];
}