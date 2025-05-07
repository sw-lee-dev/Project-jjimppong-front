import { ResponseDto } from './dto/response';
import axios, { AxiosError, AxiosResponse } from 'axios';
import GetRecommandBoardResponseDto from "./dto/response/board/get-recommand-board.response.dto";
import { PatchBoardRequestDto, PostBoardRequestDto, PostCommentRequestDto } from './dto/request/board';
import GetBoardResponseDto from './dto/response/board/get-board-response.dto';

import { EmailAuthCheckRequestDto, EmailAuthRequestDto, IdCheckRequestDto, IdSearchRequestDto, NicknameCheckRequestDto, PasswordResetRequestDto, SignInRequestDto, SignUpRequestDto, SnsSignUpRequestDto } from "./dto/request/auth";
import { SignInResponseDto } from "./dto/response/auth";
import { GetMyLevelResponseDto, GetMyPageBoardResponseDto } from './dto/response/mypage';
import GetSignInUserResponseDto from './dto/response/mypage/get-sign.in.user.response.dto'
import { PasswordReCheckRequestDto, PatchSignInUserRequestDto, PatchSNSSignInUserRequestDto, PostNicknameCheckRequestDto } from './dto/request/mypage';
import GetFilteredBoardResponseDto from './dto/response/board/get-filtered-board.response';
import { GetCommentResponseDto } from './dto/response/board';
import { GetGoodResponseDto } from './dto/response/board';
import GetHateResponseDto from './dto/response/board/get-hate.response.dto';


// variable: URL 상수 //
const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;

const AUTH_MODULE_URL = `${API_DOMAIN}/api/v1/auth`;
const EMAIL_AUTH_URL = `${AUTH_MODULE_URL}/email-auth`;
const EMAIL_AUTH_CHECK_URL = `${AUTH_MODULE_URL}/email-authcheck`;
const ID_CHECK_URL = `${AUTH_MODULE_URL}/id-check`;
const ID_SEARCH_URL = `${AUTH_MODULE_URL}/id-search`;
const NICKNAME_CHECK_URL = `${AUTH_MODULE_URL}/nickname-check`;
const PASSWORD_RESET_URL = `${AUTH_MODULE_URL}/password-reset`;
const SIGN_UP_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_URL = `${AUTH_MODULE_URL}/sign-in`;
const SNS_SIGN_UP_URL = `${AUTH_MODULE_URL}/sns-sign-up`;
export const SNS_SIGN_IN_URL = (sns: 'kakao' | 'naver') => `${AUTH_MODULE_URL}/sns/${sns}`;

const BOARD_MODULE_URL = `${API_DOMAIN}/api/v1/board`;
const PATCH_BOARD_URL = (boardNumber: number | string) => `${BOARD_MODULE_URL}/${boardNumber}`;
const GET_WRITE_DATE_SORTED_BOARD_URL = `${BOARD_MODULE_URL}/write-date`;
const GET_VIEW_COUNT_SORTED_BOARD_URL = `${BOARD_MODULE_URL}/view-count`;
const GET_GOOD_COUNT_SORTED_BOARD_URL = `${BOARD_MODULE_URL}/good-count`;
const POST_BOARD_URL = `${BOARD_MODULE_URL}`;
const POST_COMMENT_URL = (boardNumber: number | string) => `${BOARD_MODULE_URL}/${boardNumber}/comment`;
const GET_COMMENT_URL = (boardNumber: number | string) => `${BOARD_MODULE_URL}/${boardNumber}/comment`;

const DELETE_COMMENT_URL = (commentNumber : number | string, boardNumber : number | string) => `${BOARD_MODULE_URL}/${boardNumber}/comment/${commentNumber}`;

const PUT_GOOD_URL = (boardNumber: number | string) => `${BOARD_MODULE_URL}/${boardNumber}/good`;
const GET_GOOD_URL = (boardNumber: number | string) => `${BOARD_MODULE_URL}/${boardNumber}/good`;
const PUT_HATE_URL = (boardNumber: number | string) => `${BOARD_MODULE_URL}/${boardNumber}/hate`;
const GET_HATE_URL = (boardNumber: number | string) => `${BOARD_MODULE_URL}/${boardNumber}/hate`;
const PUT_BOARD_VIEW_COUNT_URL = (boardNumber : number | string) => `${BOARD_MODULE_URL}/view-count/${boardNumber}`;
const PUT_BOARD_SCORE_URL = (boardNumber : number | string) => `${BOARD_MODULE_URL}/board-score/${boardNumber}`;


const MAIN_MODULE_URL = `${API_DOMAIN}/api/v1/main`;
const GET_RECOMMAND_BOARD_URL = `${MAIN_MODULE_URL}`;

