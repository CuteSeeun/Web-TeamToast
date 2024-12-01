import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaChevronDown } from 'react-icons/fa';
import { AiOutlinePlus } from "react-icons/ai";
import ChannelList from './ChannelList';

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

// const ChannelList = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
// `;

// const ChannelItem = styled.div<{ active?: boolean }>`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 10px 15px;
//   background-color: ${({ active }) => (active ? "#e7f3f3" : "transparent")};
//   border-radius: 8px;
//   cursor: pointer;
//   font-size: 14px;
//   font-weight: ${({ active }) => (active ? "bold" : "normal")};
//   color: ${({ active }) => (active ? "#038c8c" : "#333")};
//   box-shadow: ${({ active }) =>
//         active ? "0 0 5px rgba(0, 0, 0, 0.1)" : "none"};

//   &:hover {
//     background-color: #e9ecef;
//   }
// `;


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



const TapMenu: React.FC = () => {
    const [isChannelListOpen, setChannelListOpen] = useState(true); // 채널 리스트 상태 관리
    const toggleChannelList = () => {
        setChannelListOpen((prev) => !prev); // 상태 토글
    };

    // 친구 섹션의 상태
    const [isFriendListOpen, setFriendListOpen] = useState(true);
    const toggleFriendList = () => {
        setFriendListOpen((prev) => !prev);
    };

    
    return (
        <Sidebar>
            <SidebarTitle>채팅</SidebarTitle>
            <ChannerSection>
                <ChannerSectionHeader isOpen={isChannelListOpen} onClick={toggleChannelList}>채널<FaChevronDown /></ChannerSectionHeader>

                {/* <ChannelListWrapper isOpen={isChannelListOpen}>
                    <ChannelList>
                        <ChannelItem active>채팅방 이름 1</ChannelItem>
                        <ChannelItem>채팅방 이름 2</ChannelItem>
                        <ChannelItem>채팅방 이름 3</ChannelItem>
                    </ChannelList>
                </ChannelListWrapper> */}
                <ChannelList isOpen={isChannelListOpen} />

                <AddButton><AiOutlinePlus /> 채널 생성하기</AddButton>
            </ChannerSection>

            <FriendSection>
                <FriendSectionHeader isOpen={isFriendListOpen} onClick={toggleFriendList}>친구<FaChevronDown /></FriendSectionHeader>
                {/* {isFriendListOpen && (  */}
                <FriendListWrapper isOpen={isFriendListOpen}>
                    <FriendList>
                        <FriendItem><ProfileImage>1</ProfileImage> <UserName>김정연</UserName></FriendItem>
                        <FriendItem><ProfileImage>2</ProfileImage> <UserName>한채경</UserName></FriendItem>
                        <FriendItem><ProfileImage>3</ProfileImage> <UserName>김현진</UserName></FriendItem>
                    </FriendList>
                </FriendListWrapper>
                {/* )} */}
                <AddButton><AiOutlinePlus /> 멤버 추가하기</AddButton>
            </FriendSection>
        </Sidebar>
    );
};
export default TapMenu;
