import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { teamMembersState } from '../../recoil/atoms/memberAtoms';

//모달 배경 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
// 모달 컨테이너 스타일
const ModalContainer = styled.div`
  width: 400px;
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;
// 모달 헤더 스타일
const ModalHeader = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
`;
const Label = styled.label`
  display: block;
  margin-top: 20px;
  font-size: 14px;
  font-weight: bold;
  color: #555;
`;
const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;

  &:focus {
    border-color: #038c8c;
  }
`;
const SearchInput = styled(Input)`
  margin-top: 10px;
`;
const MemberList = styled.div`
  margin-top: 15px;
  max-height: 150px;
  overflow-y: auto;
`;
const MemberItem = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 0;
`;
const Checkbox = styled.input`
  margin-right: 10px;
`;
const MemberName = styled.span`
  font-size: 14px;
  color: #333;
`;
const MemberAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
`;
const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
`;
const Button = styled.button<{ primary?: boolean }>`
  padding: 10px 15px;
  font-size: 14px;
  font-weight: bold;
  color: ${({ primary }) => (primary ? 'white' : '#555')};
  background: ${({ primary }) => (primary ? '#038c8c' : '#fff')};
  border: ${({ primary }) => (primary ? 'none' : '1px solid #ddd')};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: ${({ primary }) => (primary ? '#026b6b' : '#f0f0f0')};
  }
`;

// 데이터 타입 정의
interface Member {
  id: number;
  name: string;
}
interface ModalProps {
  onClose: () => void;
  onApply: (selectedMembers: Member[]) => void;
  type: 'channel' | 'friend' | null; // 모달 타입 추가
}

// 모달 컴포넌트
const AddChannelModal: React.FC<ModalProps> = ({ onClose, onApply, type }) => {

  const teamMembers = useRecoilValue(teamMembersState);
  const [channelName, setChannelName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedMembers, setSelectedMembers] = useState<Set<number>>(new Set());

  // 스크롤 방지 처리
  useEffect(() => {
    document.body.style.overflow = 'hidden'; // 모달 열릴 때 스크롤 방지
    return () => {
      document.body.style.overflow = 'auto'; // 모달 닫힐 때 스크롤 복구
    };
  }, []);

  const handleMemberToggle = (id: number) => {
    setSelectedMembers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleApply = () => {
    const selected = teamMembers.filter((member) => selectedMembers.has(member.id));
    onApply(selected);
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>채널 만들기</ModalHeader>

        {type === 'channel' && (
          <>
            <Label>채널명</Label>
            <Input placeholder="채널명" value={channelName} onChange={(e) => setChannelName(e.target.value)} />
          </>
        )}

        <Label>대화상대 선택</Label>
        <SearchInput placeholder="사용자 검색"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />

        <MemberList>
          {teamMembers
            .filter((member) => member.name.includes(searchTerm))
            .map((member) => (
              <MemberItem key={member.id}>
                <Checkbox
                  type="checkbox"
                  checked={selectedMembers.has(member.id)}
                  onChange={() => handleMemberToggle(member.id)}
                />
                <MemberAvatar src={member.name} alt={member.name} />
                <MemberName>{member.name}</MemberName>
              </MemberItem>
            ))}
        </MemberList>

        <ModalFooter>
          <Button onClick={onClose}>취소</Button>
          <Button primary onClick={handleApply}>
            확인
          </Button>
        </ModalFooter>

      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddChannelModal;
