import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import './style.css';
import { AuthPage } from '../../../types/aliases';
import InputBox from '../../../components/InputBox';
import { EmailAuthCheckRequestDto, EmailAuthRequestDto, IdCheckRequestDto,  NicknameCheckRequestDto,  SignUpRequestDto, SnsSignUpRequestDto } from '../../../apis/dto/request/auth';
import { EmailAuthCheckRequest, EmailAuthRequest, idCheckRequest, nicknameCheckRequest, signUpRequest, SNS_SIGN_IN_URL } from '../../../apis';
import { ResponseDto } from '../../../apis/dto/response';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, JOIN_TYPE, MAIN_ABSOLUTE_PATH, ROOT_PATH, SNS_ID } from '../../../constants';
import JoinType from 'src/types/aliases/join-type.alias';
import axios from 'axios';
import { IdSearchResponseDto } from 'src/apis/dto/response/auth';
import { useNavigate } from 'react-router-dom';

// interface: sns 회원가입 컴포넌트 속성 //
interface Props {
  onPageChange: (page: AuthPage) => void;
}
// component: sns 회원가입 컴포넌트 //
export default function SnsSignUp(props: Props) {

  const { onPageChange } = props;

  // variable: URL 상수 //
  const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;

  const AUTH_MODULE_URL = `${API_DOMAIN}/api/v1/auth`;
  const EMAIL_AUTH_URL = `${AUTH_MODULE_URL}/email-auth`;
  const EMAIL_AUTH_CHECK_URL = `${AUTH_MODULE_URL}/email-auth-check`;
  const SNS_SIGN_UP_URL = `${AUTH_MODULE_URL}/sns-sign-up`;

  const navigate = useNavigate();

  // state: cookie 상태 //
  const [cookies, setCookie, removeCookie] = useCookies();

  // state: 이메일 전송중 상태 //
  const [isLoadingEmailSend, setIsLoadingEmailSend] = useState(false); 

  // state: 사용자 이름 상태 //
  const [userName, setUserName] = useState<string>('');
  // state: 사용자 주소 상태 //
  const [userAddress, setUserAddress] = useState<string>('');
  // state: 사용자 상세 주소 상태 //
  const [userDetailAddress, setUserDetailAddress] = useState<string>('');
  // state: 사용자 닉네임 상태 //
  const [userNickname, setUserNickname] = useState<string>('');
  // state: 사용자 이메일 상태 //
  const [userEmail, setUserEmail] = useState<string>('');
  // state: 사용자 인증 번호 상태 //
  const [authNumber, setAuthNumber] = useState<string>('');
  // state: 사용자 성별 상태 //
  const [gender, setGender] = useState<'남' | '여' | null>(null);

  // state: 사용자 이름 메세지 상태 //
  const [userNameMessage, setUserNameMessage] = useState<string>('');
  // state: 사용자 닉네임 메세지 상태 //
  const [userNicknameMessage, setUserNicknameMessage] = useState<string>('');
  // state: 사용자 이메일 메세지 상태 //
  const [userEmailMessage, setUserEmailMessage] = useState<string>('');
  // state: 사용자 인증번호 메세지 상태 //
  const [authNumberMessage, setAuthNumberMessage] = useState<string>('');
  // state: 사용자 주소 메세지 상태 //
  const [userAddressMessage, setUserAddressMessage] = useState<string>('');
  // state: 사용자 주소 메세지 상태 //
  const [GenderMessage, setGenderMessage] = useState<string>('');

  // state: 사용자 닉네임 메세지 에러 상태 //
  const [userNicknameMessageError, setUserNicknameMessageError] = useState<boolean>(false);
  // state: 사용자 이메일 메세지 에러 상태 //
  const [userEmailMessageError, setUserEmailMessageError] = useState<boolean>(false);
  // state: 사용자 인증번호 메세지 에러 상태 //
  const [authNumberMessageError, setAuthNumberMessageError] = useState<boolean>(false);

  // state: 사용자 닉네임 중복 확인 상태 //
  const [isUserNicknameChecked, setUserNicknameChecked] = useState<boolean>(false);
  // state: 사용자 이메일 전송 확인 상태 //
  const [isUserEmailChecked, setUserEmailChecked] = useState<boolean>(false);
  // state: 사용자 인증번호 확인 상태 //
  const [isAuthNumberChecked, setAuthNumberChecked] = useState<boolean>(false);

  // state: 가입 경로 상태 //
  const [joinType, setJoinType] = useState<JoinType>('NORMAL');
  // state: SNS ID 상태 //
  const [snsId, setSnsId] = useState<string | null>(null);

  // variable: 닉네임 중복 확인 버튼 활성화 //
  const isUserNicknameCheckButtonActive = userNickname !== '';
  // variable: 이메일 중복 확인 버튼 활성화 //
  const isUserEmailCheckButtonActive = userEmail !== '';
  // variable: 인증번호 확인 버튼 활성화 //
  const isAuthNumberCheckButtonActive = authNumber !== '';
  // variable: 회원가입 버튼 활성화 //
  const isSignUpButtonActive = useMemo(() => (
    userName && userNickname && userAddress && 
    userEmail && authNumber && gender 
    && isUserNicknameChecked && isUserEmailChecked 
    && isAuthNumberChecked 
  ), [
    userName, userNickname, userAddress, userEmail, authNumber, gender,
    isUserNicknameChecked, isUserEmailChecked, isAuthNumberChecked
  ]);
  // variable: 회원가입 버튼 클래스 //
  const signUpButtonClass = `button ${isSignUpButtonActive ? 'primary' : 'disable'} fullwidth`;
  // variable: SNS 회원가입 여부 //
  const isSns = cookies[JOIN_TYPE] !== undefined && cookies[SNS_ID] !== undefined;

  // function: 다음 포스트 코드 팝업 오픈 함수 //
  const open = useDaumPostcodePopup();

  // function: 다음 포스트 코드 완료 처리 함수 //
  const daumPostCompleteHandler = (data: Address) => {
    const { address } = data;
    setUserAddress(address);
    setUserAddressMessage('');
  };

  // function: nickname check response 처리 함수 //
  const nicknameCheckResponse = (responseBody: ResponseDto | null) => {
    const message = 
      !responseBody ? '서버에 문제가 있습니다' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다' :
      responseBody.code === 'EU' ? '이미 사용중인 닉네임입니다' :
      responseBody.code === 'VF' ? '닉네임을 입력하세요' :
        '사용 가능한 닉네임입니다';
  
    const isSuccess = responseBody !== null && responseBody.code === 'SU';
  
    setUserNicknameMessage(message);
    setUserNicknameMessageError(!isSuccess);
    setUserNicknameChecked(isSuccess);
  };

  // function: userEmailCheck response 처리 함수 //
  const userEmailCheckResponse = (responseBody: ResponseDto | null) => {
    const message = 
      !responseBody ? '서버에 문제가 있습니다' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다' :
      responseBody.code === 'EU' ? '이미 사용중인 이메일입니다' :
      responseBody.code === 'MF' ? '메일 전송에 실패했습니다' :
      responseBody.code === 'VF' ? '이메일을 입력하세요' :
        '인증번호가 전송되었습니다';
  
    const isSuccess = responseBody !== null && responseBody.code === 'SU';
  
    setUserEmailMessage(message);
    setUserEmailMessageError(!isSuccess);
    setUserEmailChecked(isSuccess);
  };

  const emailAuthCheckResponse = (responseBody: ResponseDto | null) => {
    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    
    const message = 
      !responseBody ? '서버에 문제가 있습니다' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다' :
      responseBody.code === 'EU' ? '인증번호가 틀렸습니다' :
      responseBody.code === 'VF' ? '인증번호를 입력하세요' :
      '인증이 완료되었습니다';
  
    setAuthNumberMessage(message);
    setAuthNumberMessageError(!isSuccess);
    setAuthNumberChecked(isSuccess);
  };

    // onChange에서는 필터링 없이 그대로 저장
    const onUserNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setUserName(value);
    
      // 유효성 체크 (한글 외 입력은 가능하지만 활성화 불가)
      const regexp = /^[가-힣]{2,5}$/;
      const isMatch = regexp.test(value);
      const message = isMatch ? '' : '한글로 2 ~ 5자 입력해주세요';
      setUserNameMessage(message);
    };

  // event handler: 사용자 닉네임 변경 이벤트 처리 //
  const onUserNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserNickname(value);

    setUserNicknameMessage('');
  };

  // event handler: 사용자 이메일 변경 이벤트 처리 //
  const onUserEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;

    // 1. 한글 제거
    value = value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
    setUserEmail(value);

    // 2. 이메일 유효성 검사
    const regexp = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
    const isMatch = regexp.test(value);
    const message = isMatch ? '' : '이메일 형식으로 작성해주세요';
    setUserEmailMessage(message);
    setUserEmailChecked(isMatch);
    setUserEmailMessageError(!isMatch);

  };

  // event handler: 사용자 인증번호 변경 이벤트 처리 //
  const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAuthNumber(value);

    setAuthNumberMessage('');
  };

  // event handler: 사용자 주소 변경 이벤트 처리 //
  const onUserAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserAddress(value);
  };

  // event handler: 사용자 상세 주소 변경 이벤트 처리 //
  const onUserDetailAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserDetailAddress(value);
  };

  // event handler: 닉네임 중복 확인 버튼 클릭 이벤트 처리 //
  const onCheckUserNicknameClickHandler = () => {
    if (!isUserNicknameCheckButtonActive) return;
    
    const requestBody: NicknameCheckRequestDto = { userNickname };
    nicknameCheckRequest(requestBody).then(nicknameCheckResponse);
  };

  // event handler: 주소 검색 버튼 클릭 이벤트 처리 //
  const onSearchAddressClickHandler = () => {
    open({ onComplete: daumPostCompleteHandler });
  };

  // effect: 컴포넌트 로드시 실행할 함수 //
  useEffect(() => {
    const joinType = cookies[JOIN_TYPE];
    const snsId = cookies[SNS_ID];
  
    if (!joinType || !snsId) {
      alert('SNS 인증 정보가 없습니다. 다시 로그인해주세요.');
      onPageChange('sign-in');
      return;
    }
  
    setJoinType(joinType);
    setSnsId(snsId);
  }, []);

  const GenderClickhandler = (selectedGender: '남' | '여' | null) => {
    if (gender === selectedGender) {
      setGender(null);
    } else {
      setGender(selectedGender);
    }
  };


  // 이메일 중복확인 및 인증번호 전송 처리 함수
  const onCheckUserEmailClickHandler = () => {
    if (!isUserEmailCheckButtonActive) return;

  // 로딩 상태 시작
  setIsLoadingEmailSend(true);

  const requestBody = {
    userEmail: userEmail
  };

  // 이메일 중복 확인 후 인증번호 전송
  axios.post(EMAIL_AUTH_URL, requestBody)
    .then(response => {
      console.log('Server Response:', response.data); 
      if (response.data.code) {
        alert('인증번호를 전송했습니다.');
        userEmailCheckResponse(response.data);
        setUserEmailChecked(true);
      } else {
        alert('이메일 인증 요청에 실패했습니다.');
        alert(response.data.message);  // 실패 메시지 처리
        setUserEmailChecked(false);
      }
    })
    .catch(error => {
      alert('이메일 인증 요청에 실패했습니다.');
      setUserEmailChecked(false);
    })
    .finally(() => {
      // 로딩 상태 종료
      setIsLoadingEmailSend(false);
    });
};


  // 이메일, 인증번호 인증 확인 함수 //
  const onCheckAuthNumberClickHandler = () => {
    if (!isAuthNumberCheckButtonActive) return;
  
    const requestBody: EmailAuthCheckRequestDto = {
      userEmail: userEmail.trim(),
      authNumber: authNumber.trim()
    };
  
    axios.post(EMAIL_AUTH_CHECK_URL, requestBody)
      .then(response => {
        emailAuthCheckResponse(response.data);
      })
      .catch(error => {
        alert('인증번호 확인에 실패했습니다. 다시 시도해주세요.');
        console.error("회원가입 중 오류 발생:", error.response ? error.response.data : error);
      });
  };

  // event handler: sns 회원가입 버튼 클릭 이벤트 처리 //
  const onSnsSignUpClickHandler = () => {
    if (!userName) setUserNameMessage('이름을 입력해주세요');
    if (!userAddress) setUserAddressMessage('주소를 입력해주세요');
    if (!gender) setGenderMessage('성별을 클릭해주세요');
    if (!isUserNicknameChecked) {
      setUserNicknameMessage('닉네임 중복 확인해주세요');
      setUserNicknameMessageError(true);
    }
    if (!isUserEmailChecked) {
      setUserEmailMessage('인증번호를 전송해주세요');
      setUserEmailMessageError(true);
    }
    if (!isAuthNumberChecked) {
      setAuthNumberMessage('인증번호를 입력해주세요');
      setAuthNumberMessageError(true);
    }
    if (!isSignUpButtonActive) return;

    const userLevel = '1';
    
    //  쿠키에서 직접 가져오기
    const cookieJoinType = cookies[JOIN_TYPE];
    const cookieSnsId = cookies[SNS_ID];

    if (!cookieJoinType || !cookieSnsId) {
      alert('SNS 정보가 유실되었습니다. 다시 로그인해주세요.');
      return;
    }

    const ACCESS_TOKEN = 'accessToken';

    const requestBody: SnsSignUpRequestDto = {
      userNickname, name: userName, userEmail, userLevel, authNumber, gender: gender!,
      address: userAddress, detailAddress: userDetailAddress, joinType: cookieJoinType.toUpperCase(), snsId: cookieSnsId,
    };

    axios.post(SNS_SIGN_UP_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      console.log('회원가입 응답:', response.data);
      
      if (response.data.code === 'SU') {
        const { accessToken, expiration } = response.data;

        // 로그인 처리: accessToken을 로컬 스토리지에 저장
        const expires = new Date(Date.now() + expiration * 1000); 
        // 쿠키에 저장
        setCookie(ACCESS_TOKEN, accessToken, { path: ROOT_PATH, expires }); 
        
        removeCookie(JOIN_TYPE, { path: ROOT_PATH });
        removeCookie(SNS_ID, { path: ROOT_PATH });
    
        alert('회원가입이 완료되었습니다.');
    
        setTimeout(() => {
          navigate(MAIN_ABSOLUTE_PATH); // 실제 페이지 이동
        }, 0);        
      } else {
        alert(`회원가입 실패: ${response.data.message}`);
      }
    })
    .catch((error) => {
      console.error('회원가입 중 오류 발생:', error);
      
      // 네트워크 오류 혹은 CORS 오류
      if (!error.response) {
        // 서버로부터 응답이 없으면 네트워크 오류 또는 CORS 오류
        alert('서버에 연결할 수 없습니다. 네트워크 오류가 발생했습니다.');
      } else {
        // 서버로부터 응답이 왔지만 에러 코드가 4xx 또는 5xx
        if (error.response.status >= 400 && error.response.status < 500) {
          // 클라이언트 측 오류 (예: 400 Bad Request)
          alert(`클라이언트 오류: ${error.response.status} - ${error.response.data.message}`);
        } else if (error.response.status >= 500) {
          // 서버 오류 (예: 500 Internal Server Error)
          alert(`서버 오류: ${error.response.status} - ${error.response.data.message}`);
        }
      }
    
      // 요청 데이터 로깅 (디버깅용)
      console.log('요청 데이터:', requestBody);
    });
  }
  
    // event handler: sns 회원가입 취소 버튼 클릭 이벤트 처리 //
    const onSnsSignUpCancelClickHandler = () => {
      // 쿠키 삭제
      removeCookie(JOIN_TYPE, { path: '/' });
      removeCookie(SNS_ID, { path: '/' });
  
      // 페이지 새로고침
      window.location.reload();
    };

    useEffect(() => {
      const handleBeforeUnload = () => {
        // 페이지를 떠날 때 쿠키 삭제
        removeCookie(JOIN_TYPE, { path: '/' });
        removeCookie(SNS_ID, { path: '/' });
  
        // 페이지가 떠날 때 로그인 페이지로 리디렉션
        window.location.reload();
      };
  
      // beforeunload 이벤트 리스너 등록
      window.addEventListener('beforeunload', handleBeforeUnload);
  
      // 컴포넌트가 언마운트될 때 이벤트 리스너 정리
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, []);

  // render: sns 회원가입 컴포넌트 렌더링 //
  return (
    <div id='auth-sign-up-container'>
      <div className='header'>SNS 회원가입</div>
      <div className='divider'></div>
      <div className='input-container'>

        <InputBox label={'이름'} type={'text'} value={userName} placeholder={'이름을 입력해주세요.'} onChange={onUserNameChangeHandler} message={userNameMessage} isErrorMessage />

        <InputBox label={'닉네임'} type={'text'} value={userNickname} placeholder={'닉네임 입력해주세요.'} onChange={onUserNicknameChangeHandler} message={userNicknameMessage} buttonName={'중복 확인'} onButtonClick={onCheckUserNicknameClickHandler} isErrorMessage={userNicknameMessageError} isButtonActive={isUserNicknameCheckButtonActive} />

        <div className="gender-button-box">
          <button className={`gender-button male ${gender === '남' ? 'active' : ''}`} onClick={() => GenderClickhandler('남')}>남</button>
          <button className={`gender-button female ${gender === '여' ? 'active' : ''}`} onClick={() => GenderClickhandler('여')}>여</button>
        </div>

        <InputBox label={'주소'} type={'text'} value={userAddress} placeholder={'주소를 입력해주세요.'} onChange={onUserAddressChangeHandler} message={userAddressMessage} buttonName={'주소 검색'} onButtonClick={onSearchAddressClickHandler} isErrorMessage isButtonActive readOnly />

        <InputBox label={'상세 주소'} type={'text'} value={userDetailAddress} placeholder={'상세 주소를 입력해주세요.'} onChange={onUserDetailAddressChangeHandler} message={''} />

        <InputBox label={'이메일'} type={'text'} value={userEmail} placeholder={'이메일을 입력해주세요.'} onChange={onUserEmailChangeHandler} message={userEmailMessage} buttonName={'인증번호 전송'} onButtonClick={onCheckUserEmailClickHandler} isErrorMessage={userEmailMessageError} isButtonActive={isUserEmailCheckButtonActive} isLoading={isLoadingEmailSend} />

        <InputBox label={'인증번호'} type={'text'} value={authNumber} placeholder={'인증번호 입력해주세요.'} onChange={onAuthNumberChangeHandler} message={authNumberMessage} buttonName={'인증번호 확인'} onButtonClick={onCheckAuthNumberClickHandler} isErrorMessage={authNumberMessageError} isButtonActive={isAuthNumberCheckButtonActive} />

      </div>
      <div className='button-container'>
        <div className={signUpButtonClass} onClick={onSnsSignUpClickHandler}>SNS 회원가입</div>
        <div className='link' onClick={onSnsSignUpCancelClickHandler}>취소</div>
      </div>
    </div>
    ) 
}