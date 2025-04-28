import React, { useState } from 'react'

import TitleLogo from 'src/assets/images/white_rough_logo.png';

import './style.css'
import AddressCategory from 'src/components/AddressCategory';
import DetailCatebory from 'src/components/DetailCategory';
import { useNavigate } from 'react-router';
import { BOARD_ABSOLUTE_PATH } from 'src/constants';

export default function MainTitle() {

  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedRegion2, setSelectedRegion2] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<string>('');

  const navigator = useNavigate();

  const handleSelectRegion = (areaCode: number | null, sigunguCode: number | null) => {
    setSelectedRegion(areaCode);
    setSelectedRegion2(sigunguCode);
  }

  const handleSearch = async () => {
    const address1 = selectedRegion ?? '';
    const address2 = selectedRegion2 ?? '';
    const detail = encodeURIComponent(selectedDetail);
    navigator(`${BOARD_ABSOLUTE_PATH}?addressCategory1=${address1}&addressCategory2=${address2}&detailCategory=${detail}`);
  };
  
  return (
    <div id='wrapper-main'>
      <div className='main-left'></div>
      <div id='wrapper-title'>
        <div className='title-box'>
            <img className='title-logo' src={TitleLogo}/>
        </div>
        <div className='category-wrapper'>
          <div className='category-select'>
          <div className='category-address'>
            <AddressCategory onSelect={handleSelectRegion}/>
          </div>
          <div className='category-detail'>
            <DetailCatebory onSelect={setSelectedDetail}/>
          </div>
          </div>
          <div className='category-search-button' onClick={handleSearch}>검색하기</div>
        </div>
      </div>
      <div className='main-right'></div>
    </div>
    
  )
}
