import React, { useState } from "react";
import styled from "styled-components";
import Picker from '@emoji-mart/react';
// import 'emoji-mart/css/emoji-mart.css';
import { ImSmile } from "react-icons/im";

// 스타일 정의
const ChatContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const StyledSmileIcon = styled(ImSmile)`
  font-size: 24px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    color: #007bff;
  }
`;

const EmojiPickerWrapper = styled.div`
  position: absolute;
  bottom: 50px;
  right: 10px;
  z-index: 1000;
`;

const ChatInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
`;

const ChatUI: React.FC = () => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false); // 이모티콘 선택기 표시 상태
    const [inputValue, setInputValue] = useState(""); // 입력값 상태

    // Picker를 any로 캐스팅
    const EmojiPicker = Picker as any;

    // 이모티콘 클릭 핸들러
    const addEmoji = (emoji: any) => {
        setInputValue((prev) => prev + emoji.native); // 입력창에 이모티콘 추가
        setShowEmojiPicker(false); // 선택 후 선택기 닫기
    };

    return (
        <ChatContainer>
            <div style={{ display: "flex", alignItems: "center" }}>
                <StyledSmileIcon
                    onClick={() => setShowEmojiPicker((prev) => !prev)} // 클릭 시 토글
                />
                <ChatInput
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                />
            </div>

            {/* 이모티콘 선택기 */}
            {showEmojiPicker && (
                <EmojiPickerWrapper>
                    <EmojiPicker onEmojiSelect={addEmoji} />
                </EmojiPickerWrapper>
            )}
        </ChatContainer>
    );
};

export default ChatUI;
