import React from 'react';
import styled from 'styled-components';
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


const ChatContainerComponent: React.FC = () => (
    <ChatContainer>
    <ChatHeader>안드로이드 팀</ChatHeader>

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

    <InputContainer>
      <InputField placeholder="메시지 입력" />
      <InputIcon>
        <ImAttachment />
        <ImSmile />
        <CompassIcon />
      </InputIcon>

    </InputContainer>
  </ChatContainer>
);

export default ChatContainerComponent;
