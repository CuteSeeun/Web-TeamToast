// components/Layout.tsx
//세은
import Header from './MainHeader';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  height: 100vh; 
  overflow: hidden; /* 세로와 가로 스크롤 방지 */
  display: flex;
  flex-direction: column;
`;

const Layout= () => {
    return (
        <LayoutContainer>
            <Header/>
            <Outlet/>
            {/* 푸터 */}
        </LayoutContainer>
    );
};

export default Layout;
