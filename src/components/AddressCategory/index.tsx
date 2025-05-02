import React from 'react'
import { useState, useEffect } from 'react';
import regionData from 'src/assets/data/regionCodes.json'
import { Region } from 'src/types/interfaces';
import './style.css';

type Props = {
    onSelect: (areaCode: number | null, sigunguCode: number | null) => void;
};

export default function AddressCategory({ onSelect }: Props) {
    const regions: Region[] = regionData;
    const [selectedAreaCode, setSelectedAreaCode] = useState<number | null>(null);
    const [selectedSigunguCode, setSelectedSigunguCode] = useState<number | null>(null);
    const [sidoOpen, setSidoOpen] = useState(false);
    const [gunguOpen, setGunguOpen] = useState(false);

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


    //regions.forEach((region) => {
    //    console.log(region.areaCode, region.regionName);
    //});


    // 중복 제거된 areaCode 리스트
    const uniqueAreaCodes = Array.from(
        new Set(regionData.map((region) => region.areaCode))
    );

    const handleAreaChange = (code : number | null) => {
        setSelectedAreaCode(code);
        setSelectedSigunguCode(null); // 지역 바뀌면 구 초기화
        onSelect(code, null);
        setSidoOpen(false);
    };

    const handleSigunguChange = (code : number | null) => {
        setSelectedSigunguCode(code);
        onSelect(selectedAreaCode, code);
        setGunguOpen(false);
    };

    // 선택된 areaCode에 따른 구/군 필터링
    const filteredSigungu = regionData.filter(
        (region) => region.areaCode === selectedAreaCode
    );

    return (
        <div id="region-wrapper">

            <label>지역</label>
            <div className='regionSelect-wrapper'>
                <div className='regionSelect-sido'>
                    <div className='regionSelect-sido-toggle' onClick={()=>setSidoOpen(!sidoOpen)}>
                        {selectedAreaCode ? areaCodeMap[selectedAreaCode] : '전체'}
                    </div>
                    {
                        sidoOpen && (
                            <ul className='sido-dropdown-list'>
                                {uniqueAreaCodes.map((code) => (
                                    <li key={code} onClick={()=> handleAreaChange(code)}>
                                        {areaCodeMap[code]}
                                    </li>
                                ))}
                            </ul>
                        )
                    }
                </div>
                <div className='regionSelect-gungu'>
                    <div className='regionSelect-gungu-toggle' onClick={()=>setGunguOpen(!gunguOpen)}>
                        {selectedSigunguCode ? filteredSigungu.find((region)=>region.sigunguCode === selectedSigunguCode)?.regionName:'전체'}
                    </div>
                    {
                        gunguOpen && (
                            <ul className='gungu-dropdown-list'>
                                {
                                    filteredSigungu.map((region) => (
                                        <li key={region.sigunguCode} onClick={()=>handleSigunguChange(region.sigunguCode)}>
                                            {region.regionName}
                                        </li>
                                        ))
                                }
                            </ul>
                        )
                    }
                </div>
            </div>
            
        
    </div>
    )
}
