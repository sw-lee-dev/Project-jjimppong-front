import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { ACCESS_TOKEN, BOARD_VIEW_ABSOLUTE_PATH, BOARD_WRITE_PATH } from 'src/constants';
import { usePagination } from 'src/hooks';
import { FilteredBoard } from 'src/types/interfaces';
import { Region } from 'src/types/interfaces';
import './style.css';
import GetFilteredBoardResponseDto from 'src/apis/dto/response/board/get-filtered-board.response';
import { ResponseDto } from 'src/apis/dto/response';
import { getGoodCountFilterdBoardRequest, getViewCountFilterdBoardRequest, getWriteDateFilterdBoardRequest, putBoardScore, putViewCount } from 'src/apis';
import Pagination from 'src/components/Pagination';
import { useSearchParams } from 'react-router-dom';
import regionData from 'src/assets/data/regionCodes.json'
import AddressCategory from 'src/components/AddressCategory';
import { useCookies } from 'react-cookie';



interface BoardItemProps {
  boards : FilteredBoard;
}

function BoardItem({boards}:BoardItemProps){
  
  const { 
          boardNumber, 
          boardWriteDate, 
          boardAddressCategory, 
          boardDetailCategory, 
          boardTitle, 
          boardViewCount,
          boardScore,
          boardImage,
          userNickname,
          userLevel,
          goodCount,
          commentCount
        } = boards;

  const navigator = useNavigate();

  const onclick = () => {
      navigator(BOARD_VIEW_ABSOLUTE_PATH(boardNumber));
      putViewCount(boardNumber);
      putBoardScore(boardNumber);
  }
  return (
    <div>
      <div className='board-body' onClick={onclick}>
      <div className='board-image-container'>
        <div className='board-image'></div>
      </div>
      <div className='board-information-container'>
        <div className='board-title'>{boardTitle}</div>
        <div className='board-writer-nickname'>{userNickname}</div>
        <div className='board-write-date'>{boardWriteDate}</div>
        <div className='board-data-container'>
          <div className='board-count-data-container'>
            <div className='board-view-count-logo'/>
            <div className='board-view-count'>{boardViewCount}</div>
            <div className='board-good-count-logo'/>
            <div className='board-good-count'>{goodCount}</div>
            <div className='board-comment-count-logo'/>
            <div className='board-comment-count'>{commentCount}</div>
          </div>
          <div className='board-category-data-container'>
            <div className='board-address-category'>#{boardAddressCategory}</div>
            <div className='board-detail-category'>#{boardDetailCategory}</div>
            <div className='board-writer-level'>레벨 : {userLevel}</div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}


export default function BoardMain() {
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<string | null>('');
  const [originalList, setOriginalList] = useState<FilteredBoard[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [a1, setA1] = useState<number | null>(0);
  const [a2, setA2] = useState<number | null>(0);
  const [isEmpty, setIsEmpty] = useState(false);
  const [searchParams] = useSearchParams();
  const navigator = useNavigate();

  const [cookies] = useCookies();
  
  const menuList = ['최신 순', '조회수 순', '좋아요 순'];
  const categoryList = ['맛집', '축제', '팝업 스토어', '교통'];

  const addressCategory1 = searchParams.get('addressCategory1');
  const addressCategory2 = searchParams.get('addressCategory2');
  const detailCategory = searchParams.get('detailCategory');
  

  // state: 페이지네이션 상태 //
  const { 
    currentPage, setCurrentPage, currentSection, setCurrentSection,
    totalSection, setTotalList, viewList, pageList
  } = usePagination<FilteredBoard>();

  // function: get recommand board response 처리 함수 //
  const getFilteredBoardResponse = (responseBody: GetFilteredBoardResponseDto | ResponseDto | null) => {
  const message = 
    !responseBody ? '서버에 문제가 있습니다.' :
    responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
    responseBody.code === 'AF' ? '인증에 실패했습니다.' : '';
  
  const isSuccess = responseBody !== null && responseBody.code === 'SU';
  if (!isSuccess) {
    alert(message);
    return;
  }
  
  const { boards = [] } = responseBody as GetFilteredBoardResponseDto;
  // 전체 게시글 저장
  setOriginalList(boards);
  // 초기 필터 없음 상태로 설정 
  setTotalList(boards);
  console.log(boards);        
  };

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

  const handleChangeMenu = (menu : string | null) => {
    setSelectedMenu(menu);
    setSortMenuOpen(false);
  }


  // 작성하기 버튼, 로그인이 안되어있으면 로그인을 해달라는 창 꺼내기 //
  const hadleGoWritePage = () => {
    if(!cookies[ACCESS_TOKEN]) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    navigator(BOARD_WRITE_PATH);
  }

  // API 결과 처리. 기본적으로는 최신순으로 나열 //
  useEffect(() => {
    getWriteDateFilterdBoardRequest().then(getFilteredBoardResponse);
    setSelectedCategory(detailCategory);
    setA1(Number(addressCategory1));
    setA2(Number(addressCategory2));
    //console.log(addressCategory1);
    //console.log(addressCategory2);
    //console.log(detailCategory);

  }, []);

  useEffect(()=>{
    if(selectedMenu === '최신 순') {
      getWriteDateFilterdBoardRequest().then(getFilteredBoardResponse);
    } else if(selectedMenu === '조회수 순') {
      getViewCountFilterdBoardRequest().then(getFilteredBoardResponse);
    } else if (selectedMenu === '좋아요 순') {
      getGoodCountFilterdBoardRequest().then(getFilteredBoardResponse);
    } else {
      getWriteDateFilterdBoardRequest().then(getFilteredBoardResponse);
    }
  },[selectedMenu])

  useEffect(() => {
    const filtered = originalList.filter(item => {
      //분야 카테고리가 선택됐다면 비교. 아니면 통과 //
      const categoryMatch = selectedCategory ? item.boardDetailCategory === selectedCategory : true;

      let addressMatch = true;

      // 시-도 지역 카테고리가 선택 됐다면 비교. 아니면 통과//
      const areaName = a1 ? areaCodeMap[a1] : '';
      const sigunguName = regionData.find(region =>
        region.areaCode === a1 &&
        region.sigunguCode === a2
      )?.regionName;

      if (a1 && !a2) {
        // 시(도)만 선택된 경우 -> 부분 포함
        addressMatch = item.boardAddressCategory.includes(areaName);
      } else if (a1 && a2 && sigunguName) {
        // 시(도) + 구(군) 선택된 경우 -> 전체 주소 문자열 일치
        const fullAddress = `${areaName} ${sigunguName}`;
        addressMatch = item.boardAddressCategory === fullAddress;
      }

      return categoryMatch && addressMatch;
      });
        
    //console.log(selectedCategory);
  
    setTotalList(filtered);
    setIsEmpty(filtered.length === 0);
  }, [selectedCategory, originalList, a1, a2]);
  

  return (
    <div id='filterd-board-list-wrapper'>
      <div className='address-category-container'>
        <AddressCategory onSelect={(a1, a2) => {
          //console.log('Selected address:', a1, a2);
          setA1(a1);
          setA2(a2);
        }}/>
      </div>
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
      <div className='filterd-board-title'>
        게시물
      </div>
      
      <div className='filterd-board-list-container'>
        <div className='board-write-btn' onClick={hadleGoWritePage}>
          작성하기
        </div>
        <div className='sort-container'>
          <div className='sort-toggle' onClick={()=>setSortMenuOpen(!sortMenuOpen)}>
            {selectedMenu !== '' ? selectedMenu : '최신 순'}
          </div>
          {
              sortMenuOpen && (
                <ul className='sort-dropdown-list'>
                  {
                    menuList.map((menu)=>(
                      <li key={menu} onClick={()=>{handleChangeMenu(menu)}}>
                        {menu}
                      </li>
                    ))
                  }
                </ul>
              )
          }

        </div>
        
        <div className='filtered-board-list'>
          {
            !isEmpty ? (
              viewList.map((boards, index) => <BoardItem key={index} boards={boards} />)
              
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
