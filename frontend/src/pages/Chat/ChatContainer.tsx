import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ImAttachment, ImSmile, ImCompass } from "react-icons/im";
import { IoPersonAddOutline, IoNotificationsOutline, IoLogOutOutline } from "react-icons/io5";
import { FcCollaboration } from "react-icons/fc";
import { useRecoilValue, useRecoilState } from 'recoil';
import { selectedChannelAtom } from '../../recoil/atoms/selectedChannelAtoms'; // selectedChannelAtom 가져오기
import { userState } from '../../recoil/atoms/userAtoms';
import { channelAtom } from '../../recoil/atoms/channelAtoms'; // 전체 채널 상태 관리


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

const ChatHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f0f2f4;
  border-bottom: 1px solid #ddd;
  font-size: 18px;
  font-weight: bold;
`;

const HeaderTitle = styled.div`
  flex: 1;
  font-size: 18px;
  font-weight: bold;
`;

const HeaderIcons = styled.div`
  display: flex;
  gap: 15px;
  font-size: 20px;
  color: #555;
  cursor: pointer;

  svg {
    &:hover {
      /* color: #007bff; */
      color: #038c8c;
    }
  }
`;



const ChatContainerComponent: React.FC = () => {
  // const selectedChannel = useRecoilValue(selectedChannelAtom); // 선택된 채널 구독
  // const [selectedChannel, setSelectedChannel] = useRecoilState(selectedChannelAtom);
  const [selectedChannel, setSelectedChannel] = useRecoilState(selectedChannelAtom);
  const loggedInUser = useRecoilValue(userState);//로그인한 유저 이메일은 userState에서 가져온다
  const [newMessages, setNewMessages] = useState<Array<any>>([]); // 추가 메시지 상태
  const [currentInput, setCurrentInput] = useState(''); // 입력 필드 상태
  const [channels, setChannels] = useRecoilState(channelAtom); // 전체 채널 상태 관리


  // 메시지 전송 핸들러 _ 메시지 추가할 때 selectedChannel상태 업데이트
  const handleSendMessage = () => {
    if (!currentInput.trim() || !selectedChannel) return;

    const newMessage = {
      mid: new Date().getTime(), // 혹은 UUID 등 고유 ID 생성 로직
      content: currentInput,
      timestamp: new Date().toLocaleTimeString(),
      user: loggedInUser?.uname || '(알수없음)',
      user_email: loggedInUser?.email || '(이메일없음)',
    };

    // selectedChannel 업데이트
    setSelectedChannel((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage], // 기존메시지에서 새 메시지 추가
    }));

    setChannels((prevChannels) =>
      prevChannels.map((channel) =>
        channel.rid === selectedChannel.rid
          ? {
            ...channel,
            messages: [...selectedChannel.messages, newMessage], // 배열로 보장
          }
          : channel
      )
    );

    // 입력 필드 초기화
    setCurrentInput(''); 
  };

  return (
    <ChatContainer>
      
      <ChatHeaderContainer>
        <HeaderTitle>{selectedChannel?.rname || '대화를 시작해보세요!'}</HeaderTitle>
        {selectedChannel?.rname && (
          <HeaderIcons>
            <IoPersonAddOutline />
            <IoNotificationsOutline />
            <IoLogOutOutline />
          </HeaderIcons>
        )}
      </ChatHeaderContainer>

      <MessageList>
        {selectedChannel?.messages && selectedChannel.messages.length > 0 ? (

          selectedChannel?.messages.map((msg, index) => (
            <MessageItem key={`msg-${index}`} isMine={msg.user_email === loggedInUser?.email}>
              {loggedInUser && msg.user_email !== loggedInUser.email && (
                <ProfileImage>{msg.user.slice(0, 1)}</ProfileImage>
              )}
              <MessageBubble isMine={msg.user_email === loggedInUser?.email}>
                {msg.content}
              </MessageBubble>
              <MessageTime>{msg.timestamp}</MessageTime>
              {/* <MessageTime>{new Date(msg.timestamp).toLocaleTimeString()}</MessageTime> */}
            </MessageItem>
          ))
        ) : (
          // messages가 null 또는 빈 배열일 경우에만 렌더링
          <FcCollaboration style={{ fontSize: "300px", margin: "100px auto", display: "block" }} />
        )}
      </MessageList>

      {selectedChannel?.rname ? (
        <InputContainer>
          <InputField placeholder="메시지 입력" value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <InputIcon> <ImAttachment /><ImSmile /><CompassIcon onClick={handleSendMessage} />
          </InputIcon>
        </InputContainer>
      ) : ( <></> )}

    </ChatContainer>
  );
};

export default ChatContainerComponent;
