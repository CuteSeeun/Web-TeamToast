import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaChevronDown, FaChevronLeft } from 'react-icons/fa';
import { AiOutlinePlus } from "react-icons/ai";
import ChannelList from './ChannelList';
import AddChannelModal from './AddChannelModal'; // AddChannelModal import

const Sidebar = styled.aside`
width: 220px;
  min-width: 180px;
  background-color: #ffffff;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 10px;

`;

const SidebarTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

const ChannerSection = styled.div`
margin-top: 20px;
padding: 0 20px;
`;

const FriendSection = styled.div`
margin-top: 40px;
margin-bottom: 20px;
padding: 0 20px;
`;

const ChannerSectionHeader = styled.div<{ isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  cursor: pointer;

  svg {
    font-size: 14px;
    transition: transform 0.3s ease; /* 애니메이션 추가 */
    transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')}; /* 회전 */
  }
`;

const FriendSectionHeader = styled.div<{ isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  cursor: pointer;

  svg {
    font-size: 14px;
    transition: transform 0.3s ease; /* 애니메이션 추가 */
    transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')}; /* 회전 */
  }
`;

// const ChannelListWrapper = styled.div<{ isOpen: boolean }>`
//   height: ${({ isOpen }) => (isOpen ? 'auto' : '0px')};
//   overflow: hidden;
//   transition: height 0.3s ease; /* 부드러운 애니메이션 */
// `;

const FriendListWrapper = styled.div<{ isOpen: boolean }>`
  height: ${({ isOpen }) => (isOpen ? 'auto' : '0px')};
  overflow: hidden;
  transition: height 0.3s ease; /* 부드러운 애니메이션 */
`;

const AddButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  color: #333;
  margin-top: 10px;
  text-align: center;

  svg {
    font-size: 16px;
  }

  &:hover {
    color: #038c8c;

    svg {
      color: #038c8c;
    }
  }
`;

const FriendList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FriendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  color: #333;
  border-radius: 8px;
  &:hover {
    background-color: #e7f3f3;
    color: #038c8c;
    box-shadow:0 0 5px rgba(0, 0, 0, 0.1);
    font-weight: bold;
  }
`;

const ProfileImage = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: white;
`;

const UserName = styled.span`
flex: 1;
  margin-left: 6px; /* ProfileImage와 사용자 이름 간 간격 */
  margin-right: 50px;
`;

// 왼쪽 화살표 스타일
const StyledChevronLeft = styled.div`
  font-size: 14px; /* 크기 줄이기 */
  color: #aaa; /* 회색으로 변경 */
  cursor: pointer;
  margin-left: 145px;
  

  position: relative; /* 툴팁 위치 기준 */
  display: inline-block; /* inline-block으로 감싸기 */

  &:hover {
    color: #555; /* 호버 시 색상 변경 */
  }
    &:hover > span {
    opacity: 1; /* 툴팁 보이기 */
    visibility: visible; /* 툴팁 활성화 */
  }
`;

// Tooltip: 툴팁 스타일
const Tooltip = styled.span`
  position: absolute;
  bottom: -35px; /* 아래로 띄우기 */
  left: 50%; /* 가로 가운데 정렬 */
  transform: translateX(-50%);
  padding: 5px 10px;
  background: black;
  color: white;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  opacity: 0;
  visibility: hidden; /* 초기에는 숨김 */
  transition: opacity 0.3s ease;
  z-index: 10;

 
`;

const TapMenuContainer = styled.div`
  position: relative; /* Tooltip과 같은 위치 조정 시 필요 */
`;

const TapMenu: React.FC = () => {

  const [isHovered, setIsHovered] = useState(false); // 마우스 hover 상태 관리

  const [isChannelListOpen, setChannelListOpen] = useState(true); // 채널 리스트 상태 관리
  const toggleChannelList = () => {
    setChannelListOpen((prev) => !prev); // 상태 토글
  };

  const [isFriendListOpen, setFriendListOpen] = useState(true);// 친구 리스트 상태 관리
  const toggleFriendList = () => {
    setFriendListOpen((prev) => !prev);
  };

  // const [isChannelModalOpen, setChannelModalOpen] = useState(false); // 채널 생성 모달 상태 관리
  // const openChannelModal = (isOpen: boolean) => {
  //   setChannelModalOpen(isOpen); 
  // };
  // const closeChannelModal = () => {
  //   setChannelModalOpen(false); // 모달 닫기
  // };
  // const handleApplyChannel = (selectedMembers: any[]) => {
  //   console.log('선택된 멤버:', selectedMembers);
  //   setChannelModalOpen(false); // 모달 닫기
  //   // 선택된 멤버 데이터를 활용한 로직 추가
  // };
  const [isChannelModalOpen, setChannelModalOpen] = useState(false); // 채널 생성 모달 상태 관리
  const [modalType, setModalType] = useState<'channel' | 'friend' | null>(null); // 모달 종류 관리
  const openChannelModal = (type: 'channel' | 'friend') => {
    setChannelModalOpen(true);
    setModalType(type); // 모달 타입 설정
  };
  const closeChannelModal = () => {
    setChannelModalOpen(false);
    setModalType(null); // 모달 타입 초기화
  };
  const handleApplyChannel = (selectedMembers: any[]) => {
    console.log('선택된 멤버:', selectedMembers);
    setChannelModalOpen(false); // 모달 닫기
    setModalType(null); // 모달 타입 초기화
    // 선택된 멤버 데이터를 활용한 로직 추가
  };


  return (
    <TapMenuContainer
      onMouseEnter={() => setIsHovered(true)} // 마우스가 들어왔을 때
      onMouseLeave={() => setIsHovered(false)} // 마우스가 나갔을 때
    >
      <Sidebar>

        <SidebarTitle><span>채팅</span>{isHovered &&(<StyledChevronLeft><FaChevronLeft /><Tooltip>사이드바 닫기</Tooltip></StyledChevronLeft>)}</SidebarTitle>
        <ChannerSection>
          <ChannerSectionHeader isOpen={isChannelListOpen} onClick={toggleChannelList}>채널<FaChevronDown /></ChannerSectionHeader>
          <ChannelList isOpen={isChannelListOpen} />
          <AddButton onClick={() => openChannelModal('channel')}><AiOutlinePlus /> 채널 생성하기</AddButton>
        </ChannerSection>

        <FriendSection>
          <FriendSectionHeader isOpen={isFriendListOpen} onClick={toggleFriendList}>친구<FaChevronDown /></FriendSectionHeader>
          <FriendListWrapper isOpen={isFriendListOpen}>
            <FriendList>
              <FriendItem><ProfileImage>1</ProfileImage> <UserName>김정연</UserName></FriendItem>
              <FriendItem><ProfileImage>2</ProfileImage> <UserName>한채경</UserName></FriendItem>
              <FriendItem><ProfileImage>3</ProfileImage> <UserName>김현진</UserName></FriendItem>
            </FriendList>
          </FriendListWrapper>
          <AddButton onClick={() => openChannelModal('friend')}><AiOutlinePlus /> 멤버 추가하기</AddButton>
        </FriendSection>

        {isChannelModalOpen && (
          <AddChannelModal onClose={closeChannelModal} onApply={handleApplyChannel} type={modalType} />
        )}
      </Sidebar>
    </TapMenuContainer>
  );
};
export default TapMenu;
