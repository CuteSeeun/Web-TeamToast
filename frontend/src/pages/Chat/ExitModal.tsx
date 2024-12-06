import React from 'react';
import styled from 'styled-components';

// 모달 배경 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// 모달 컨테이너 스타일
const ModalContainer = styled.div`
  width: 400px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

// 모달 헤더 스타일
const ModalHeader = styled.div`
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #eee;

`;

// 모달 내용 스타일
const ModalContent = styled.div`
  padding: 20px;
  font-size: 14px;
  color: #555;
  line-height: 1.5;
`;

// 버튼 컨테이너 스타일
const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 15px;
  gap: 10px;
  /* border-top: 1px solid #eee; */
`;

// 취소 버튼 스타일
const CancelButton = styled.button`
  background: #f5f5f5;
  color: #333;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: #e4e4e4;
  }
`;

// 퇴장 버튼 스타일
const LeaveButton = styled.button`
  background: #f95757;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: #e04747;
  }
`;

interface ModalProps {
  onClose: () => void;
  onLeave: () => void;
}

const ExitModal: React.FC<ModalProps> = ({ onClose, onLeave }) => {
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>채팅명</ModalHeader>
        <ModalContent>
          채널의 대화 내역 및 새로운 메시지를
          확인할 수 없습니다. 정말 나가시겠습니까?
        </ModalContent>
        <ModalFooter>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <LeaveButton onClick={onLeave}>확인</LeaveButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ExitModal;