const MY_PAGE_MODULE_URL = `${API_DOMAIN}/api/v1/my-page`;
const PASSWORD_RECHECK_URL = `${MY_PAGE_MODULE_URL}`;
const POST_NICKNAME_CHECK_URL = `${MY_PAGE_MODULE_URL}/my-main/nickname-check`;
const PUT_MY_PAGE_INFO_URL = `${MY_PAGE_MODULE_URL}/my-main`;
const GET_MY_LEVEL_URL = `${MY_PAGE_MODULE_URL}/my-main/level`;
const GET_MY_PAGE_BOARD_URL = `${MY_PAGE_MODULE_URL}/my-main/my-boards`;
const GET_SIGN_IN_USER_URL = `${MY_PAGE_MODULE_URL}/my-main/user-info`;
const PATCH_SIGN_IN_USER_URL = `${MY_PAGE_MODULE_URL}/my-main/user-info`;
const PATCH_SNS_SIGN_IN_USER_URL = `${MY_PAGE_MODULE_URL}/my-main/sns-user-info`;

const FILE_UPLOAD_URL = `${API_DOMAIN}/file/upload`;

// variable: //
const multipartFormData = { headers: { 'Content-Type': 'multipart/form-data' } };

// function: 게시글 작성 API 요청 함수 추가 //
export const postBoardRequest = async (requestBody: PostBoardRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_BOARD_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 게시글 수정 API 요청 함수 //
export const patchBoardRequest = async (boardNumber: number | string, requestBody: PatchBoardRequestDto, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_BOARD_URL(boardNumber), requestBody, bearerAuthorization(accessToken))
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 게시글 삭제 API 요청 함수 //
export const deleteBoardRequest = async (boardNumber: number | string, accessToken: string) => {
    const url = `${BOARD_MODULE_URL}/${boardNumber}`;
    const responseBody = await axios.delete(url, bearerAuthorization(accessToken))
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 게시글 상세 조회 API 요청 함수
export const getBoardRequest = async (boardNumber: number | string, accessToken?: string) => {
    const url = `${BOARD_MODULE_URL}/${boardNumber}`;
    const config = accessToken ? bearerAuthorization(accessToken) : {}; // accessToken이 있을 경우만 Authorization 헤더 포함
    const responseBody = await axios.get(url, config)
        .then(responseSuccessHandler<GetBoardResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function : delete comment API 요청 함수
export const deleteCommentRequest = async (commentNumber : number, accessToken : string, boardNumber : number) =>{
    const responseBody = await axios.delete(DELETE_COMMENT_URL(commentNumber, boardNumber), bearerAuthorization(accessToken))
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: post comment API 요청 함수 //
export const postCommentRequest = async (requestBody: PostCommentRequestDto, boardNumber: number | string, accessToken: string) => {
    const responseBody = await axios.post(POST_COMMENT_URL(boardNumber), requestBody, bearerAuthorization(accessToken))
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get comment API 요청 함수 //
export const getCommentRequest = async (boardNumber: number | string) => {
    const responseBody = await axios.get(GET_COMMENT_URL(boardNumber))
        .then(responseSuccessHandler<GetCommentResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
};


// function: Authorization Bearer 헤더 //
const bearerAuthorization = (accessToken: string) => ({ headers: { 'Authorization': `Bearer ${accessToken}` } })

// function: response 성공 처리 함수 //
const responseSuccessHandler = <T = ResponseDto>(response: AxiosResponse<T>) => {
    // response.data: Response Body
    const { data } = response;
    return data;
};

// function: response 실패 처리 함수 //
const responseErrorHandler = (error: AxiosError<ResponseDto>) => {
    if (!error.response) return null;
    const { data } = error.response;
    return data;
};

// function: get filterd board API 요청 함수 //
export const getWriteDateFilterdBoardRequest = async () => {
    const responseBody = await axios.get(GET_WRITE_DATE_SORTED_BOARD_URL)
        .then(responseSuccessHandler<GetFilteredBoardResponseDto>)
        .catch(responseErrorHandler)
    //console.log(GET_WRITE_DATE_SORTED_BOARD_URL);
    return responseBody;
};

export const getViewCountFilterdBoardRequest = async () => {
    const responseBody = await axios.get(GET_VIEW_COUNT_SORTED_BOARD_URL)
        .then(responseSuccessHandler<GetFilteredBoardResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
};

export const getGoodCountFilterdBoardRequest = async () => {
    const responseBody = await axios.get(GET_GOOD_COUNT_SORTED_BOARD_URL)
        .then(responseSuccessHandler<GetFilteredBoardResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
};

// function : get recommand board API 요청 함수 //
export const getRecommandBoardRequest = async () => {
    const responseBody = await axios.get(GET_RECOMMAND_BOARD_URL)
        .then(responseSuccessHandler<GetRecommandBoardResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
};

// function : put view count API 요청 함수 //

export const putViewCount = async (boardNumber : number | string) => {
    const responseBody = await axios.put(PUT_BOARD_VIEW_COUNT_URL(boardNumber))
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: put board score API  요청 함수 //
export const putBoardScore = async (boardNumber: number | string) => {
    const responseBody = await axios.put(PUT_BOARD_SCORE_URL(boardNumber))
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get good API 요청 함수 //
export const getGoodRequest = async (boardNumber: number | string) => {
    const responseBody = await axios.get(GET_GOOD_URL(boardNumber))
        .then(responseSuccessHandler<GetGoodResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: put good API 요청 함수 //
export const putGoodRequest = async (boardNumber: number | string, accessToken: string) => {
    const responseBody = await axios.put(PUT_GOOD_URL(boardNumber), {}, bearerAuthorization(accessToken))
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get hate API 요청 함수 //
export const getHateRequest = async (boardNumber: number | string) => {
    const responseBody = await axios.get(GET_HATE_URL(boardNumber))
        .then(responseSuccessHandler<GetHateResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: put hate API 요청 함수 //
export const putHateRequest = async (boardNumber: number | string, accessToken: string) => {
    const responseBody = await axios.put(PUT_HATE_URL(boardNumber), {}, bearerAuthorization(accessToken))
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: email auth API 요청 함수 //
export const EmailAuthRequest = async (requestBody: EmailAuthRequestDto) => {
    const responseBody = await axios.post(EMAIL_AUTH_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: email auth check API 요청 함수 //
export const EmailAuthCheckRequest = async (requestBody: EmailAuthCheckRequestDto) => {
    const responseBody = await axios.post(EMAIL_AUTH_CHECK_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: id check API 요청 함수 //
export const idCheckRequest = async (requestBody: IdCheckRequestDto) => {
    const responseBody = await axios.post(ID_CHECK_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: id search API 요청 함수 //
export const IdSearchRequest = async (requestBody: IdSearchRequestDto) => {
    const responseBody = await axios.post(ID_SEARCH_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: nickname check API 요청 함수 //
export const nicknameCheckRequest = async (requestBody: NicknameCheckRequestDto) => {
    const responseBody = await axios.post(NICKNAME_CHECK_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: password reset API 요청 함수 //
export const PasswordResetRequest = async (requestBody: PasswordResetRequestDto) => {
    const responseBody = await axios.post(PASSWORD_RESET_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: sns sign up API 요청 함수 //
export const SnsSignUpRequest = async (requestBody: SnsSignUpRequestDto) => { 
    const responseBody = await axios.post(SNS_SIGN_UP_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: sign up API 요청 함수 //
export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const responseBody = await axios.post(SIGN_UP_URL, requestBody)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: sign in API 요청 함수 //
export const signInRequest = async (requestBody: SignInRequestDto) => {
    const responseBody = await axios.post(SIGN_IN_URL, requestBody)
        .then(responseSuccessHandler<SignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: password recheck API 요청 함수 //
export const passwordReCheckRequest = async (requestBody: PasswordReCheckRequestDto, accessToken: string) => {
    const responseBody = await axios.post(PASSWORD_RECHECK_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: post(update) nickname check API 요청 함수 //
export const updateNicknameCheckRequest = async (requestBody: PostNicknameCheckRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_NICKNAME_CHECK_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: put(update) my page info API 요청 함수 //
export const updateMyPageInfoRequest = async (accessToken: string) => {
    const responseBody = await axios.put(PUT_MY_PAGE_INFO_URL, {}, bearerAuthorization(accessToken))
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get my level API 요청 함수 //
export const getMyLevelRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_MY_LEVEL_URL, bearerAuthorization(accessToken))
        .then(responseSuccessHandler<GetMyLevelResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get my page board API 요청 함수 //
export const getMyPageBoardRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_MY_PAGE_BOARD_URL, bearerAuthorization(accessToken))
    .then(responseSuccessHandler<GetMyPageBoardResponseDto>)
    .catch(responseErrorHandler);
    return responseBody;
};

// function: get sign in user API 요청 함수 //
export const getSignInUserRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_SIGN_IN_USER_URL, bearerAuthorization(accessToken))
        .then(responseSuccessHandler<GetSignInUserResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: patch sign in user API 요청 함수 //
export const patchSignInUserRequest = async (requestBody: PatchSignInUserRequestDto, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_SIGN_IN_USER_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: patch sns sign in user API 요청 함수 //
export const patchSNSSignInUserRequest = async (requestBody: PatchSNSSignInUserRequestDto, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_SNS_SIGN_IN_USER_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: file upload 요청 함수 //
export const fileUploadRequest = async (requestBody: FormData) => {
    const responseBody = await axios.post(FILE_UPLOAD_URL, requestBody, multipartFormData)
        .then(responseSuccessHandler<string>)
        .catch(error => null);
    return responseBody;
};