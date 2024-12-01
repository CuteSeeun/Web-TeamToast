//칸반 보드

import React from 'react';
import styled from 'styled-components';
import { FaChevronDown } from 'react-icons/fa'; // 다운 화살표 아이콘 추가
import { AiOutlinePlus } from "react-icons/ai";
import { ImAttachment, ImSmile, ImCompass } from "react-icons/im";


// 채팅 메시지 타입 정의
interface ChatMessage {
  id: number;
  sender: string;
  text: string;
  time: string;
}

// 더미 데이터
const messages: ChatMessage[] = [
  { id: 1, sender: '김정연', text: '여러분 저 다음주에 못 와요ㅠ', time: '16:56' },
  { id: 2, sender: '김현진', text: '그건 좀 아니라고 생각합니다', time: '16:56' },
  { id: 3, sender: '김현진', text: '팀플이 장난입니까?', time: '16:57' },
  { id: 4, sender: '조하영', text: '쿨쿨', time: '16:58' },
];

const BoardContainer = styled.div`
  position: relative; /* 스프린트 완료 버튼 위치를 위한 설정 */
  display: flex;
  flex-direction: row;
  /* border-right: 1px solid #ddd; */
  padding-left: 15px; /* 사이드 메뉴와 간격 조정 */
  padding-right: 15px;
  overflow: hidden; /* BoardContainer에서 스크롤 막기 */
  width:1400px;
`;

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

const SectionHeader = styled.div`
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
  }
`;

const ChannelList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChannelItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: ${({ active }) => (active ? "#e7f3f3" : "transparent")};
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  color: ${({ active }) => (active ? "#038c8c" : "#333")};
  box-shadow: ${({ active }) =>
    active ? "0 0 5px rgba(0, 0, 0, 0.1)" : "none"};

  &:hover {
    background-color: #e9ecef;
  }
`;

const ChannelBadge = styled.span`
  display: inline-block;
  background-color: #e63946;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 50%;
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

const FriendListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px; /* 아래 간격 추가 */
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
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  color: #333;
  

  &:hover {
    background-color: #e9ecef;
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

const NotificationBadge = styled.span`
  display: inline-block;
  background-color: #e63946;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 50%;
`;

//------------------------채팅 메시지 화면

// 컨테이너 스타일
const ChatContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  /* border: 1px solid #ddd; */
`;

// 헤더 스타일
const ChatHeader = styled.div`
  padding: 10px 20px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  font-size: 18px;
  font-weight: bold;
`;

// 메시지 목록 스타일
const MessageList = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// 메시지 스타일
const MessageItem = styled.div<{ isMine: boolean }>`
  display: flex;
  flex-direction: ${({ isMine }) => (isMine ? 'row-reverse' : 'row')};
  align-items: flex-start;
  gap: 10px;
`;

const MessageBubble = styled.div<{ isMine: boolean }>`
  max-width: 60%;
  padding: 10px 15px;
  border-radius: 10px;
  background-color: ${({ isMine }) => (isMine ? '#d1e7dd' : '#fff')};
  border: 1px solid ${({ isMine }) => (isMine ? '#badbcc' : '#ddd')};
  color: #333;
  font-size: 14px;
  white-space: pre-wrap;
`;

const MessageTime = styled.span`
  font-size: 12px;
  color: #aaa;
  margin-top: 5px;
`;

// 입력창 스타일
const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  /* border-top: 1px solid #ddd; */
  position: relative; /* 아이콘 배치를 위해 추가 */
`;

const InputField = styled.input`
  flex: 1;
  /* padding: 10px; */
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  padding: 15px 15px 15px 15px; /*왼쪽 공간 확보*/
  padding-right: 120px; /* 오른쪽 아이콘 공간 확보 */
`;

const InputIcon = styled.div`
  position: absolute;
  right: 25px; /* InputField 내부 아이콘 위치 */
  display: flex; /* 아이콘을 가로로 나열 */
  gap: 8px; /* 아이콘 간 간격, 이건 display: flex를 줘야 먹힘 */
  font-size: 18px;
  color: #aaa;
  cursor: pointer;

  &:hover {
    color: #007bff;
  }
`;

const CompassIcon = styled(ImCompass)`
  background-color: #038c8c; /* 배경 색상 */
  color: white; /* 아이콘 색상 */
  border-radius: 20%; /* 동그랗게 만들기 */
  padding: 8px; /* 내부 여백 */
  font-size: 18px; /* 아이콘 크기 */
  box-sizing: content-box; /* padding 포함 */
  cursor: pointer;

  &:hover {
    background-color: #026b6b; /* hover 효과 */
  }
`;



const CBoard: React.FC = () => {
  return (
    <BoardContainer>

      {/* 채팅 사이드 메뉴 */}
      <Sidebar>
        <SidebarTitle>채팅</SidebarTitle>
        {/* 채팅 채널 */}
        <ChannerSection>
          <SectionHeader>채널<FaChevronDown /></SectionHeader>
          <ChannelList>
            <ChannelItem active>채팅방 이름 1</ChannelItem>
            <ChannelItem>채팅방 이름 2 <ChannelBadge>4</ChannelBadge> </ChannelItem>
            <ChannelItem>채팅방 이름 3 <ChannelBadge>4</ChannelBadge> </ChannelItem>
            {/* <AddButton><AiOutlinePlus /> 채널 생성하기</AddButton> */}
          </ChannelList>
          <AddButton><AiOutlinePlus /> 채널 생성하기</AddButton>
        </ChannerSection>

        {/* 친구 */}
        <FriendSection>
          <SectionHeader>친구<FaChevronDown /></SectionHeader>
          <FriendListContainer>
            <FriendList>
              <FriendItem>
                <ProfileImage>1</ProfileImage> <UserName>김정연{" "}</UserName>
                <NotificationBadge>1</NotificationBadge>
              </FriendItem>
              <FriendItem>
                <ProfileImage>2</ProfileImage> <UserName>한채경{" "}</UserName>
                <NotificationBadge>33</NotificationBadge>
              </FriendItem>
              <FriendItem>
                <ProfileImage>3</ProfileImage> <UserName>김현진{" "}</UserName>
                {/* <NotificationBadge>2</NotificationBadge> */}
              </FriendItem>
              {/* <AddButton><AiOutlinePlus /> 멤버 추가하기</AddButton> */}
            </FriendList>
            <AddButton><AiOutlinePlus /> 멤버 추가하기</AddButton>
          </FriendListContainer>
        </FriendSection>
      </Sidebar>

      <ChatContainer>
        {/* 헤더 */}
        <ChatHeader>안드로이드 팀</ChatHeader>

        {/* 메시지 목록 */}
        <MessageList>
          {messages.map((msg) => (
            <MessageItem key={msg.id} isMine={msg.sender === '사용자'}>
              <ProfileImage>{msg.sender.slice(-1)}</ProfileImage>
              <div>
                <MessageBubble isMine={msg.sender === '사용자'}>
                  {msg.text}
                </MessageBubble>
                <MessageTime>{msg.time}</MessageTime>
              </div>
            </MessageItem>
          ))}
        </MessageList>

        {/* 입력창 */}
        <InputContainer>
          <InputField placeholder="메시지 입력" />
          <InputIcon>{/* React-icons를 사용한 아이콘 */}
            <ImAttachment />
            <ImSmile />
            <CompassIcon />
          </InputIcon>

        </InputContainer>
      </ChatContainer>


    </BoardContainer>
  );
};

export default CBoard;

