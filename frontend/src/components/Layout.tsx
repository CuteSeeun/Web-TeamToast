// components/Layout.tsx
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <LayoutContainer>
            <Header />
            <Sidebar />
            <MainContent>
                {children}
            </MainContent>
        </LayoutContainer>
    );
};

export default Layout;
