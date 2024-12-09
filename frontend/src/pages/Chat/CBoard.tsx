//칸반 보드

import React, { useEffect } from 'react';
import styled from 'styled-components';
import ChatContainer from './ChatContainer';
import TapMenu from './TapMenu';

import { connectSocket, disconnectSocket } from '../../socketClient';


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
  //프로젝트 -> 활성스프린트 들어갈 때 작성할 코드
  useEffect(() => {
    // 컴포넌트가 마운트될 때 소켓 연결
    connectSocket();

    // 컴포넌트가 언마운트될 때 소켓 연결 해제
    return () => {
      disconnectSocket();
    };
  }, []); // 빈 의존성 배열로 처음 렌더링될 때 한 번만 실행

  return (
    <BoardContainer>
      <TapMenu />
      <ChatContainer />
    </BoardContainer>
  );
};

export default CBoard;

