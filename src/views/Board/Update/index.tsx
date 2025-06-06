import React, { useEffect, useState, ChangeEvent, useCallback } from 'react';
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
import { ResponseDto } from 'src/apis/dto/response';
import XSquareIcon from 'src/assets/images/Xsquare.png';

const categories = ['맛집', '축제', '팝업스토어', '교통', '시설'];

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
    textFileUrl: '',
  });

  const [areaModalOpen, setAreaModalOpen] = useState(false);
  const [categorySelected, setCategorySelected] = useState('');
  const [attachedFileName, setAttachedFileName] = useState<string>('');

  const getBoardResponseHandler = useCallback((response: GetBoardResponseDto | ResponseDto | null) => {
    if (!response || response.code !== 'SU') {
      alert('존재하지 않는 게시글입니다.');
      navigate(BOARD_ABSOLUTE_PATH);
      return;
    }
  
    const {
      boardTitle, boardContent, boardAddressCategory, boardDetailCategory,
      boardAddress, boardImage, boardWriteDate, boardScore, boardViewCount, textFileUrl,
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
      textFileUrl: textFileUrl ?? '',
    });
  
    // 이미지 및 파일 상태 설정
    if (boardImage) {
      setPreviewUrl(boardImage);
    }
    if (textFileUrl) {
      const fileName = textFileUrl.split('/').pop() || textFileUrl;
      setAttachedFile({ name: fileName } as File);
      setAttachedFileName(fileName);
    }

    setCategorySelected(boardDetailCategory);
  },
  [navigate, boardNumber]

); // 의존성 배열에 navigate와 boardNumber 넣어주기

  useEffect(() => {
    if (!boardNumber) return;
    getBoardRequest(Number(boardNumber))
      .then(getBoardResponseHandler);
  }, [boardNumber, getBoardResponseHandler]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryClick = (category: string) => {
    setCategorySelected(category);
    setForm((prev) => ({ ...prev, boardDetailCategory: category }));
  };

  const uploadFile = async (file: File | null): Promise<string> => {
    if (!file) return '';
    const formData = new FormData();
    formData.append('file', file);
    const uploadedUrl = await fileUploadRequest(formData);
    return uploadedUrl || '';
  };

  const handleUpdate = async () => {
    if (!form.boardTitle || !form.boardContent || !categorySelected) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
  
    let uploadedImageUrl = form.boardImage;
    let uploadedFileUrl = form.textFileUrl;
  
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
  
      const imageUrl = await fileUploadRequest(formData);
      if (imageUrl) uploadedImageUrl = imageUrl;
    }

    if (attachedFile) {
      uploadedFileUrl = await uploadFile(attachedFile); // ✨ 파일 업로드 및 URL 획득
    }

    const requestBody: PatchBoardRequestDto = {
      ...form,
      boardImage: uploadedImageUrl,
      textFileUrl: uploadedFileUrl,
    };
  
    patchBoardRequest(Number(boardNumber), requestBody, accessToken)
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
      boardAddressCategory: `${region1} ${region2}`
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
  const [attachedFile, setAttachedFile] = useState<File | null>(null); // ✨ 파일 상태 추가

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      setAttachedFileName(file.name); // 파일 이름 설정
    }
  };

  const removeImage = () => { // Function to remove image
    setImageFile(null);
    setPreviewUrl('');
    setForm(prev => ({ ...prev, boardImage: '' })); // Clear image URL in form
  };

  const removeFile = () => {  // Function to remove file
    setAttachedFile(null);
    setAttachedFileName('');
    setForm((prev) => ({ ...prev, textFileUrl: '' }));
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
        <label htmlFor="image-upload" className="editor-icon-label">
          <img src={ImageIcon} alt="이미지 추가" className="editor-icon" />
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          hidden
          id="image-upload"
        />
        {imageFile || previewUrl ? (
          <div className="file-control-container">
            <button className="remove-button image-remove-button" onClick={removeImage}>
              <img src={XSquareIcon} alt="Remove" className="remove-icon" />
            </button>
          </div>
        ) : null}
        {/* <label htmlFor="text-upload" className="editor-icon-label" style={{ marginLeft: '10px' }}>
          <img src={PaperclipIcon} alt="파일 첨부" className="editor-icon" />
        </label>
        <input
          type="file"
          accept=".txt,.pdf"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          id="text-upload"
        /> */}
        {attachedFile && (
          <div className="file-control-container attached-file-name">
            <span style={{ marginRight: '5px' }}>{attachedFile?.name}</span>
            <button className="remove-button file-remove-button" onClick={removeFile}>
              <img src={XSquareIcon} alt="Remove" className="remove-icon" />
            </button>
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="image-preview-wrapper">
          <img src={previewUrl} alt="미리보기" className="image-preview" />
        </div>
      )}
  
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