import { useCookies } from 'react-cookie';
import { updateMyPageInfoRequest } from 'src/apis';
import { ResponseDto } from 'src/apis/dto/response';
import { ACCESS_TOKEN } from 'src/constants';

const useMyPageInfo = () => {

  // state: cookie 상태 //
  const [cookies] = useCookies();

  // function: put my page info response 처리 함수 //
  const updateMyPageInfoResponse = (responseBody: ResponseDto | null) => {
    const message = 
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : 
      responseBody.code === 'AF' ? '인증에 실패했습니다.' : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }
  };

  // function: 로그인 사용자 정보 불러오기 //
  const updateMyPageInfo = () => {
    updateMyPageInfoRequest(cookies[ACCESS_TOKEN]).then(updateMyPageInfoResponse);
  };

  return updateMyPageInfo;
};

export default useMyPageInfo;