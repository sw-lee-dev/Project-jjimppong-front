import React from 'react';
import './style.css';

export default function BoardDetail() {
  return (
    <div id='board-detail-wrapper'>
      <div className='detail-container'>
        <div className='location-path'>
          <span>부산광역시 &gt; 부산진구 &gt; 카테고리</span>
        </div>

        <div className='post-meta'>
          <div className='left'>
            <h1 className='post-title'>게시물 제목</h1>
          </div>
          <div className='right'>
            <span className='badge'>회원 등급</span>
            <span className='nickname'>작성자 닉네임</span>
            <button className='location-btn'>위치</button>
          </div>
        </div>
        
        <div className='post-content'>
          게시물 내용
        </div>

        <div className='reaction-bar'>
          조회수 &nbsp; 좋아요 수 &nbsp; 댓글 수 &nbsp; 싫어요 수
        </div>

        <div className='comment-input-section'>
          <label>작성란</label>
          <textarea placeholder='댓글을 입력하세요' disabled />
          <div className='login-warning'>로그인이 필요한 서비스입니다.</div>
          <button className='comment-btn'>댓글 작성</button>
        </div>

        <div className='comment-list'>
          {[1, 2, 3].map((_, i) => (
            <div key={i} className='comment-box'>
              <span className='badge'>회원 등급</span>
              <div className='comment-content'>
                <span className='nickname'>작성자 닉네임</span>
                <p>작성 내용</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

