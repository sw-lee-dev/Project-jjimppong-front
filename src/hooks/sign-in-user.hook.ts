import { useCookies } from 'react-cookie';
import { getSignInUserRequest } from 'src/apis';
import { ResponseDto } from 'src/apis/dto/response';
import { GetSignInUserResponseDto } from 'src/apis/dto/response/mypage';
import { ACCESS_TOKEN, ROOT_PATH } from 'src/constants';
import { useSignInUserStore } from 'src/stores';

const useSignInUser = () => {

  // state: cookie 상태 //
  const [cookies, _, removeCookie] = useCookies();

  // state: 로그인 유저 정보 상태 //
  const { setUserId, setUserNickname, setUserLevel, setName, setAddress, setDetailAddress, setGender, setProfileImage, setJoinType, resetSignInUser } = useSignInUserStore();

  // function: get sign in user response 처리 함수 //
  const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
    const message = 
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '인증에 실패했습니다.' : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      removeCookie(ACCESS_TOKEN, { path: ROOT_PATH });
      resetSignInUser();
      return;
    }

    const { userId, userNickname, userLevel, name, address, detailAddress, gender, profileImage, joinType } = responseBody as GetSignInUserResponseDto;
    setUserId(userId);
    setUserNickname(userNickname);
    setUserLevel(userLevel);
    setName(name);
    setAddress(address);
    setDetailAddress(detailAddress);
    setGender(gender);
    setProfileImage(profileImage);
    setJoinType(joinType);
  };

  // function: 로그인 사용자 정보 불러오기 //
  const getSignInUser = () => {
    getSignInUserRequest(cookies[ACCESS_TOKEN]).then(getSignInUserResponse);
  };

  return getSignInUser;
};

export default useSignInUser;