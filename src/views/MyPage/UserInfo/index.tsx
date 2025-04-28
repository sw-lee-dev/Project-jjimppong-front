import React from 'react';
import { useSignInUserStore } from 'src/stores';
import DefaultProfile from 'src/assets/images/default-profile.png';

import './style.css';

// interface: 로그인 사용자 정보 컴포넌트 속성 //
interface UserInfoProps {
  onModalViewChange: () => void;
}

// component: 로그인 사용자 정보 컴포넌트 //
export default function MyPageUserInfo({onModalViewChange}: UserInfoProps) {

  // state: 로그인 유저 정보 상태 //
  const { userId, userNickname, name, gender, address, detailAddress, profileImage } = useSignInUserStore();

  // variable: 프로필 이미지 스타일 //
  const profileImageStyle = { backgroundImage: `url(${profileImage ? profileImage : DefaultProfile})` };

  // event handler: 나가기 버튼 클릭 이벤트 처리 //
  const onExitClickHandler = () => {
    onModalViewChange();
  };

  // render: 로그인 사용자 정보 컴포넌트 렌더링 //
  return (
    <div id='user-info-container'>
      <div className='image-box'>
        <div className='profile-image' style={profileImageStyle}/>
      </div>
      <div className='user-info-box'>
        <div className='user-info-row'>
          <div className='title'>아이디</div>
          <div className='content'>{userId}</div>
        </div>
        <div className='user-info-row'>
          <div className='title'>닉네임</div>
          <div className='content'>{userNickname}</div>
        </div>
        <div className='user-info-row'>
          <div className='title'>이름</div>
          <div className='content'>{name}</div>
        </div>
        <div className='user-info-row'>
          <div className='title'>성별</div>
          <div className='content'>{gender}</div>
        </div>
        <div className='user-info-row'>
          <div className='title'>주소</div>
          <div className='content'>{address}</div>
        </div>
        <div className='user-info-row'>
          <div className='title'>상세주소</div>
          <div className='content'>{detailAddress}</div>
        </div>
      </div>
      <div className='exit-button-box'>
        <div className='exit-button' onClick={onExitClickHandler}>나가기</div>
      </div>
    </div>
  )
}
