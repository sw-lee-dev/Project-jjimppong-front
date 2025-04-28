import React, { useEffect, useState, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import { fileUploadRequest, getBoardRequest, patchBoardRequest, deleteBoardRequest } from 'src/apis';
import { GetBoardResponseDto } from 'src/apis/dto/response/board';
import { PatchBoardRequestDto } from 'src/apis/dto/request/board';
import { ACCESS_TOKEN, BOARD_ABSOLUTE_PATH, BOARD_VIEW_ABSOLUTE_PATH } from 'src/constants';

import './style.css';

import RegionSelectModal from 'src/components/RegionSelectModal';
import ImageIcon from 'src/assets/images/image.png';
import PaperclipIcon from 'src/assets/images/Paperclip.png';
import TypeIcon from 'src/assets/images/Type.png';
import VideoIcon from 'src/assets/images/Video.png';
import { ResponseDto } from 'src/apis/dto/response';

const categories = ['카테고리 1', '카테고리 2', '카테고리 3', '카테고리 4', '카테고리 5'];

export default function BoardUpdate() {
  const { boardNumber } = useParams();
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const accessToken = cookies[ACCESS_TOKEN];

  const [form, setForm] = useState<PatchBoardRequestDto>({
    boardNumber: Number(boardNumber),
    boardTitle: '',
    boardContent: '',
    boardAddressCategory: '',
    boardDetailCategory: '',
    boardAddress: '',
    boardWriteDate: '',
    boardViewCount: 0,
    boardScore: 0,
    boardImage: '',
  });

  const [areaModalOpen, setAreaModalOpen] = useState(false);
  const [categorySelected, setCategorySelected] = useState('');

  const getBoardResponseHandler = (response: GetBoardResponseDto | ResponseDto | null) => {
    if (!response || response.code !== 'SU') {
      alert('존재하지 않는 게시글입니다.');
      navigate(BOARD_ABSOLUTE_PATH);
      return;
    }

    const {
      boardTitle, boardContent, boardAddressCategory, boardDetailCategory,
      boardAddress, boardImage, boardWriteDate, boardScore, boardViewCount
    } = response as GetBoardResponseDto;

    setForm({
      boardNumber: Number(boardNumber),
      boardTitle,
      boardContent,
      boardAddressCategory,
      boardDetailCategory,
      boardAddress,
      boardWriteDate,
      boardViewCount,
      boardScore,
      boardImage: boardImage ?? '',
    });

    setCategorySelected(boardDetailCategory);
  };

  useEffect(() => {
    if (!accessToken || !boardNumber) return;
    getBoardRequest(Number(boardNumber), accessToken).then(getBoardResponseHandler);
  }, [boardNumber, accessToken]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryClick = (category: string) => {
    setCategorySelected(category);
    setForm((prev) => ({ ...prev, boardDetailCategory: category }));
  };

  const handleUpdate = async () => {
    if (!form.boardTitle || !form.boardContent || !categorySelected) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
  
    let uploadedImageUrl = form.boardImage;
  
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
  
      const imageResponse = await fileUploadRequest(formData);
      if (imageResponse) uploadedImageUrl = imageResponse;
    }
  
    const requestBody: PatchBoardRequestDto = {
      ...form,
      boardImage: uploadedImageUrl,
    };
  
    patchBoardRequest(requestBody, accessToken)
      .then((res) => {
        if (res && res.code === 'SU') {
          alert('게시글이 수정되었습니다.');
          navigate(BOARD_VIEW_ABSOLUTE_PATH(boardNumber!));
        } else {
          alert('수정에 실패했습니다.');
        }
      });
  };

  const handleCancel = () => {
    if (window.confirm('작성을 취소하시겠습니까?')) {
      navigate(BOARD_VIEW_ABSOLUTE_PATH(boardNumber!));
    }
  };

  const handleRegionSelect = (region1: string, region2: string) => {
    setForm((prev) => ({
      ...prev,
      boardAddressCategory: region1,
      boardAddress: region2
    }));
  };

  const handleDelete = () => {
    if (!window.confirm('정말로 게시글을 삭제하시겠습니까?')) return;
    if (!accessToken || !boardNumber) return;
  
    deleteBoardRequest(Number(boardNumber), accessToken).then((res) => {
      if (res && res.code === 'SU') {
        alert('게시글이 삭제되었습니다.');
        navigate(BOARD_ABSOLUTE_PATH);
      } else {
        alert('삭제에 실패했습니다.');
      }
    });
  };

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div className="board-update-container">
      <button className="select-area-button" onClick={() => setAreaModalOpen(true)}>
        지역을 선택해주세요
      </button>
      {form.boardAddressCategory && form.boardAddress && (
        <div className="selected-area">{form.boardAddressCategory} {form.boardAddress}</div>
      )}
  
      <div className="category-box">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${categorySelected === category ? 'selected' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
  
      <div className="input-label">제목을 입력해주세요.</div>
      <input name="boardTitle" value={form.boardTitle} onChange={handleChange} />
  
      <div className="editor-tools">
        <img src={ImageIcon} alt="이미지 추가" className="editor-icon" />
        <input type="file" accept="image/*" onChange={handleImageChange} hidden id="image-upload" />
          <label htmlFor="image-upload" className="image-upload-label">
            이미지 업로드
          </label>

          {previewUrl && (
            <div className="image-preview-wrapper">
              <img src={previewUrl} alt="미리보기" className="image-preview" />
            </div>
          )}
        <img src={PaperclipIcon} alt="파일 첨부" className="editor-icon" />
        <img src={TypeIcon} alt="텍스트 서식" className="editor-icon" />
        <img src={VideoIcon} alt="동영상 추가" className="editor-icon" />
      </div>
  
      <div className="input-label">내용을 입력해주세요.</div>
      <textarea name="boardContent" value={form.boardContent} onChange={handleChange} />
  
      <div className="button-group">
        <button className="cancel-button" onClick={handleCancel}>취소</button>
        <button className="delete-button" onClick={handleDelete}>삭제하기</button>
        <button className="submit-button" onClick={handleUpdate}>수정 완료</button>
      </div>
  
      {areaModalOpen && (
        <RegionSelectModal
          onClose={() => setAreaModalOpen(false)}
          onSelect={handleRegionSelect}
        />
      )}
    </div>
  );
  }