//칸반 보드

import React from 'react';
import styled from 'styled-components';
import ChatContainer from './ChatContainer';
import TapMenu from './TapMenu';

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

const CBoard: React.FC = () => {
  return (
    <BoardContainer>
      <TapMenu />
      <ChatContainer />
    </BoardContainer>
  );
};

export default CBoard;

