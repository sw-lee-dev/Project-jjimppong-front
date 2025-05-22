import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { getRecommandBoardRequest, putBoardScore, putViewCount } from 'src/apis';
import { ResponseDto } from 'src/apis/dto/response';
import GetRecommandBoardResponseDto from 'src/apis/dto/response/board/get-recommand-board.response.dto';
import Pagination from 'src/components/Pagination';
import { BOARD_VIEW_ABSOLUTE_PATH } from 'src/constants';
import usePagination2 from 'src/hooks/pagination2.hook';
import type { RecommandBoard } from 'src/types/interfaces'
import GoodIconColor from 'src/assets/images/good-icon-color.png';
import './style.css'


interface CardItemProps {
  boards : RecommandBoard;
}

// component : 추천 게시물 레코드 컴포넌트 //

function CardItem({boards} : CardItemProps){

  const {boardNumber, boardTitle, boardImage, boardScore, userNickname, goodCount} = boards;

  // function : 네비게이터 함수 //
  const navigator = useNavigate();

  const onclick = () => {
    navigator(BOARD_VIEW_ABSOLUTE_PATH(boardNumber));
    putViewCount(boardNumber);
    putBoardScore(boardNumber);
  }

  // useEffect(()=>{
  //   console.log('좋아요 수 :', goodCount);
  // },[])



  return (
    <div className='card-body' onClick={onclick}>
      <div className='card-first-wrap'>
        <img className='card-image' src={boardImage !== "" ? boardImage : ""} alt="" />
      </div>
      <div className='card-second-wrap'>
        <div className='card-title'>{boardTitle}</div>
        <div className='card-good'>
          <img className='good-image' src={GoodIconColor} />
          <div className='good-length'>{goodCount}</div>
        </div>
      </div>
      <div className='card-third-wrap'>
        <div className='card-board-tier'>{boardScore}</div>
        <div className='card-writer-nickname'>{userNickname}</div>
      </div>
    </div>
  )
}


// 추천 게시물 //
export default function RecommandBoardMain() {

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [originalList, setOriginalList] = useState<RecommandBoard[]>([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const categoryList = ['맛집', '축제', '팝업 스토어', '교통']; // 예시 카테고리

    // state: 페이지네이션 상태 //
    const { 
      currentPage, setCurrentPage, currentSection, setCurrentSection,
      totalSection, setTotalList, viewList, pageList
    } = usePagination2<RecommandBoard>();

    // function: get recommand board response 처리 함수 //
    const getRecommandBoardResponse = (responseBody: GetRecommandBoardResponseDto | ResponseDto | null) => {
    const message = 
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '인증에 실패했습니다.' : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }

    const { boards = [] } = responseBody as GetRecommandBoardResponseDto;
    // 전체 게시글 저장
    setOriginalList(boards);
    // 초기 필터 없음 상태로 설정 
    setTotalList(boards);
    console.log(boards);        
    };


    // API 결과 처리
    useEffect(() => {
      getRecommandBoardRequest().then(getRecommandBoardResponse);
    }, []);
  
  
    // 필터링
    useEffect(() => {
      const filtered = selectedCategory
        ? originalList.filter(item => item.boardDetailCategory === selectedCategory)
        : originalList;
      
      console.log(selectedCategory);

      setTotalList(filtered);
      setIsEmpty(filtered.length === 0);
      //setOriginalList(filtered);
    }, [selectedCategory, originalList]);


  return (
    <div id='board-list-wrapper'>
      <div className='board-list-title'>추천 게시물</div>
      <div className='board-list-container'>
          <div className="category-tabs">
            <button
              className={`tab ${selectedCategory === null ? 'active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              전체
            </button>
            {categoryList.map((category) => (
              <button
                key={category}
                className={`tab ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
            
          </div>
        <div className='recommand-board-list'>
          {
            !isEmpty ? (
              viewList.map((boards, index) => <CardItem key={index} boards={boards} />)
              
            ) : <p>해당 카테고리에 게시글이 없습니다.</p>
          }
        </div>
        <div className='pagination-container'>
          {totalSection !== 0 &&
          <Pagination 
            currentPage={currentPage}
            currentSection={currentSection}
            totalSection={totalSection}
            pageList={pageList}
            setCurrentPage={setCurrentPage}
            setCurrentSection={setCurrentSection}
          />
          }
        </div>
      </div>
    </div>
  )
}
