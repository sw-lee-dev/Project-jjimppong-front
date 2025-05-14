import { ChangeEvent, useMemo, useState } from 'react';
import { AuthPage } from 'src/types/aliases';
import InputBox from 'src/components/InputBox';
import { EmailAuthCheckRequestDto, PasswordResetRequestDto } from 'src/apis/dto/request/auth';
import { ResponseDto } from 'src/apis/dto/response';
import axios from 'axios';

import './style.css';

// interface: 비밀번호 찾기 컴포넌트 속성 //
interface Props {
  onPageChange: (page: AuthPage) => void;
}
// component: 비밀번호 찾기 컴포넌트 //
export default function PasswordReset(props: Props) {

  const { onPageChange } = props;

  // variable: URL 상수 //
  const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;
  const AUTH_MODULE_URL = `${API_DOMAIN}/api/v1/auth`;
  const PASSWORD_RESET_URL = `${AUTH_MODULE_URL}/password-reset`;
  const EMAIL_AUTH_ID_URL = `${AUTH_MODULE_URL}/email-auth-id`;
  const EMAIL_AUTH_CHECK_URL = `${AUTH_MODULE_URL}/email-auth-check`;

  // state: 사용자 아이디 상태 //
  const [userId, setUserId] = useState<string>('');
  // state: 사용자 이메일 상태 //
  const [userEmail, setUserEmail] = useState<string>('');
  // state: 사용자 인증 번호 상태 //
  const [authNumber, setAuthNumber] = useState<string>('');
  // state: 이메일 전송중 상태 //
  const [isLoadingEmailSend, setIsLoadingEmailSend] = useState(false); 
  // state: 임시 비밀번호 이메일 전송중 상태 //
  const [isLoadingPasswordReset, setIsLoadingPasswordReset] = useState(false);

  // state: 사용자 아이디 메세지 상태 //
  const [userIdMessage, setUserIdMessage] = useState<string>('');
  // state: 사용자 이메일 메세지 상태 //
  const [userEmailMessage, setUserEmailMessage] = useState<string>('');
  // state: 사용자 인증번호 메세지 상태 //
  const [authNumberMessage, setAuthNumberMessage] = useState<string>('');

  // state: 사용자 아이디 메세지 에러 상태 //
  const [userIdMessageError, setUserIdMessageError] = useState<boolean>(false);
  // state: 사용자 이메일 메세지 에러 상태 //
  const [userEmailMessageError, setUserEmailMessageError] = useState<boolean>(false);
  // state: 사용자 인증번호 메세지 에러 상태 //
  const [authNumberMessageError, setAuthNumberMessageError] = useState<boolean>(false);

  // state: 사용자 이메일 전송 확인 상태 //
  const [isUserEmailChecked, setUserEmailChecked] = useState<boolean>(false);
  // state: 사용자 인증번호 확인 상태 //
  const [isAuthNumberChecked, setAuthNumberChecked] = useState<boolean>(false);

  // variable: 이메일 중복 확인 버튼 활성화 //
  const isUserEmailCheckButtonActive = userEmail !== '';
  // variable: 인증번호 확인 버튼 활성화 //
  const isAuthNumberCheckButtonActive = authNumber !== '';
  // variable: 회원가입 버튼 활성화 //

  const isIdSearchButtonActive = useMemo(() => (
    userId && userEmail && authNumber && isUserEmailChecked && isAuthNumberChecked 
  ), [
    userId, userEmail, authNumber, isUserEmailChecked, isAuthNumberChecked
  ]);

  // variable: 회원가입 버튼 클래스 //
  const IdSearchButtonClass = `button ${isIdSearchButtonActive ? 'primary' : 'disable'} fullwidth`;

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

  // event handler: 사용자 아이디 변경 이벤트 처리 //
  const onUserIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;

    // 1. 영어와 숫자를 제외한 문자 제거
    value = value.replace(/[^a-zA-Z0-9]/g, '');
    setUserId(value);
  
    // 2. 유효성 검사
    const regexp = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,20}$/;
    const isMatch = regexp.test(value);
    const message = isMatch ? '' : '영문, 숫자를 혼용하여 6 ~ 20자 입력해주세요';
    setUserIdMessage(message);
    setUserIdMessageError(!isMatch);
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

  // 이메일 인증번호 전송 처리 함수
  const onCheckUserEmailClickHandler = () => {
    if (!isUserEmailCheckButtonActive || isLoadingEmailSend) return;
  
    setIsLoadingEmailSend(true); // 시작
  
    const requestBody = { userEmail };
  
    axios.post(EMAIL_AUTH_ID_URL, requestBody)
      .then(response => {
        if (response.data.code) {
          alert('인증번호를 전송했습니다.');
          userEmailCheckResponse(response.data);
          setUserEmailChecked(true);
        } else {
          alert('이메일 인증 요청에 실패했습니다.');
          alert(response.data.message);
          setUserEmailChecked(false);
        }
      })
      .catch(error => {
        alert('이메일 인증 요청에 실패했습니다.');
        setUserEmailChecked(false);
      })
      .finally(() => {
        setIsLoadingEmailSend(false); // 종료
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

  // event handler: 비밀번호 찾기 버튼 클릭 이벤트 처리 //
  const onPasswordResetClickHandler = () => {
    if (!userId) setUserIdMessage('아이디를 입력해주세요');
    if (!isUserEmailChecked) {
      setUserEmailMessage('인증번호를 전송해주세요');
      setUserEmailMessageError(true);
    }
    if (!isAuthNumberChecked) {
      setAuthNumberMessage('인증번호를 입력해주세요');
      setAuthNumberMessageError(true);
    }
    if (!isIdSearchButtonActive) return;
  
    const requestBody: PasswordResetRequestDto = {
      userId, userEmail, authNumber
    };
  
    // 로딩 시작
    setIsLoadingPasswordReset(true);
  
    axios.post(PASSWORD_RESET_URL, requestBody)
      .then((response) => {
        console.log('임시비밀번호를 이메일로 전송했습니다.');
        if (response.data.code === 'SU') {
          alert('임시비밀번호를 이메일로 전송했습니다.');
          onPageChange('sign-in');
        } else {
          alert(`아이디 찾기 실패: ${response.data.message}`);
        }
      })
      .catch(error => {
        alert('인증번호 확인에 실패했습니다. 다시 시도해주세요.');
        console.error("회원가입 중 오류 발생:", error.response ? error.response.data : error);
      })
      .finally(() => {
        // 로딩 종료
        setIsLoadingPasswordReset(false);
      });
  };

  // render: 비밀번호 찾기 컴포넌트 렌더링 //
  return (
    <div id='auth-password-reset-container'>
      <div className='header'>비밀번호 찾기</div>
      <div className='divider'></div>
      <div className='input-container'>

        <InputBox label={'아이디'} type={'text'} value={userId} placeholder={'아이디 입력해주세요.'} onChange={onUserIdChangeHandler} message={userIdMessage} isErrorMessage />

        <InputBox label={'이메일'} type={'text'} value={userEmail} placeholder={'이메일을 입력해주세요.'} onChange={onUserEmailChangeHandler} message={userEmailMessage} buttonName={'인증번호 전송'} onButtonClick={onCheckUserEmailClickHandler} isErrorMessage={userEmailMessageError} isButtonActive={isUserEmailCheckButtonActive} isLoading={isLoadingEmailSend} />

        <InputBox label={'인증번호'} type={'text'} value={authNumber} placeholder={'인증번호 입력해주세요.'} onChange={onAuthNumberChangeHandler} message={authNumberMessage} buttonName={'인증번호 확인'} onButtonClick={onCheckAuthNumberClickHandler} isErrorMessage={authNumberMessageError} isButtonActive={isAuthNumberCheckButtonActive} />

      </div>
      <div className='button-container'>
      <div className={IdSearchButtonClass} onClick={onPasswordResetClickHandler}> {isLoadingPasswordReset ? (
        <span className="loading-text">
          전송중
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </span> ) : ( '비밀번호 찾기' )} 
      </div>
        <div className='link' onClick={() => onPageChange('sign-in')}>로그인</div>
      </div>
    </div>
    ) 
}