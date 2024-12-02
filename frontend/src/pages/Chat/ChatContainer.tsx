import React from 'react';
import styled from 'styled-components';
import { ImAttachment, ImSmile, ImCompass } from "react-icons/im";
import { useRecoilValue } from 'recoil';
import { selectedChannelAtom } from '../../recoil/atoms/selectedChannelAtoms'; // selectedChannelAtom 가져오기
import { userState } from '../../recoil/atoms/userAtoms';

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


const ChatContainerComponent: React.FC = () => {
  const selectedChannel = useRecoilValue(selectedChannelAtom); // 선택된 채널 구독
  const loggedInUser = useRecoilValue(userState);//로그인한 유저 이메일은 userState에서 가져온다
  

  return (
    <ChatContainer>
      <ChatHeader>{selectedChannel?.rname || '대화를 시작해보세요!'}</ChatHeader>

      <MessageList>
        {selectedChannel?.messages.map((msg) => (
          loggedInUser ? (
          // </MessageItem><MessageItem key={msg.mid} isMine={msg.user_email === "kh32100@naver.com"}>
          <MessageItem key={msg.mid} isMine={msg.user_email === loggedInUser.email}>
          

            <ProfileImage>{msg.user.slice(0, 1)}</ProfileImage>
            <div>
              {msg.user_email === loggedInUser.email ? (
                // 내 메시지 표시: content와 timestamp만 표시
                <>
                  <MessageBubble isMine={true}>{msg.content}</MessageBubble>
                  <MessageTime>{msg.timestamp}</MessageTime>
                </>
              ) : (
                // 다른 사용자의 메시지 표시
                <>
                  <MessageBubble isMine={false}>{msg.content}</MessageBubble>
                  <MessageTime>{msg.timestamp}</MessageTime>
                </>
              )}
            </div>
          </MessageItem>
          ) : null
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
};

export default ChatContainerComponent;
