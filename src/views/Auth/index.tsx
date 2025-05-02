import React, { useEffect, useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import IdSearch from './IdSearch';
import PasswordReset from './PasswordReset';
import SnsSignUp from './SnsSignUp';
import { AuthPage } from '../../types/aliases';
import './style.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import { ACCESS_TOKEN, JOIN_TYPE, MAIN_ABSOLUTE_PATH, SNS_ID } from '../../constants';

export default function Auth() {

  // state: cookie 상태 //
  const [cookies] = useCookies();

  // state: 페이지 상태 //
  const [page, setPage] = useState<AuthPage>('sign-in');

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // event handler: 페이지 변경 이벤트 처리 //
  const onPageChangeHandler = (page: AuthPage) => {
    setPage(page); // 페이지 변경
  };

  // effect: 화면 렌더시 실행할 함수 //
  if (
    !cookies[ACCESS_TOKEN] && // 로그인 안 된 경우만
    page === 'sign-in' &&
    cookies[JOIN_TYPE] &&
    cookies[SNS_ID]
  ) {
    setPage('sns-sign-up');
  }

  return (
    <div id='auth-wrapper'>
      <div className='auth-box'>
        {page === 'sign-in' && <SignIn onPageChange={onPageChangeHandler} />}
        {page === 'sign-up' && <SignUp onPageChange={onPageChangeHandler} />}
        {page === 'sns-sign-up' && <SnsSignUp onPageChange={onPageChangeHandler} />}
        {page === 'id-search' && <IdSearch onPageChange={onPageChangeHandler} />}
        {page === 'password-reset' && <PasswordReset onPageChange={onPageChangeHandler} />}
      </div>
    </div>
  );
}
