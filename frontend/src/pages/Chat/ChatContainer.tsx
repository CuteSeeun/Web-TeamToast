import React, { useEffect, useState, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { ImAttachment, ImSmile, ImCompass } from "react-icons/im";
import { IoPersonAddOutline, IoNotificationsOutline, IoNotificationsOffOutline, IoNotificationsCircleOutline, IoNotificationsOffCircleOutline, IoLogOutOutline } from "react-icons/io5";
import { FcCollaboration } from "react-icons/fc";
import { useRecoilValue, useRecoilState } from 'recoil';
import { selectedChannelAtom } from '../../recoil/atoms/selectedChannelAtoms'; // selectedChannelAtom 가져오기
import { userState } from '../../recoil/atoms/userAtoms';
import { channelAtom } from '../../recoil/atoms/channelAtoms'; // 전체 채널 상태 관리
import gif from '../../assets/images/noMessage.gif';
import chatAlert from '../../assets/images/chatAlert.svg';
import { sendMessage, onMessage, offMessage } from '../../socketClient'; // 소켓 메시지 전송 함수 가져오기
import ExitModal from './ExitModal';
import AddFriendModal from './AddFriendModal'; // AddFriendModal 가져오기

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
const ChatContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  /* border: 1px solid #ddd; */
`;
const ChatHeader = styled.div`
  padding: 10px 20px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  font-size: 18px;
  font-weight: bold;
`;
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
  /* background: pink; */
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
  align-items: center; /* 수직 가운데 정렬 */
  gap: 8px; /* 아이콘 간 간격, 이건 display: flex를 줘야 먹힘 */
  font-size: 18px;
  color: #aaa;
  cursor: pointer;

  &:hover {
    color: #007bff;
  }
`;
const StyledAttachmentIcon = styled(ImAttachment)`
  font-size: 18px;
  color: #aaa;
  cursor: pointer;

  &:hover {
    color: #007bff; /* 호버 시 색상 변경 */
  }
`;
const StyledSmileIcon = styled(ImSmile)`
  font-size: 18px;
  color: #aaa;
  cursor: pointer;

  &:hover {
    color: #007bff; /* 호버 시 색상 변경 */
  }
`;
const StyledCompassIcon = styled(ImCompass)`
  font-size: 18px;
  background-color: #038c8c; /* 배경 색상 */
  color: white; /* 아이콘 색상 */
  border-radius: 20%; /* 둥글게 */
  padding: 8px; /* 내부 여백 */
  cursor: pointer;

  &:hover {
    background-color: #026b6b; /* 호버 시 배경 색상 변경 */
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
// 임시 아이콘 스타일
const TemporaryIcon = styled.div<{ fading: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  // border-radius: 50%;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  z-index: 1000;

  opacity: ${({ fading }) => (fading ? 0 : 1)};
  ${({ fading }) =>
    fading &&
    css`
      animation: ${fadeOut} 1.5s;
    `}
`;
// 페이드아웃 애니메이션 정의
const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const EmojiPickerWrapper = styled.div`
  position: absolute;
  bottom: 50px; /* 입력창 위로 띄우기 */
  right: 20px;
  z-index: 1000;
`;

interface Message {
  mid: number;       // 메시지 ID (고유값, UUID 사용 권장)
  rid: number;       // 방 ID
  content: string;    // 메시지 내용
  timestamp: string;  // 메시지가 생성된 시간 (ISO 8601 형식)
  user_email: string;  // 보낸 사용자 이름
  user: string; // 보낸 사용자 이메일
};


const ChatContainerComponent: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useRecoilState(selectedChannelAtom);//사용자가 선택한 채널의 정보를 저장
  const loggedInUser = useRecoilValue(userState);//로그인한 유저 이메일은 userState에서 가져온다 : 현재 로그인한 사용자의 정보를 저장
  const [newMessages, setNewMessages] = useState<Array<any>>([]); // 추가 메시지 상태 : 새로운 메시지들을 저장. 메시지가 추가될 때 업데이트된다다
  const [currentInput, setCurrentInput] = useState(''); // 입력 필드 상태 : 입력창의 텍스트 상태를 관리
  const [channels, setChannels] = useRecoilState(channelAtom); // 전체 채널 상태 관리 : 전체 채널 목록과 각 채널의 메시지 상태를 관리
  const [isExitModalOpen, setExitModalOpen] = useState(false); // 나가기 모달 상태 관리 : 채팅방 퇴장 모달의 열림/닫힘 상태를 관리
  const [isNotificationsOn, setNotificationsOn] = useState(true); // 알림 상태 관리 : 알림 설정 상태를 관리
  const [temporaryIcon, setTemporaryIcon] = useState<React.ReactNode | null>(null); //화면중앙의 아이콘(알림 설정) : 알림 상태 변경 시 임시로 화면 중앙에 표시할 아이콘을 저장.
  const [isFading, setFading] = useState(false); // 페이드아웃 상태 관리 : 임시 아이콘의 페이드아웃 애니메이션 상태를 관리
  const [isFriendModalOpen, setFriendModalOpen] = useState(false); // 대화상대 초대 모달 상태 : 대화상태 초대 모달 열림/닫힘 상태 관리
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // 이모티콘 선택기 상태 : 이모티콘 선택기의 표시 상태를 관리
  // const messageListRef = useRef<HTMLDivElement | null>(null); // 메시지 리스트 참조
  //selectedChannel과 newMesages : selectedChannel의 메시지 리스트를 업데이트할 때 새 메시지를 추가한다. 


  // 채팅방 퇴장 모달을 열거나 닫는 핸들러
  const OpenExitModal = () => setExitModalOpen(true);
  const CloseExitModal = () => setExitModalOpen(false);

  // 채팅방 퇴장 시 실행될 로직
  const handleLeaveChannel = () => {
    console.log('채널에서 퇴장했습니다.');
    setExitModalOpen(false);

    //rid(채팅방번호)에서 로그인한 유저 이메일로 룸멤버테이블에서 해당 레코드 삭제하기

  };


  // 알림 토글 핸들러
  const toggleNotifications = () => {
    // 알림 상태 변경 및 임시 아이콘 설정
    if (isNotificationsOn) {
      setTemporaryIcon(<IoNotificationsOffCircleOutline />);
    } else {
      setTemporaryIcon(<IoNotificationsCircleOutline />);
    }
    setNotificationsOn((prev) => !prev); // 상태 반전
    // 페이드아웃 시작 후 1.5초 후 아이콘 제거
    setTimeout(() => setFading(true), 1000); // 1초 후 페이드아웃 시작
    setTimeout(() => {
      setTemporaryIcon(null);
      setFading(false); // 상태 초기화
    }, 1500); // 1.5초 후 완전히 제거
  };

  // 대화상대 초대 모달 열기 및 닫기 핸들러
  const openFriendModal = () => setFriendModalOpen(true);
  const closeFriendModal = () => setFriendModalOpen(false);

  // 대화상대 초대 완료 핸들러
  const handleApplyFriends = (selectedMembers: any[]) => {
    console.log('선택된 멤버:', selectedMembers);
    setFriendModalOpen(false);
    // 여기서 선택된 멤버에 대한 로직을 추가할 수 있음
  };

  // 이모티콘 추가 핸들러
  const addEmoji = (emoji: any) => {
    setCurrentInput((prev) => prev + emoji.native); // 입력창에 이모티콘 추가
    setShowEmojiPicker(false); // 선택 후 이모티콘 선택기 닫기
  };


  // useEffect(() => {
  //   // 새로운 메시지 수신 핸들러 등록
  //   onMessage((newMessage) => {
  //     console.log("새 메시지 수신:", newMessage);

  //     // 메시지를 현재 채널에 추가
  //     setSelectedChannel((prev) => {
  //       if (!prev || prev.rid !== newMessage.rid) return prev; // 현재 채널이 아닐 경우 무시
  //       return {
  //         ...prev,
  //         messages: [...prev.messages, newMessage], // 메시지 추가
  //       };
  //     });

  //     // 전체 채널 상태도 업데이트
  //     setChannels((prevChannels) =>
  //       prevChannels.map((channel) =>
  //         channel.rid === newMessage.rid
  //           ? {
  //               ...channel,
  //               messages: [...channel.messages, newMessage],
  //             }
  //           : channel
  //       )
  //     );
  //   });

  //   // 컴포넌트 언마운트 시 핸들러 제거
  //   return () => {
  //     offMessage();
  //   };
  // }, [setSelectedChannel, setChannels]);


  useEffect(() => {
    onMessage((newMessage) => {
      console.log('onMessage 호출됨:', newMessage);

      // 선택된 채널에 메시지 추가
      setSelectedChannel((prev) => {
        console.log('이전 상태:', prev);
        console.log('받은 메시지의 rid:', newMessage.rid);
        if (!prev || prev.rid !== newMessage.rid) {
          console.log('현재 채널이 아니므로 업데이트 안 함');
          return prev; // 다른 채널 메시지는 무시
        }
        return {
          ...prev,
          messages: [...(prev.messages || []), newMessage],
        };
      });
    });

    return () => {
      // offMessage();
    };
  }, [selectedChannel, newMessages]);

  // 메시지 전송 핸들러 _ 메시지 추가할 때 selectedChannel상태 업데이트
  const handleSendMessage = () => {
    if (!currentInput.trim() || !selectedChannel) return;

    const newMessage: Message = {
      mid: new Date().getTime(), // 혹은 UUID 등 고유 ID 생성 로직
      rid: selectedChannel.rid,
      content: currentInput,
      timestamp: new Date().toLocaleTimeString(),
      user_email: loggedInUser?.email || '(이메일없음)',
      user: loggedInUser?.uname || '(알수없음)',
    };

    // 소켓을 통해 서버로 메시지 전송
    sendMessage(newMessage);

    // selectedChannel 업데이트
    setSelectedChannel((prev) => ({
      ...prev,
      messages: [...prev.messages], // 기존메시지에서 새 메시지 추가
    }));

    // setChannels((prevChannels) =>
    //   prevChannels.map((channel) =>
    //     channel.rid === selectedChannel.rid
    //       ? {
    //         ...channel,
    //         messages: [...selectedChannel.messages, newMessage], // 배열로 보장
    //       }
    //       : channel
    //   )
    // );

    // 입력 필드 초기화
    setCurrentInput('');
  };

  // 메시지가 추가되거나 렌더링될 때 스크롤을 가장 아래로 설정
  // useEffect(() => {
  //   if (messageListRef.current) {
  //     messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  //   }
  // }, [selectedChannel?.messages]); // 메시지가 변경될 때 실행

  return (
    <ChatContainer>

      <ChatHeaderContainer>
        <HeaderTitle>{selectedChannel?.rname || '대화를 시작해보세요!'}</HeaderTitle>
        {selectedChannel?.rname && (
          <HeaderIcons>
            <IoPersonAddOutline onClick={openFriendModal} />
            {isNotificationsOn ? (
              <IoNotificationsOutline onClick={toggleNotifications} />
            ) : (
              <IoNotificationsOffOutline onClick={toggleNotifications} />
            )}
            <IoLogOutOutline onClick={OpenExitModal} />
          </HeaderIcons>
        )}

        {isFriendModalOpen && (
          <AddFriendModal onClose={closeFriendModal} onApply={handleApplyFriends} />
        )}
        {temporaryIcon && <TemporaryIcon fading={isFading}>{temporaryIcon}</TemporaryIcon>}
        {/* 모달 표시 */}
        {isExitModalOpen && (
          <ExitModal onClose={CloseExitModal} onLeave={handleLeaveChannel} />
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
          // <FcCollaboration style={{ fontSize: "300px", margin: "100px auto", display: "block" }} />

          // <img
          //   src={gif}
          //   alt="로딩 중"
          //   style={{ width: "300px", margin: "100px auto", display: "block" }}
          // />
          <div style={{ textAlign: "center" }}>
            <img
              src={chatAlert}
              alt="채팅 알림"
              style={{ width: "300px", margin: "50px auto", display: "block" }}
            />
            <p style={{ textAlign: "center", fontSize: "20px", color: "#555" }}>
              채널을 선택해주세요
            </p>
          </div>

        )}
      </MessageList>


      {selectedChannel?.rname ? (
          <InputContainer>
            <InputField placeholder="메시지 입력" value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <InputIcon>
              <StyledSmileIcon onClick={() => setShowEmojiPicker((prev) => !prev)} />
              <StyledAttachmentIcon />
              <StyledCompassIcon onClick={handleSendMessage} />
            </InputIcon>
            {/* {showEmojiPicker && (
              <EmojiPickerWrapper>
                <Picker onEmojiSelect={addEmoji} />
              </EmojiPickerWrapper>
            )} */}
          </InputContainer>
        ) : (<></>)
      }

    </ChatContainer >
  );
};

export default ChatContainerComponent;
