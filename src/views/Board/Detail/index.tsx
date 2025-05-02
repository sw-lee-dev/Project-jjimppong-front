import React, { ChangeEvent, useEffect, useState } from 'react';
import './style.css';

import { ACCESS_TOKEN, BOARD_ABSOLUTE_PATH, BOARD_VIEW_ABSOLUTE_PATH } from 'src/constants';
import { deleteCommentRequest, getBoardRequest, getCommentRequest, postCommentRequest, getGoodRequest, getHateRequest, putGoodRequest, putHateRequest } from 'src/apis';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router';
import { GetBoardResponseDto, GetCommentResponseDto, GetGoodResponseDto } from 'src/apis/dto/response/board';
import { ResponseDto } from 'src/apis/dto/response';
import { Comment } from 'src/types/interfaces';
import { useSignInUserStore } from 'src/stores';
import { PostCommentRequestDto } from 'src/apis/dto/request/board';
import GetHateResponseDto from 'src/apis/dto/response/board/get-hate.response.dto';

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
      <div className='comment-writer-level'>레벨 : {userLevel}</div>
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
  
  // function: 네비게이터 함수 //
  const navigate = useNavigate();
  
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
      boardTitle, boardContent, boardAddressCategory, boardDetailCategory, boardAddress,
      userNickname, userLevel, boardWriteDate, boardViewCount, boardImage
    } = responseBody as GetBoardResponseDto;

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
            <span className="badge">{userLevel}</span>
            <span className="nickname">{userNickname}</span>
            <button className="location-btn">위치</button>
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

