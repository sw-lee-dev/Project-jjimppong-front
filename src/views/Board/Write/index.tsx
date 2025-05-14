import React, { useState } from 'react';
import { fileUploadRequest, postBoardRequest } from 'src/apis';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN } from 'src/constants';
import ImageIcon from 'src/assets/images/image.png';
import PaperclipIcon from 'src/assets/images/Paperclip.png';
import RegionSelectModal from 'src/components/RegionSelectModal';

import './style.css';

const categories = ['맛집', '축제', '팝업 스토어', '교통', '시설'];

const BoardWrite = () => {
  const [cookies] = useCookies();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    boardTitle: '',
    boardContent: '',
    boardAddressCategory: '',
    boardDetailCategory: '',
    boardAddress: '',
    boardImage: '',
    textFileUrl: '', // ✨ 텍스트 파일 URL
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [areaSelected, setAreaSelected] = useState('');
  const [districtSelected, setDistrictSelected] = useState('');
  const [categorySelected, setCategorySelected] = useState('');

  const [previewImage, setPreviewImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const handleCategoryClick = (category: string) => {
    setCategorySelected(category);
    setForm((prev) => ({ ...prev, boardDetailCategory: category }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegionSelect = (region1: string, region2: string) => {
    setAreaSelected(region1);
    setDistrictSelected(region2);
    setForm((prev) => ({
      ...prev,
      boardAddressCategory: `${region1} ${region2}`
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAttachedFile(file);
  };

  const uploadFile = async (file: File | null): Promise<string> => {
    if (!file) return '';
    const formData = new FormData();
    formData.append('file', file);
    const uploadedUrl = await fileUploadRequest(formData);
    return uploadedUrl || '';
  };

  const handleSubmit = async () => {
    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      navigate('/auth');
      return;
    }

    if (!areaSelected || !districtSelected) {
      alert('지역을 선택해주세요.');
      return;
    }

    if (!categorySelected) {
      alert('카테고리를 선택해주세요.');
      return;
    }

    if (!form.boardContent.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      const imageUrl = await uploadFile(imageFile);
      const textFileUrl = await uploadFile(attachedFile);

      const requestBody = {
        ...form,
        boardImage: imageUrl,
        textFileUrl: textFileUrl, // ✔️ 서버로 전송
      };

      await postBoardRequest(requestBody, accessToken);
      alert('게시글이 작성되었습니다!');
      navigate('/board');
    } catch (error) {
      alert('게시글 작성 실패');
    }
  };

  const handleCancel = () => {
    if (window.confirm('작성을 취소하시겠습니까?')) {
      navigate('/board');
    }
  };

  return (
    <div className="board-write-container">
      <button className="select-area-button" onClick={() => setIsModalOpen(true)}>
        지역을 선택해주세요
      </button>

      {areaSelected && districtSelected && (
        <div className="selected-area">{areaSelected} {districtSelected}</div>
      )}

      <div className="category-box">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${categorySelected === category ? 'selected' : 'unselected'}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="input-label">제목을 입력해주세요.</div>
      <input name="boardTitle" value={form.boardTitle} onChange={handleChange} placeholder="제목을 입력하세요" />

      <div className="editor-tools">
        <label htmlFor="image-upload">
          <img src={ImageIcon} alt="이미지" className="editor-icon" />
        </label>
        <input id="image-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />

        <label htmlFor="text-upload">
          <img src={PaperclipIcon} alt="텍스트 파일" className="editor-icon" />
        </label>
        <input id="text-upload" type="file" accept=".txt,.pdf" style={{ display: 'none' }} onChange={handleFileChange} />
      </div>

      {previewImage && (
        <div className="image-preview">
          <img src={previewImage} alt="미리보기" className="preview-thumbnail" />
        </div>
      )}

      {attachedFile && (
        <div className="attached-file">첨부된 파일: {attachedFile.name}</div>
      )}

      <div className="input-label">내용을 입력해주세요.</div>
      <textarea name="boardContent" value={form.boardContent} onChange={handleChange} placeholder="내용을 입력하세요" />

      <div className="button-group">
        <button className="cancel-button" onClick={handleCancel}>취소</button>
        <button className="submit-button" onClick={handleSubmit}>작성 완료</button>
      </div>

      {isModalOpen && (
        <RegionSelectModal onClose={() => setIsModalOpen(false)} onSelect={handleRegionSelect} />
      )}
    </div>
  );
};

export default BoardWrite;