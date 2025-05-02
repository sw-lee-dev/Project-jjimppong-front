import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import Modal from 'src/components/Modal';
import { passwordReCheckRequest } from 'src/apis';
import { PasswordReCheckRequestDto } from 'src/apis/dto/request/mypage';
import { ResponseDto } from 'src/apis/dto/response';
import { usePasswordReCheckStore } from 'src/stores';
import { ACCESS_TOKEN, MAIN_ABSOLUTE_PATH, MY_PAGE_MAIN_ABSOLUTE_PATH } from 'src/constants';

import './style.css';

// interface: 로그인 사용자 비밀번호 일치여부 컴포넌트 속성 //
interface PasswordReCheckProps {
  onModalViewChange: () => void;
}

// component: 로그인 사용자 비밀번호 일치여부 컴포넌트 //
function PasswordReCheck({onModalViewChange}: PasswordReCheckProps) {

  // state: 로그인 사용자 비밀번호 재확인 상태 - 마이페이지로 이동시 //
  const { verify } = usePasswordReCheckStore();

  // state: cookie 상태 //
  const [cookies] = useCookies();
  
  // state: 사용자 비밀번호 상태 //
  const [inputPassword, setInputPassword] = useState<string>('');
  
  // state: 비밀번호 입력에 따른 메세지 상태 //
  const [inputPasswordMessage, setInputPasswordMessage] = useState<string>('');

  // variable: accessToken //
  const accessToken = cookies[ACCESS_TOKEN];
  
  // variable: 확인 버튼 활성화 //
  const isPasswordReCheckActive = inputPassword;
  
  // variable: 버튼 클래스 //
  const buttonCalss = `button ${isPasswordReCheckActive ? 'able' : 'disable'}`;
  
  // variable: 확인 버튼 참조값 //
  const buttonRef = useRef<HTMLButtonElement>(null);
  // variable: 입력창 참조값 //
  const inputRef = useRef<HTMLInputElement>(null);

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: password recheck response 처리 함수 //
  const postPasswordReCheckResponse = (responseBody: ResponseDto | null) => {
    const message = 
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '인증에 실패했습니다.' :
      responseBody.code === 'PN' ? '비밀번호가 일치하지 않습니다.' : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      if (responseBody && responseBody.code === 'PN') {
        setInputPasswordMessage(message);
        return;
      }
      alert(message);
      return;
    }
    /* 비밀번호 재확인 인증완료 함수 호출 */
    verify();
    onModalViewChange();
    navigator(MY_PAGE_MAIN_ABSOLUTE_PATH, { replace: true });
  };

  // event handler: 비밀번호 입력 이벤트 처리 //
  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputPassword(value);
  };

  // event handler: 확인 버튼 클릭 이벤트 처리 //
  const onCheckButtonClickHandler = () => {
    const requestBody: PasswordReCheckRequestDto = {
      inputPassword
    }
    passwordReCheckRequest(requestBody, accessToken).then(postPasswordReCheckResponse);
  };

  // event handler: 확인 버튼 키보드 입력 이벤트 처리 //
  const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    if (key !== 'Enter') return;
    if (buttonRef.current) buttonRef.current.focus();
  };

  // effect: 컴포넌트 로드 시 실행할 함수 //
  // 비밀번호 입력창에 바로 포커싱되도록 설정
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // render: 로그인 사용자 비밀번호 일치여부 컴포넌트 렌더링 //
  return (
    <div className='password-recheck-container'>
      <div className='input-contents'>
        <div className='input-area'>
          <input ref={inputRef} type='password' value={inputPassword} placeholder='비밀번호를 입력해주세요.' onChange={onPasswordChangeHandler} onKeyDown={onKeyDownHandler} />
          <button ref={buttonRef} className={buttonCalss} onClick={onCheckButtonClickHandler}>확인</button>
        </div>
        <div className='error-message'>{inputPasswordMessage}</div>
      </div>
    </div>
  )
}

// component: 로그인 사용자 비밀번호 확인 모달 컴포넌트 //
export default function MyPagePasswordCheck() {

  // state: 확인 모달 오픈 상태 //
  const [isModalOpen, setModalOpen] = useState<boolean>(true);

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // event handler: 모달창 닫기 버튼 클릭 이벤트 //
  const onCloseButtonClickHandler = () => {
    setModalOpen(!isModalOpen);
    navigator(MAIN_ABSOLUTE_PATH);
  };

  // render: 로그인 사용자 비밀번호 확인 모달 컴포넌트 렌더링 //
  return (
    <div id='mypage-password-modal-wrapper'>
      {isModalOpen &&
      <Modal title='비밀번호 입력' onClose={onCloseButtonClickHandler}>
        <PasswordReCheck onModalViewChange={onCloseButtonClickHandler} />
      </Modal>
      }
    </div>
  )
}
