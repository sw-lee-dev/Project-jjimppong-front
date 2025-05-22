import React, { ChangeEvent, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router';
import { ACCESS_TOKEN, BOARD_ABSOLUTE_PATH, MAP_ABSOLUTE_PATH } from 'src/constants';
import { deleteCommentRequest, getBoardRequest, getCommentRequest, postCommentRequest, getGoodRequest, getHateRequest, putGoodRequest, putHateRequest, deleteBoardRequest } from 'src/apis';
import { GetBoardResponseDto, GetCommentResponseDto, GetGoodResponseDto, GetHateResponseDto } from 'src/apis/dto/response/board';
import { ResponseDto } from 'src/apis/dto/response';
import { Comment } from 'src/types/interfaces';
import { useSignInUserStore } from 'src/stores';
import { PostCommentRequestDto } from 'src/apis/dto/request/board';
import regionData from 'src/map/regionCodes.json';
import LevelOneIcon from 'src/assets/images/star-LV1-icon.png';
import LevelTwoIcon from 'src/assets/images/star-LV2-icon.png';
import LevelThreeIcon from 'src/assets/images/star-LV3-icon.png';
import LevelFourIcon from 'src/assets/images/star-LV4-icon.png';
import LevelFiveIcon from 'src/assets/images/star-LV5-icon.png';

import './style.css';

interface CommentItemProps {
  comments : Comment;
  onCommentDeleted : () => void;
}

// component : 댓글 컴포넌트 //

function CommentItem({comments, onCommentDeleted}:CommentItemProps){

  const { boardNumber } = useParams();
  const {commentNumber, commentContent, commentWriterId, userLevel, userNickname, commentWriteDate} = comments;
  const [cookies] = useCookies();
  const accessToken = cookies[ACCESS_TOKEN];
  const { userId } = useSignInUserStore();
  
  // variable: 사용자 등급 이미지 스타일 //
  const userLevelStyle = { backgroundImage: `url(${
    userLevel === 5 ? LevelFiveIcon : 
    userLevel === 4 ? LevelFourIcon : 
    userLevel === 3 ? LevelThreeIcon : 
    userLevel === 2 ? LevelTwoIcon : LevelOneIcon })` };

  const onDeleteCommentClickHandler = (commentNumber : number) => {
    if(!accessToken) return;
    deleteCommentRequest(commentNumber, accessToken, Number(boardNumber)).then(deleteCommentResponse)
  }

  // function: delete comment response 처리 함수 //
  const deleteCommentResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? 'X' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '인증에 실패했습니다.' : 
      responseBody.code === 'NC' ? '존재하지 않는 댓글입니다.' : 
      responseBody.code === 'NP' ? '권한이 없습니다.' : '' ;
        
    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }
    alert('삭제에 성공했습니다.');
    // 댓글 삭제 시 바로 갱신
    onCommentDeleted();
  };


  return (
    <div className='comment-body'>
      <div className='comment-writer-level' style={userLevelStyle}></div>
      <div className='comment-info-wrapper'>
        <div className='comment-info'>
          <div className='comment-info-detail'>
            <div className='comment-writer-nickname'>{userNickname}</div>
            <div className='comment-write-date'>{commentWriteDate}</div>
          </div>
          {
            userId === commentWriterId && <div className='comment-delete-btn' onClick={()=>{onDeleteCommentClickHandler(commentNumber)}}>⨉</div>
          }
        </div>
        <div className='comment-content'>{commentContent}</div>
      </div>
    </div>
  )
}

