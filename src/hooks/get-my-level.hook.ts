import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { getMyLevelRequest } from 'src/apis';
import { ResponseDto } from 'src/apis/dto/response';
import { GetMyLevelResponseDto } from 'src/apis/dto/response/mypage';
import { ACCESS_TOKEN } from 'src/constants';

const useGetMyLevel = () => {

  // state: cookie 상태 //
  const [cookies] = useCookies();
  // state: 사용자 등급 상태 //
  const [userLevel, setUserLevel] = useState<number>(1);
  // state: 사용자 점수 상태 //
  const [userScore, setUserScore] = useState<number>(0);

  // function: get my level response 처리 함수 //
  const getMyLevelResponse = (responseBody: GetMyLevelResponseDto | ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '인증에 실패했습니다.' : '';
    
    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }

    const { userLevel, userScore } = responseBody as GetMyLevelResponseDto;
    setUserLevel(userLevel);
    setUserScore(userScore);
  };

  // function: 로그인 사용자 등급 및 점수 불러오기 //
  const getMyLevel = () => {
    getMyLevelRequest(cookies[ACCESS_TOKEN]).then(getMyLevelResponse);
  };

  return {getMyLevel, userLevel, userScore};

};

export default useGetMyLevel;