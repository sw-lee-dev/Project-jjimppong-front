import React, { useState } from 'react';
import './style.css';
import Modal from '../Modal';
import { REGION_DATA } from 'src/constants/region';

interface Props {
  onClose: () => void;
  onSelect: (region1: string, region2: string) => void;
}

export default function RegionSelectModal({ onClose, onSelect }: Props) {
  const [selectedRegion1, setSelectedRegion1] = useState('');
  const [selectedRegion2, setSelectedRegion2] = useState('');

  const handleRegion1Click = (region: string) => {
    setSelectedRegion1(region);
    setSelectedRegion2('');
  };

  const handleRegion2Click = (region: string) => {
    setSelectedRegion2(region);
  };

  const handleConfirm = () => {
    if (!selectedRegion1 || !selectedRegion2) return;
    onSelect(selectedRegion1, selectedRegion2);
    onClose();
  };

  return (
    <Modal title="지역 선택" onClose={onClose}>
      <div className="region-modal-body">
        <div className="region-section">
          <div className="region-label">선택 1</div>
          <div className="region-list">
            {Object.keys(REGION_DATA).map((region1) => (
              <button
                key={region1}
                className={`region-button ${region1 === selectedRegion1 ? 'selected' : ''}`}
                onClick={() => handleRegion1Click(region1)}
              >
                {region1}
              </button>
            ))}
          </div>
        </div>

        {selectedRegion1 && (
          <div className="region-section">
            <div className="region-label">선택 2</div>
            <div className="region-list">
              {REGION_DATA[selectedRegion1].map((region2) => (
                <button
                  key={region2}
                  className={`region-button ${region2 === selectedRegion2 ? 'selected' : ''}`}
                  onClick={() => handleRegion2Click(region2)}
                >
                  {region2}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="modal-footer">
          <button
            className={`confirm-button ${selectedRegion1 && selectedRegion2 ? 'active' : ''}`}
            onClick={handleConfirm}
            disabled={!selectedRegion1 || !selectedRegion2}
          >
            선택 완료
          </button>
        </div>
      </div>
    </Modal>
  );
}