export default function BoardDetail() {
  
  // state: 경로 변수 상태 //
  const { boardNumber } = useParams();

  // state: cookie 상태 //
  const [cookies] = useCookies();
  // state: 로그인 유저 아이디 상태 //
  const { userId } = useSignInUserStore();

  // 필요한 state 추가
  const [boardTitle, setBoardTitle] = useState('');
  const [boardContent, setBoardContent] = useState('');
  const [boardAddressCategory, setBoardAddressCategory] = useState('');
  const [boardDetailCategory, setBoardDetailCategory] = useState('');
  const [boardAddress, setBoardAddress] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [userLevel, setUserLevel] = useState(1);
  const [boardWriteDate, setBoardWriteDate] = useState('');
  const [boardViewCount, setBoardViewCount] = useState(0);
  const [boardImage, setBoardImage] = useState<string | null>(null);
  
  // state: 댓글 상태 //
  const [commentContent, setCommentContent] = useState<string>('');
  // state: 댓글 리스트 상태 //
  const [comments, setComments] = useState<Comment[]>([]);

  // state: Good 사용자 리스트 상태 //
  const [goods, setGoods] = useState<string[]>([]);

  // state: Hate 사용자 리스트 상태 //
  const [hates, setHates] = useState<string[]>([]);
  
  // variable: accessToken //
  const accessToken = cookies[ACCESS_TOKEN];
  
  // variable: 찜 여부 //
  const isGoods = goods.includes(userId);
  // variable: 찜 클래스 //
  const goodClass = isGoods ? 'icon good' : 'icon good-empty';

  // variable: 싫어요 여부 //
  const isHates = hates.includes(userId);
  // variable: 싫어요 클래스 //
  const hateClass = isHates ? 'icon hate' : 'icon hate-empty';

  // variable: 사용자 등급 이미지 스타일 //
  const userLevelStyle = { backgroundImage: `url(${
    userLevel === 5 ? LevelFiveIcon : 
    userLevel === 4 ? LevelFourIcon : 
    userLevel === 3 ? LevelThreeIcon : 
    userLevel === 2 ? LevelTwoIcon : LevelOneIcon })` };
  
  // function: 네비게이터 함수 //
  const navigate = useNavigate();

  const areaCodeMap: Record<number, string> = {
    0: "전체",
    1: "서울특별시",
    2: "인천광역시",
    3: "대전광역시",
    4: "대구광역시",
    5: "광주광역시",
    6: "부산광역시",
    7: "울산광역시",
    8: "세종특별자치시",
    31: "경기도",
    32: "강원도",
    33: "충청북도",
    34: "충청남도",
    35: "경상북도",
    36: "경상남도",
    37: "전라북도",
    38: "전라남도",
    39: "제주특별자치도",
};

  
  // state: 작성자 ID 저장용
  const [writerId, setWriterId] = useState('');

  // 게시글 작성자인지 여부
  const isWriter = writerId === userId;

  // ---------------- getBoardResponse 함수 내부 ----------------

  // function: get board response 처리 함수 //
  const getBoardResponse = (responseBody: GetBoardResponseDto | ResponseDto | null) => {
    const message = 
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '인증에 실패했습니다.' :
      responseBody.code === 'NB' ? '게시글이 존재하지 않습니다.' : '';
  
    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      navigate(BOARD_ABSOLUTE_PATH);
      return;
    }
  
    const {
      userId: boardWriterId,
      boardTitle, boardContent, boardAddressCategory, boardDetailCategory, boardAddress,
      userNickname, userLevel, boardWriteDate, boardViewCount, boardImage, textFileUrl
    } = responseBody as GetBoardResponseDto;
  
    // set 상태로 작성자 ID 저장
    setWriterId(boardWriterId);
    setBoardTitle(boardTitle);
    setBoardContent(boardContent);
    setBoardAddressCategory(boardAddressCategory);
    setBoardDetailCategory(boardDetailCategory);
    setBoardAddress(boardAddress);
    setUserNickname(userNickname);
    setUserLevel(userLevel);
    setBoardWriteDate(boardWriteDate);
    setBoardViewCount(boardViewCount);
    setBoardImage(boardImage);
  };


    // function: get comment response 처리 함수 //
    const getCommentResponse = (responseBody: GetCommentResponseDto | ResponseDto | null) => {
      const message =
        !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '인증에 실패했습니다.' : '';
      
      const isSuccess = responseBody !== null && responseBody.code === 'SU';
      if (!isSuccess) {
        alert(message);
        return;
      }
  
      const { comments } = responseBody as GetCommentResponseDto;
      setComments(comments);
    };
  
    // function: post comment response 처리 함수 //
    const postCommentResponse = (responseBody: ResponseDto | null) => {
      const message =
        !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '인증에 실패했습니다.' : '';
      
      const isSuccess = responseBody !== null && responseBody.code === 'SU';
      if (!isSuccess) {
        alert(message);
        return;
      }

      setCommentContent('');
      if (!boardNumber) return;
      getCommentRequest(Number(boardNumber)).then(getCommentResponse);
    };


    // event handler: 댓글 변경 이벤트 처리 //
    const onCommentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = event.target;
      setCommentContent(value);
    };

  // function: get good response 처리 함수 //
  const getGoodResponse = (responseBody: GetGoodResponseDto | ResponseDto | null) => {
    const message = 
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : 
      responseBody.code === 'NB' ? '존재하지 않는 게시글입니다.' : 
      responseBody.code === 'AF' ? '인증에 실패했습니다.' : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }

    const { goods } = responseBody as GetGoodResponseDto;
    setGoods(goods);
  };

  // function: put good response 처리 함수 //
  const putGoodResponse = (responseBody: ResponseDto | null) => {
    const message = 
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'NB' ? '존재하지 않는 게시글입니다.' : 
      responseBody.code === 'AF' ? '인증에 실패했습니다.' : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }

    if (!boardNumber || !accessToken) return;
    getGoodRequest(boardNumber).then(getGoodResponse);
  };

  // function: get hate response 처리 함수 //
  const getHateResponse = (responseBody: GetHateResponseDto | ResponseDto | null) => {
    const message = 
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'NB' ? '존재하지 않는 게시글입니다.' : 
      responseBody.code === 'AF' ? '인증에 실패했습니다.' : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }

    const { hates } = responseBody as GetHateResponseDto;
    setHates(hates);
  };

  // function: put hate response 처리 함수 //
  const putHateResponse = (responseBody: ResponseDto | null) => {
      const message = 
        !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
        responseBody.code === 'NB' ? '존재하지 않는 게시글입니다.' :
        responseBody.code === 'AF' ? '인증에 실패했습니다.' : '';

      const isSuccess = responseBody !== null && responseBody.code === 'SU';
      if (!isSuccess) {
        alert(message);
        return;
      }

      if (!boardNumber || !accessToken) return;
      getHateRequest(boardNumber).then(getHateResponse);
  };

  // event handler: 댓글 작성 클릭 이벤트 처리 //
  const onPostCommentClickHandler = () => {
    if(!accessToken) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    if(!accessToken || !boardNumber || !commentContent.trim()) return;

    const requestBody: PostCommentRequestDto = {
      commentContent
    };
    postCommentRequest(requestBody, boardNumber, accessToken).then(postCommentResponse);
    //console.log('전송할 댓글 내용:', commentContent);
  };


  // event : 댓글 삭제 시 prop 값으로 넘겨 이벤트 처리 //
  const refreshComments = () => {
    if (!boardNumber) return;
    getCommentRequest(Number(boardNumber)).then(getCommentResponse);
  };

  // event handler: 찜 버튼 클릭 이벤트 처리 //
  const onGoodClickHandler = () => {
    if (!boardNumber || !accessToken) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    putGoodRequest(boardNumber, accessToken).then(putGoodResponse);
  };

  // event handler: 싫어요 버튼 클릭 이벤트 처리 //
  const onHateClickHandler = () => {
    if (!boardNumber || !accessToken) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    putHateRequest(boardNumber, accessToken).then(putHateResponse);
  };


  const getRegionKeyByName = (areaCode:number, region : string) => {
    const selectedRegion = regionData.find(r => r.regionName === region && r.areaCode === areaCode);
    if (!selectedRegion) return null;
    return {
      areaCode: selectedRegion.areaCode,
      sigunguCode: selectedRegion.sigunguCode,
      ADM_SECT_C : selectedRegion.ADM_SECT_C
    };
  }

    const handleSearch = async () => {
      // 문자열 값으로부터 코드 번호 (key)를 역으로 찾기
      // Object.entries() : 객체의 key-value 쌍을 배열 형태로 반환하는 메서드. 값으로부터 key를 찾을 때 유용하게 사용
      // Object.entries(obj)
      // obj: key-value로 구성된 객체
      // 반환값: [[key1, value1], [key2, value2], ...] 형태의 배열
      const [region1, region2] = boardAddressCategory.split(" ");
      const areaCode = Number(Object.entries(areaCodeMap).find(([key, value]) => value === region1)?.[0]);
      const address = getRegionKeyByName(areaCode, region2)?.ADM_SECT_C ?? '';
      navigate(`${MAP_ABSOLUTE_PATH}?addressCategory=${address}`);
    };

  // event handler: 목록으로 버튼 클릭 이벤트 처리 //
  const onGoListClickHandler = () => {
    navigate(BOARD_ABSOLUTE_PATH);
  };

  // effect: 컴포넌트 로드 시 실행할 함수 //
  useEffect(() => {
    if (!boardNumber) {
      navigate(BOARD_ABSOLUTE_PATH);
      return;
    }
    getBoardRequest(Number(boardNumber)).then(getBoardResponse);
    getCommentRequest(Number(boardNumber)).then(getCommentResponse);
    getGoodRequest(boardNumber).then(getGoodResponse);
    getHateRequest(boardNumber).then(getHateResponse);
  }, []);

  // 게시글 수정
  const onEditClickHandler = () => {
    navigate(`/board/${boardNumber}/update`);
  };

  // 게시글 삭제
  const onDeleteClickHandler = async () => {
    if (!boardNumber || !accessToken) return;
  
    const confirmDelete = window.confirm('정말로 이 게시글을 삭제하시겠습니까?');
    if (!confirmDelete) return;
  
    const response = await deleteBoardRequest(boardNumber, accessToken);
    if (!response || response.code !== 'SU') {
      alert('게시글 삭제에 실패했습니다.');
      return;
    }
  
    alert('게시글이 삭제되었습니다.');
    navigate(BOARD_ABSOLUTE_PATH);
  };

  return (
    <div id="board-detail-wrapper">
      <div className="detail-container">
        <div className="location-path">
          <span>{boardAddressCategory} &gt; {boardAddress} &gt; {boardDetailCategory}</span>
        </div>

        <div className="post-meta">
          <div className="left">
            <h1 className="post-title">{boardTitle}</h1>
            <span className="post-date">{boardWriteDate}</span>
          </div>
          <div className="right">
            <div className="badge" style={userLevelStyle}></div>
            <span className="nickname">{userNickname}</span>
            <button className="location-btn" onClick={handleSearch}>위치</button>
          </div>
        </div>

        {boardImage && (
          <div className="board-image">
            <img src={boardImage} alt="게시글 이미지" />
          </div>
        )}

        <div className="post-content">
          {boardContent}
        </div>

        <div className='reaction-container'>
          <div className='reaction-header'>
            <div className='reaction-box'>
              <div className='icon view-count'/> 
              {boardViewCount}
            </div>
            <div className='reaction-box'>
              <div className={goodClass} onClick={onGoodClickHandler}/>
              {goods.length}
            </div>
            <div className='reaction-box'>
              <div className={hateClass} onClick={onHateClickHandler}/>
              {hates.length}
            </div>
          </div>
        </div>

        <div className='button-container'>
          <div className='go-list' onClick={onGoListClickHandler}>목록으로</div>
          {isWriter && (
          <div className="button-group">
            <button className="edit-button" onClick={onEditClickHandler}>수정</button>
            <button className="delete-button" onClick={onDeleteClickHandler}>삭제하기</button>
          </div>
          )}
        </div>

        <div className="comment-input-section">
          <div className='comment-input'>
            <label>댓글 작성란</label>
            <textarea value={commentContent} placeholder="댓글을 입력하세요" onChange={onCommentChangeHandler} />
            <button className="comment-btn" onClick={onPostCommentClickHandler}>댓글 작성</button>
          </div>

          <div className="comment-list">
            {comments.map((commentItem, index) => 
                <CommentItem key={index} comments={commentItem} onCommentDeleted={refreshComments}/>
            )}
          </div>
        </div>

        

      </div>
    </div>
  );
}