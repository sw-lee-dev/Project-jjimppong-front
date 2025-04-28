import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import { fileUploadRequest, patchSignInUserRequest, updateNicknameCheckRequest } from 'src/apis';
import { ResponseDto } from 'src/apis/dto/response';
import { PatchSignInUserRequestDto, PostNicknameCheckRequestDto } from 'src/apis/dto/request/mypage';
import { ACCESS_TOKEN } from 'src/constants';
import { useSignInUserStore } from 'src/stores';
import DefaultProfile from 'src/assets/images/default-profile.png';
import { useSignInUser } from 'src/hooks';

import './style.css';
import { HttpStatusCode } from 'axios';

// interface: 로그인 사용자 정보 수정 컴포넌트 속성 //
interface UserInfoUpdateProps {
  onModalViewChange: () => void;
}

// component: 로그인 사용자 정보 수정 컴포넌트 //
export default function MyPageUserInfoUpdate({onModalViewChange}: UserInfoUpdateProps) {

  // state: cookie 상태 //
  const [cookies] = useCookies();

  // state: 로그인 사용자 정보 상태 //
  const { profileImage, userId, userNickname, name, address, detailAddress } = useSignInUserStore();

  // state: 파일 인풋 참조 상태 //
  const fileRef = useRef<HTMLInputElement | null>(null);

  // state: 프로필 이미지 미리보기 상태 //
  const [previewProfile, setPreviewProfile] = useState<string | null>(null);
  
  // state: 수정 사용자 닉네임 상태 //
  const [updateNickname, setUpdateNickname] = useState<string>('');
  // state: 수정 사용자 비밀번호 상태 //
  const [updatePassword, setUpdatePassword] = useState<string>('');
  // state: 수정 사용자 비밀번호 확인 상태 //
  const [updatePasswordCheck, setUpdatePasswordCheck] = useState<string>('');
  // state: 수정 사용자 주소 상태 //
  const [updateAddress, setUpdateAddress] = useState<string>('');
  // state: 수정 사용자 상세주소 상태 //
  const [updateDetailAddress, setUpdateDetailAddress] = useState<string>('');
  // state: 수정 사용자 프로필 이미지 상태 //
  const [updateProfileImage, setUpdateProfileImage] = useState<File | null>(null);

  // state: 수정 닉네임 중복 확인 상태 //
  const [isUpdateNicknameChecked, setUpdateNicknameChecked] = useState<boolean>(false);
  // state: 수정 닉네임 메세지 상태 //
  const [updateNicknameMessage, setUpdateNicknameMessage] = useState<string>('');

  // state: 수정 비밀번호 메세지 상태 //
  const [updatePasswordMessage, setUpdatePasswordMessage] = useState<string>('');
  // state: 수정 비밀번호 확인 메세지 상태 //
  const [updatePasswordCheckMessage, setUpdatePasswordCheckMessage] = useState<string>('');
  // state: 수정 비밀번호 패턴 일치 상태 //
  const [isUpdatePasswordChecked, setUpdatePasswordChecked] = useState<boolean>(false);
  // state: 수정 비밀번호 동일 여부 상태 //
  const [isUpdatePasswordEquals, setUpdatePasswordEquals] = useState<boolean>(false);

  // variable: accessToken //
  const accessToken = cookies[ACCESS_TOKEN];

  // variable: 중복 확인 버튼 활성화 //
  const isNicknameCheckButtonActive = updateNickname !== '';
  // variable: 버튼 클래스 //
  const buttonClass = `button ${isNicknameCheckButtonActive ? '' : 'disable'}`;

  // variable: 프로필 이미지 스타일 //
  const profileImageStyle = { cursor: 'pointer', backgroundImage: `url(${previewProfile ?  previewProfile : DefaultProfile})` };

  // function: 로그인 유저 정보 불러오기 함수 //
  const getSignInUser = useSignInUser();

  // function: 다음 포스트 코드 팝업 오픈 함수 //
  const open = useDaumPostcodePopup();
  // function: 다음 포스트 코드 완료 처리 함수 //
  const daumPostCompleteHandler = (data: Address) => {
    const { address } = data;
    setUpdateAddress(address);
  };

  // function: nickname check response 처리 함수 //
  const updateNicknameCheckResponse = (responseBody: ResponseDto | null) => {
    const message = 
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : 
      responseBody.code === 'EU' ? '이미 사용중인 닉네임입니다.' : '사용 가능한 닉네임입니다.';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    setUpdateNicknameMessage(message);
    setUpdateNicknameChecked(isSuccess);
  };

  // function: patch sign in user response 처리 함수 //
  const patchSignInUserResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '인증에 실패했습니다.' : 
      responseBody.code === 'EU' ? '이미 사용중인 닉네임입니다.' : 
      HttpStatusCode.BadRequest ? '닉네임 중복 확인해주세요.' : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }

    alert('수정이 완료되었습니다.');
    getSignInUser();
    onModalViewChange();
  };

  // event handler: 프로필 사진 클릭 이벤트 처리 //
  const onProfileClickHandler = () => {
    if (!fileRef.current) return;
    fileRef.current.click();
  };
  // event handler: 파일 인풋 클릭 이벤트 처리 // 
  const onFileChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || !files.length) return;

    const file = files[0];
    setUpdateProfileImage(file);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
      setPreviewProfile(fileReader.result as string);
    };
  };

  // event handler: 사용자 닉네임 변경 이벤트 처리 //
  const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUpdateNickname(value);

    setUpdateNicknameChecked(false);
    setUpdateNicknameMessage('');
  };

  // event handler: 사용자 비밀번호 변경 이벤트 처리 //
  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUpdatePassword(value);

    const regexp = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,13}$/;
    const isMatch = regexp.test(value);
    const message = isMatch ? '' : '영문, 숫자를 혼용하여 8 ~ 13자 입력해주세요.';
    setUpdatePasswordMessage(message);
    setUpdatePasswordChecked(isMatch);
  };
  // event handler: 사용자 비밀번호 확인 변경 이벤트 처리 //
  const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUpdatePasswordCheck(value);
  };

  // event handler: 주소 검색 버튼 클릭 이벤트 처리 //
  const onSearchAddressClickHandler = () => {
    open({ onComplete: daumPostCompleteHandler });
  };
  // event handler: 사용자 상세주소 변경 이벤트 처리 //
  const onDetailAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUpdateDetailAddress(value);
  };

  // event handler: 중복 확인 버튼 클릭 이벤트 처리 //
  const onCheckNicknameClickHandler = () => {
    if (!isNicknameCheckButtonActive) return;

    const requestBody: PostNicknameCheckRequestDto = { updateNickname };
    updateNicknameCheckRequest(requestBody, accessToken).then(updateNicknameCheckResponse);
  };

  // event handler: 수정 버튼 클릭 이벤트 처리 //
  const onUpdateClickHandler = async () => {
    const message = 
      !updateNickname ? '닉네임을 입력하세요.' :
      !updatePassword ? '비밀번호를 입력하세요.' :
      !updatePasswordCheck ? '비밀번호 확인을 입력하세요.' :
      !updateAddress ? '주소를 입력하세요.' : '';
    
    if (!isUpdateNicknameChecked) {
      setUpdateNicknameMessage('닉네임 중복 확인해주세요');
    }

    const isCheck = updateNickname && updatePassword && updatePasswordCheck && updateAddress && isUpdatePasswordChecked && isUpdatePasswordEquals;
    if (!isCheck) {
      alert(message);
      return;
    }

    let newProfileImage: string | null = null;
    if (updateProfileImage) {
      const formData = new FormData();
      formData.append('file', updateProfileImage);
      newProfileImage = await fileUploadRequest(formData);
    }

    newProfileImage = profileImage === previewProfile ? profileImage : newProfileImage;

    const requestBody: PatchSignInUserRequestDto = {
      userNickname: updateNickname,
      userPassword: updatePassword,
      address: updateAddress,
      detailAddress: updateDetailAddress,
      profileImage: newProfileImage
    };

    patchSignInUserRequest(requestBody, accessToken).then(patchSignInUserResponse);
  };
  // event handler: 취소 버튼 클릭 이벤트 처리 //
  const onExitClickHandler = () => {
    onModalViewChange();
  };

  // effect: 사용자 비밀번호 또는 사용자 비밀번호 확인이 변경될 시 실행할 함수 //
  useEffect(() => {
    const isMatch = updatePasswordCheck === updatePassword;
    const message = isMatch ? '' : '비밀번호가 일치하지 않습니다.';
    setUpdatePasswordCheckMessage(message);
    setUpdatePasswordEquals(isMatch);
  }, [updatePassword, updatePasswordCheck]);

  // effect: 컴포넌트 로드 시 실행할 함수 //
  useEffect(() => {
    setPreviewProfile(profileImage);
    setUpdateNickname(userNickname);
    setUpdateAddress(address);
    setUpdateDetailAddress(detailAddress ? detailAddress : '');
  }, []);

  // render: 로그인 사용자 정보 수정 컴포넌트 렌더링 //
  return (
    <div id='user-update-container'>
      <div className='update-image-box'>
        <div className='update-image' style={profileImageStyle} onClick={onProfileClickHandler}></div>
        <input ref={fileRef} style={{ display: 'none' }} type='file' accept='image/png, image/jpeg' onChange={onFileChangeHandler} />
      </div>
      <div className='user-update-box'>
        <div className='user-update-row'>
          <div className='title'>아이디</div>
          <div className='content'>{userId}</div>
        </div>
        <div className='user-update-row'>
          <div className='title'>닉네임</div>
          <div className='update-area'>
            <input type='text' placeholder={updateNickname} onChange={onNicknameChangeHandler}></input>
            <div className={buttonClass} onClick={onCheckNicknameClickHandler}>중복 확인</div>
          </div>
          {isUpdateNicknameChecked ?
          <div className='message success'>{updateNicknameMessage}</div> :
          <div className='message error'>{updateNicknameMessage}</div>
          }
        </div>
        <div className='user-update-row'>
          <div className='title'>비밀번호</div>
          <input type='password' value={updatePassword} onChange={onPasswordChangeHandler} />
          <div className='message error'>{updatePasswordMessage}</div>
        </div>
        <div className='user-update-row'>
          <div className='title'>비밀번호 확인</div>
          <input type='password' value={updatePasswordCheck} onChange={onPasswordCheckChangeHandler}/>
          <div className='message error'>{updatePasswordCheckMessage}</div>
        </div>
        <div className='user-update-row'>
          <div className='title'>이름</div>
          <div className='content'>{name}</div>
        </div>
        <div className='user-update-row'>
          <div className='title'>주소</div>
          <div className='update-area'>
            <input type='text' placeholder={updateAddress} onChange={() => {}} readOnly></input>
            <div className='button' onClick={onSearchAddressClickHandler}>주소 검색</div>
          </div>
        </div>
        <div className='user-update-row'>
          <div className='title'>상세주소</div>
          <input type='text' placeholder={updateDetailAddress} onChange={onDetailAddressChangeHandler}></input>
        </div>
      </div>
      <div className='update-button-box'>
        <div className='button' onClick={onUpdateClickHandler}>수정</div>
        <div className='button' onClick={onExitClickHandler}>취소</div>
      </div>
    </div>
  )
}
