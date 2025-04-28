import React, { useState } from 'react'
import { Detail, detailOptions } from 'src/types/aliases';
import './style.css';


type Props = {
    onSelect: (detail: string) => void;
};

export default function DetailCatebory({ onSelect }: Props) {
    const [selectedDetail, setSelectedDetail] = useState<Detail>('전체');
    const [detailOpen, setDetailOpen] = useState(false);

    const handleChange = (option : string) => {
        setSelectedDetail(option as Detail);
        onSelect(option);
        setDetailOpen(false);
    };
    return (
    <div id='detail-wrapper'>
        <label>분야</label>
        <div className='detailSelect-wrapper'>
            <div className='detailSelect-toggle' onClick={()=>setDetailOpen(!detailOpen)}>
                {selectedDetail ? selectedDetail : '전체'}
            </div>
                {
                    detailOpen && (
                        <ul className='detail-dropdown-list'>
                            {detailOptions.map((option) => (
                                <li key={option} onClick={()=>{handleChange(option)}}>
                                    {option}
                                </li>
                            ))}
                        </ul>
                    )
                }
        </div>
    </div>
    )
}
