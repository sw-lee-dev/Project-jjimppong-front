import { ChangeEvent, useMemo, useState } from 'react';
import './style.css';
import { AuthPage } from '../../../types/aliases';
import InputBox from '../../../components/InputBox';
import { EmailAuthCheckRequestDto, EmailAuthRequestDto, IdSearchRequestDto } from '../../../apis/dto/request/auth';
import { EmailAuthCheckRequest, EmailAuthRequest } from '../../../apis';
import { ResponseDto } from '../../../apis/dto/response';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { IdSearchResponseDto } from 'src/apis/dto/response/auth';


// interface: 아이디 찾기 컴포넌트 속성 //
interface Props {
  onPageChange: (page: AuthPage) => void;
}
// component: 아이디 찾기 컴포넌트 //
export default function IdSearch(props: Props) {

  const { onPageChange } = props;

  // Axios 인스턴스 생성
  const api = axios.create({
    baseURL: 'http://127.0.0.1:4000', // 기본 URL을 4000 포트로 설정
    timeout: 1000, // 기본 타임아웃 설정 (필요시)
  });

  // state: 사용자 이름 상태 //
  const [userName, setUserName] = useState<string>('');
  // state: 사용자 이메일 상태 //
  const [userEmail, setUserEmail] = useState<string>('');
  // state: 사용자 인증 번호 상태 //
  const [authNumber, setAuthNumber] = useState<string>('');
  // state: 이메일 전송중 상태 //
  const [isLoadingEmailSend, setIsLoadingEmailSend] = useState(false); 

  // state: 사용자 이름 메세지 상태 //
  const [userNameMessage, setUserNameMessage] = useState<string>('');
  // state: 사용자 이메일 메세지 상태 //
  const [userEmailMessage, setUserEmailMessage] = useState<string>('');
  // state: 사용자 인증번호 메세지 상태 //
  const [authNumberMessage, setAuthNumberMessage] = useState<string>('');

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
    userName && userEmail && authNumber && isUserEmailChecked && isAuthNumberChecked 
  ), [
    userName, userEmail, authNumber, isUserEmailChecked, isAuthNumberChecked
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

  // function: id search response 처리 함수 //
  const idSearchResponse = (responseBody: ResponseDto | null) => {
    const message = 
      !responseBody ? '서버에 문제가 있습니다' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다' :
      responseBody.code === 'AF' ? '이메일 인증에 실패하였습니다 ' :
      responseBody.code === 'VF' ? '모두 입력해주세요' : '';
    
    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      if (responseBody && responseBody.code === 'EU') {
        setUserNameMessage(message);
        return;
      }
      alert(message);
      return;
    }

    onPageChange('main');
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

  const onCheckUserEmailClickHandler = () => {
    if (!isUserEmailCheckButtonActive || isLoadingEmailSend) return;
  
    setIsLoadingEmailSend(true); // 시작
  
    const requestBody = { userEmail };
  
    axios.post('http://127.0.0.1:4000/api/v1/auth/email-auth-id', requestBody)
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
  
    axios.post('http://127.0.0.1:4000/api/v1/auth/email-auth-check', requestBody)
      .then(response => {
        emailAuthCheckResponse(response.data);
      })
      .catch(error => {
        alert('인증번호 확인에 실패했습니다. 다시 시도해주세요.');
        console.error("회원가입 중 오류 발생:", error.response ? error.response.data : error);
      });
  };

  // event handler: 아이디 찾기 버튼 클릭 이벤트 처리 //
  const onIdSearchClickHandler = () => {
    if (!userName) setUserNameMessage('이름을 입력해주세요');
    if (!isUserEmailChecked) {
      setUserEmailMessage('인증번호를 전송해주세요');
      setUserEmailMessageError(true);
    }
    if (!isAuthNumberChecked) {
      setAuthNumberMessage('인증번호를 입력해주세요');
      setAuthNumberMessageError(true);
    }
    if (!isIdSearchButtonActive) return;

    const requestBody: IdSearchRequestDto = {
      name: userName, userEmail, authNumber
    };

    axios.post('http://127.0.0.1:4000/api/v1/auth/id-search', requestBody)
    .then((response) => {
      console.log('아이디 찾기 응답:', response.data);
      if (response.data.code === 'SU') {
        alert(`아이디: ${response.data.userId}`);
        onPageChange('sign-in');
      } else {
        alert(`아이디 찾기 실패: ${response.data.message}`);
      }
    })
    .catch(error => {
        alert('인증번호 확인에 실패했습니다. 다시 시도해주세요.');
        console.error("회원가입 중 오류 발생:", error.response ? error.response.data : error);
      });
  };

  // render: 아이디 찾기 컴포넌트 렌더링 //
  return (
    <div id='auth-id-search-container'>
      <div className='header'>아이디 찾기</div>
      <div className='divider'></div>
      <div className='input-container'>

        <InputBox label={'이름'} type={'text'} value={userName} placeholder={'이름을 입력해주세요.'} onChange={onUserNameChangeHandler} message={userNameMessage} isErrorMessage />

        <InputBox label={'이메일'} type={'text'} value={userEmail} placeholder={'이메일을 입력해주세요.'} onChange={onUserEmailChangeHandler} message={userEmailMessage} buttonName={'인증번호 전송'} onButtonClick={onCheckUserEmailClickHandler} isErrorMessage={userEmailMessageError} isButtonActive={isUserEmailCheckButtonActive} isLoading={isLoadingEmailSend} />

        <InputBox label={'인증번호'} type={'text'} value={authNumber} placeholder={'인증번호 입력해주세요.'} onChange={onAuthNumberChangeHandler} message={authNumberMessage} buttonName={'인증번호 확인'} onButtonClick={onCheckAuthNumberClickHandler} isErrorMessage={authNumberMessageError} isButtonActive={isAuthNumberCheckButtonActive} />

      </div>
      <div className='button-container'>
        <div className={IdSearchButtonClass} onClick={onIdSearchClickHandler}>아이디 찾기</div>
        <div className='link' onClick={() => onPageChange('sign-in')}>로그인</div>
      </div>
    </div>
    ) 
}